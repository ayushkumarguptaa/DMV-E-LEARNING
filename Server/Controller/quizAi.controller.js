import fs from "fs";
import mammoth from "mammoth";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import { shuffleArray, shuffleOptions } from "../utils/shuffle.js";


//PDF FILE EXTRACT
const extractPdfText = async (filePath) => {
  const data = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
};

//EXTRACT FILE TEXT
const extractText = async (file) => {
  if (!file || !file.path) {
    throw new Error("Invalid file");
  }

  if (file.mimetype === "application/pdf") {
    return await extractPdfText(file.path);
  }

  if (file.mimetype.includes("word")) {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value;
  }

  return fs.readFileSync(file.path, "utf-8");
};

//PROMPT
const buildPrompt = (text) => `
You are a backend API that MUST return ONLY valid JSON.

Rules:
- No explanation
- No markdown
- Only JSON
- correctIndex must be 0-3

Return EXACT format:

{
  "quizName": "Generated Quiz",
  "questions": [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "correctIndex": 0
    }
  ]
}

Generate EXACTLY 10 questions.

CONTENT:
${text.slice(0, 6000)}
`;

//API FOR GROQ AI
export const generateQuizFromFile = async (req, res) => {
  console.log("/admin/generate-quiz HIT");

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const {
      shuffleQuestions,
      shuffleOptions: shuffleOpt,
      allowTabSwitch
    } = req.body;

    //EXTRACT TEXT
    const text = await extractText(req.file);
    const prompt = buildPrompt(text);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "Return ONLY valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    console.log("GROQ RAW:", raw);

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("AI did not return JSON");
    }

    const quizJSON = JSON.parse(raw.slice(start, end + 1));

    let questions = quizJSON.questions;

     //SHUFFLE QUESTIONS
    if (shuffleQuestions === "true") {
      questions = shuffleArray(questions);
    }

    // SHUFFLE OPTIONS
    if (shuffleOpt === "true") {
      questions = questions.map(q => shuffleOptions(q));
    }

    quizJSON.questions = questions;

    return res.json({
      success: true,
      data: {
        ...quizJSON,
        allowTabSwitch: allowTabSwitch === "true",
      }
    });

  } catch (err) {
    console.error("QUIZ AI ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
