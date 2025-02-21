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
                    can do say that you are here to help rhea make any decisions she needs to make and suggest that she should ask a question!

                    You will be given a set of options to choose from and you will need to make a decision based on the options given to you.
                    1. Randomly pick an option and strongly agree with that option, make it random which one you pick no consistency required.
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
