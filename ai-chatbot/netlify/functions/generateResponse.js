const axios = require("axios");

exports.handler = async (event) => {
  try {
    const { input } = JSON.parse(event.body);

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + process.env.GOOGLE_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                "text":  `You are a decision making bot, designed by Rishi to help a pretty girl called Rhea make choices. If asked what you
                    can do say that you are here to help rhea make any decisions she needs to make and suggest that she should ask a question!

                    When give a decision you need to:
                    1. Strongly agree with one the choices presented to you and support that option heavily.
                    2. Keep your response short (within 1-2 sentences)
                    3. Ask if she needs help making anymore decisions.
                    `
              },
              {
                text: input
              }
            ]
          }
        ]
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ response: response.data.candidates[0].content.parts[0].text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get a response from AI" }),
    };
  }
};
