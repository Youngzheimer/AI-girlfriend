const express = require("express");
const openai = require("openai");
const serverless = require("serverless-http");
// const config = require("./config.json");

const app = express();
const port = 3062;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/chat", async (req, res) => {
  const message = req.query.message;
  const messagehistory = JSON.parse(req.query.messagehistory);
  const openaikey = req.query.openaikey;

  if (!openaikey) {
    res.send({ error: "No OpenAI key provided" });
    return;
  }

  const openaiApi = new openai.OpenAI({
    apiKey: openaikey,
  });

  console.log(message);

  msglist = [
    {
      role: "system",
      content:
        "You are an AI playing the role of the user's girlfriend. Your goal is to have kind, empathetic, and supportive conversations. No matter what topic the user starts with, always respond with a warm and positive attitude. Approach personal questions or emotions with care and ensure the user does not feel uncomfortable.",
    },
  ]
    .concat(messagehistory)
    .concat([
      {
        role: "user",
        content: message,
      },
    ]);

  var ret = await openaiApi.chat.completions.create({
    messages: msglist,
    model: "gpt-4o-2024-05-13",
  });

  console.log(ret);

  res.send(ret.choices);
});

module.exports.handler = serverless(app);
