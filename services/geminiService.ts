import { GoogleGenAI, Type } from "@google/genai";
import type { Level, PracticeLanguage, Question, CodeValidationResult } from '../types';

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: 'A unique identifier for the question.'
      },
      type: {
        type: Type.STRING,
        enum: ['mcq', 'code'],
        description: 'The type of question: multiple-choice (mcq) or code-writing (code).'
      },
      questionText: {
        type: Type.STRING,
        description: 'The main text of the question.'
      },
      options: {
        type: Type.ARRAY,
        description: 'An array of possible answers for mcq questions. Should not be present for code questions.',
        items: {
          type: Type.STRING
        }
      },
      correctAnswer: {
        type: Type.STRING,
        description: 'For mcq, this is one of the provided options. For code, this is an example of a correct code snippet.'
      },
      explanation: {
        type: Type.STRING,
        description: 'A brief, one-sentence explanation of why the correct answer is correct.'
      }
    },
    required: ['id', 'type', 'questionText', 'correctAnswer', 'explanation']
  }
};

export const generatePracticeQuestions = async (level: Level, language: PracticeLanguage): Promise<Question[]> => {
  const prompt = `
    Generate 10 practice questions for a ${level} programmer learning ${language}.
    Provide a mix of multiple-choice (mcq) and code-writing (code) questions.
    - For "mcq" questions, you MUST provide an "options" array with 4 distinct choices.
    - For "code" questions, you MUST NOT provide an "options" array.
    - The "correctAnswer" for an "mcq" question must be one of the strings from its "options" array.
    - The "correctAnswer" for a "code" question must be a valid code snippet that answers the question.
    - Ensure each question has a unique "id".
    - For EVERY question, you MUST provide a brief, one-sentence "explanation" of why the correct answer is correct.
    - Respond ONLY with a valid JSON array that adheres to the provided schema. Do not include any other text, markdown, or explanations outside of the JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText);
    
    // Basic validation to ensure the response is an array
    if (!Array.isArray(questions)) {
        throw new Error("AI response is not a valid JSON array.");
    }

    return questions as Question[];

  } catch (error) {
    console.error("Error generating questions from Gemini:", error);
    throw new Error("Failed to generate practice questions. The AI may be experiencing issues. Please try again later.");
  }
};

export const generateModuleContent = async (moduleName: string): Promise<string> => {
  const prompt = `
    Generate a comprehensive learning guide for the programming language/technology: "${moduleName}".
    The guide should be suitable for someone starting out but also touch upon intermediate and advanced topics.
    Structure the guide with the following sections:
    1.  **Introduction**: A brief overview of what ${moduleName} is and what it's used for.
    2.  **Key Concepts (Basics)**: Cover the fundamental building blocks. Use lists for clarity.
    3.  **Intermediate Topics**: Discuss more complex subjects that a developer would encounter after mastering the basics.
    4.  **Advanced Topics**: Briefly introduce some high-level concepts or specialized areas.
    
    Format the entire response as a single, well-structured HTML string.
    - Use <h2> for main section titles (e.g., "Introduction").
    - Use <h3> for sub-headings.
    - Use <p> for paragraphs.
    - Use <ul> and <li> for lists.
    - Use <pre><code>...</code></pre> for code snippets, ensuring to escape HTML characters within the code.
    - Do NOT include <html>, <head>, or <body> tags. The output should be ready to be injected into a <div>.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    return response.text;

  } catch (error) {
    console.error(`Error generating content for ${moduleName}:`, error);
    throw new Error(`Failed to generate learning content for ${moduleName}. Please try again later.`);
  }
};

const codeValidationSchema = {
    type: Type.OBJECT,
    properties: {
        isCorrect: {
            type: Type.BOOLEAN,
            description: "Whether the user's code is a correct solution to the problem."
        },
        feedback: {
            type: Type.STRING,
            description: "A short, one-sentence explanation of why the code is correct or incorrect."
        }
    },
    required: ['isCorrect', 'feedback']
};

export const validateCodeAnswer = async (questionText: string, correctAnswer: string, userCode: string): Promise<CodeValidationResult> => {
    if (!userCode.trim()) {
        return { isCorrect: false, feedback: "Please enter some code to check." };
    }

    const prompt = `
    As an expert code evaluator, assess a user's submitted code.
    
    The original question was:
    "${questionText}"

    An example of a correct answer is:
    \`\`\`
    ${correctAnswer}
    \`\`\`

    The user submitted the following code:
    \`\`\`
    ${userCode}
    \`\`\`

    Is the user's code a functionally correct solution to the question? Minor syntax differences or alternative valid approaches are acceptable. Focus on correctness, not style.

    Respond ONLY with a valid JSON object that adheres to the provided schema. Do not include any other text, markdown, or explanations outside of the JSON object.
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: codeValidationSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (typeof result.isCorrect !== 'boolean' || typeof result.feedback !== 'string') {
            throw new Error("AI response did not match the expected schema.");
        }

        return result as CodeValidationResult;

    } catch (error) {
        console.error("Error validating code answer from Gemini:", error);
        throw new Error("Failed to validate the code. The AI may be experiencing issues. Please try again later.");
    }
};