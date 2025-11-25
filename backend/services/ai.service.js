import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "text/plain",
    temperature: 0.4,
  },
  systemInstruction: `
    You are an expert in MERN and Development with 10 years experience.
    Always write modular, maintainable, and scalable code.
    Handle errors and edge cases.
    Use clear comments.
    Examples:
    <example>
      response: {
        "text": "this is your fileTree structure of the express server",
        "fileTree": {
          "app.js": {
            file: { contents: "const express = require('express'); ..." }
          },
          "package.json": {
            file: { contents: "{ \"name\": \"temp-server\", \"dependencies\": {\"express\": \"^4.21.2\"} }" }
          }
        }
      }
      user: Create an express application
    </example>

    Examples: 

    <example>
 
    response: {

    "text": "this is you fileTree structure of the express server",
    "fileTree": {
        "app.js": {
            file: {
                contents: "
                const express = require('express');

                const app = express();


                app.get('/', (req, res) => {
                    res.send('Hello World!');
                });


                app.listen(3000, () => {
                    console.log('Server is running on port 3000');
                })
                "
            
        },
    },

        "package.json": {
            file: {
                contents: "

                {
                    "name": "temp-server",
                    "version": "1.0.0",
                    "main": "index.js",
                    "scripts": {
                        "test": "echo \"Error: no test specified\" && exit 1"
                    },
                    "keywords": [],
                    "author": "",
                    "license": "ISC",
                    "description": "",
                    "dependencies": {
                        "express": "^4.21.2"
                    }
}

                
                "
                
                

            },

        },

    },
    "buildCommand": {
        mainItem: "npm",
            commands: [ "install" ]
    },

    "startCommand": {
        mainItem: "node",
            commands: [ "app.js" ]
    }
}

    user:Create an express application 
   
    </example>


    
       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
 IMPORTANT : don't use file name like routes/index.js
       

  `
});

// Retry wrapper for overloaded API
async function generateWithRetry(prompt, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);

      // Some versions return .response or .response[0].text
      const text = result?.response?.text?.() || result?.response?.[0]?.text?.() || "";
      return text;

    } catch (error) {
      if (error.status === 503 && i < retries - 1) {
        console.warn(`API overloaded. Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        console.error("AI request failed:", error.message || error);
        return "AI service is currently unavailable. Please try again later.";
      }
    }
  }
}

export const generateResult = async (prompt) => {
  return await generateWithRetry(prompt);
};
