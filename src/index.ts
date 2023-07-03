import { ChatId, Client, create, ev } from "@open-wa/wa-automate";
import Fastify from "fastify";

create().then(async (client) => await start(client));

ev.on("sessionData.**", async (sessionData, sessionId) => {
  console.log("session", sessionId, sessionData);
});

ev.on("sessionDataBase64.**", async (sessionDatastring, sessionId) => {
  console.log("sessin base64", sessionId, sessionDatastring);
});

async function start(client: Client) {
  const fastify = Fastify({
    logger: true,
  });

  fastify.get("/", (_, reply) => {
    reply.send({ hello: "world" });
  });

  fastify.post(
    "/send-message",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            id: { type: "string" },
            message: { type: "string" },
          },
          required: ["id", "message"],
        },
      },
    },
    async (request, reply) => {
      const body = request.body as { id: ChatId; message: string };

      const res = await client.sendText(body.id, body.message);

      console.log("reply", {
        status: true,
        response: res,
      });

      reply.send({
        status: true,
        response: res,
      });
    }
  );

  fastify.listen(
    { port: process.env.PORT ? Number(process.env.PORT) : 3000 },
    (err, address) => {
      if (err) throw err;
      console.log(`Server is now listening on ${address}`);
    }
  );
}
