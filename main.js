import { config } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import express from 'express';
import bodyParser from 'body-parser';
config();


const app = express();
app.use(express.json());
app.use(bodyParser.json());



const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//const prompt = "Write a short poem about the sea";

const generate = async (prompt) => {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(result.text);
  return result;
}

//main();

app.post('/api/content', async(req, res) => {
  try{
         const data = req.body.question; // assume body contains JSON data
         if (!data) {
         return res.status(400).send({ error: 'Question (prompt) is required' });
         }
         const result =  await generate(data);
         res.send({
            result: result.text
         });
  }
  catch(error){
    console.error(error);
    res.status(500).send('Error generating content');
  }
});
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});