// // This is a simple API endpoint for a chat application using OpenAI's GPT-3.5 Turbo model.const fetch = require('node-fetch');

// const { OPENAI_API_KEY } = process.env; // Getting the API key from environment variables

// module.exports = async (req, res) => {
//   const { message } = req.body; // Assuming the message comes from frontend

//     const API_URL = "https://api.openai.com/v1/chat/completions";
//     const response = await fetch(API_URL, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [
//         { role: 'system', content: 'You are a helpful assistant.' },
//         { role: 'user', content: message },
//         ],
//     }),
//     });

//     if (!response.ok) {
//     return res.status(500).json({ error: 'Failed to get response from OpenAI' });
//     }

//     const data = await response.json();
//     res.status(200).json(data);
// };
