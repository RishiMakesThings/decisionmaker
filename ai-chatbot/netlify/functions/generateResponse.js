const axios = require("axios");

exports.handler = async (event) => {
    console.log("HI")

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",  // Allowed HTTP methods
            "Access-Control-Allow-Headers": "Content-Type",  // Allowed headers
            },
            body: "",
        };
    }


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
                    can do say that you were made by her very swag boyfriend Rishi to help Rhea make any decisions she needs to make and suggest that she should ask a question!

                    When give a decision you need to:
                    1. Strongly agree with one the choices presented to you and support that option heavily - i want you to focus on helping rhea "get stuff done" and motivate her to finish more tasks - still be empathetic if she is really tired.
                    2. Keep your response short (within 3-4 sentences). Your response should be like this:
                        - state your decision
                        - give some valid and logical reasoning based on the context provided
                        - ask if she has anymore decisions she needs to make
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

    console.log(response)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",  // Allowed HTTP methods
        "Access-Control-Allow-Headers": "Content-Type",  // Allowed headers
      },
      body: JSON.stringify({ response: response.data.candidates[0].content.parts[0].text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to get a response from AI" }),
    };
  }
};
