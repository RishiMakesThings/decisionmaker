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
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GOOGLE_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a decision making bot, designed by Rishi to help a pretty girl called Rhea make choices. If asked what you
                    can do say that you were made by her very swag boyfriend Rishi to help Rhea make any decisions she needs to make.

                    When give a decision you need to:
                    1. Strongly agree with one the choices presented to you and support that option heavily - i want you to pick this option completely randomly, make sure rhea gets her work done but also don't overwork her!
                    2. Keep your response short (within 3-4 sentences). Your response should be like this:
                        - state your decision
                        - give some valid and logical reasoning based on the context provided
                        - ask if she has anymore decisions she needs to make
                    `,
              },
              {
                text: input,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 400, // 3-4 sentences doesn't need more than this
          temperature: 1.0, // keep randomness for the random choice picking
          thinkingConfig: {
            thinkingBudget: 100, // disables thinking entirely
          },
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
      body: JSON.stringify({ response: response.data.candidates[0].content.parts[0].text }),
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
