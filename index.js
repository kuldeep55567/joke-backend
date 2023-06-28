const express = require('express');
const cors = require("cors")
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const app = express();
app.use(cors())
const port = 3000;
app.use(express.json());
app.use(express.static('public'));
app.get('/',async(req,res)=>{
try {
  res.send({"mssg":"Welcome to Backend of Joke-Telling App"})
} catch (error) {
  res.send({"mssg":error.message})
}
})
app.post('/generateJoke', async (req, res) => {
  const { topic } = req.body;
  const configuration = new Configuration({
    apiKey: process.env.KEY,
  });
  const openai = new OpenAIApi(configuration);
  const history = [];
  const user_input = `Give me a joke on topic${topic}`;
  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: 'user', content: input_text });
    messages.push({ role: 'assistant', content: completion_text });
  }
  messages.push({ role: 'user', content: user_input });
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });
    const completion_text = completion.data.choices[0].message.content;
    history.push([user_input, completion_text]);
    res.json({ joke: completion_text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
