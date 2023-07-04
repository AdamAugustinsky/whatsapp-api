import {
  ChatId,
  Client,
  create,
  ev,
  NotificationLanguage,
} from "@open-wa/wa-automate";
import express from "express";

async function start() {
  create({
    sessionId: "WPPBOT",
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: NotificationLanguage.PTBR,
    logConsole: false,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
  }).then(async (client) => await runApi(client));

  ev.on("sessionData.**", async (sessionData, sessionId) => {
    console.log("session", sessionId, sessionData);
  });

  ev.on("sessionDataBase64.**", async (sessionDatastring, sessionId) => {
    console.log("sessin base64", sessionId, sessionDatastring);
  });

  async function runApi(client: Client) {
    const app = express();

    app.use(express.json());

    app.get("/", (_, res) => {
      res.send("Hello World!");
    });

    app.post("/send-message", async (req, res) => {
      const body = req.body as { id: ChatId; message: string };

      const wppRes = await client.sendText(body.id, body.message);

      console.log("reply", {
        status: true,
        response: wppRes,
      });

      res.send({
        status: true,
        response: wppRes,
      });
    });

    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    app.listen(port, () => {
      console.log(`Server is now listening on ${port}`);
    });
  }
}

start().then().catch();
