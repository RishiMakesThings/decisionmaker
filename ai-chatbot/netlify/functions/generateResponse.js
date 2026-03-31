/** @format */
const axios = require("axios");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  try {
    const { input } = JSON.parse(event.body);

    const response = await axios.post(
      // FIX 1: Use gemini-3.1-flash-lite-preview (The fastest model in 2026)
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=" + process.env.GOOGLE_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                // FIX 2: Added "Respond immediately" and "Concise" to kill "Thinking" latency
                text: `System: You are a decision bot for Rhea, made by her boyfriend Rishi. 
                   Respond immediately without internal monologue. Max 3 sentences.
                   Randomly pick a choice, be supportive, and use nicknames like gorgeous girl or rhea GAMING.
                   User: ${input}`,
              },
            ],
          },
        ],
        // FIX 3: Disable/Limit "Thinking" level for Gemini 3 models to stay under 10s
        generationConfig: {
          thinkingLevel: "OFF",
        },
      },
      { timeout: 9000 } // Local axios timeout just before Netlify kills it
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response: response.data.candidates.content.parts.text }),
    };
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "AI took too long or failed. Try a shorter question!" }),
    };
  }
};
