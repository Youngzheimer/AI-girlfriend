const express = require("express");
const openai = require("openai");
// const config = require("./config.json");

const app = express();
const port = 8082;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/chat", async (req, res) => {
  const message = req.query.message;
  const messagehistory = JSON.parse(req.query.messagehistory);
  const openaikey = req.query.openaikey;

  if (!openaikey) {
    return res.send({ error: "No OpenAI key provided" });
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

  var ret = await openaiApi.chat.completions
    .create({
      messages: msglist,
      model: "gpt-4o-2024-05-13",
    })
    .catch((err) => {
      console.error(err);
      return res.send({ error: err });
    });

  console.log(ret);

  if (!ret) {
    return res.send({ error: "No response from OpenAI" });
  }
    return res.send(ret.choices);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
