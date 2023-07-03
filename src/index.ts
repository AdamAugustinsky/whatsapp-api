import { Client, create, ev } from "@open-wa/wa-automate";

create().then((client) => start(client));

ev.on("sessionData.**", async (sessionData, sessionId) => {
  console.log(sessionId, sessionData);
});

async function start(client: Client) {
  const groups = await client.getAllGroups();

  const groupId = groups.find(
    (group) => group.name === "Teste envios automaticos"
  )?.id;

  if (groupId) {
    const res = await client.sendText(groupId, "teste");

    console.log("message sent", res);
  }

  client.onMessage(async (message) => {
    if (message.body === "Hi") {
      await client.sendText(message.from, "👋 Hello!");
    }
  });
}
