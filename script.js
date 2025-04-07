import { API_KEY } from './config.js'; // config.js
// import { GoogleGenAI } from "https://path/to/google/genai.js";
// import { GoogleGenAI } from "@google/genai";
// import { GoogleGenerativeAI } from "@google/generative-ai";


document.addEventListener("DOMContentLoaded", function() {
const chatInput = document.querySelector('textarea'); //selecting the textarea for user input
const chatBtn = document.querySelector('.chatbtn'); //selecting the button to open the chatbox
const sendChatBtn = document.querySelector('#sendBIN'); //selecting the button to send the message
const cancelBtn = document.querySelector('.cancelbtn'); //selecting the button to cancel the chat
const chatbox = document.querySelector('.chatbox'); //selecting the chatbox to display messages
const chatboxBtn = document.querySelector('.chatboxbtn'); //selecting the button to open the chatbox
const crossBtn = document.querySelector("#cross");

    // Check if elements exist before adding event listeners
    if (!sendChatBtn || !chatInput || !chatbox) {
        console.error("❌ Error: One or more elements not found. Check your HTML structure.");
        return;
    }
    
    // Function to create a chat message element.

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className, 'flex', 'justify-start', 'items-center', 'gap-2', 'p-2', 'rounded-lg', 'mb-2');
    chatLi.innerHTML = `<p class ='bg-grey-800 text-white p-2 rounded-lg'>${message}</p>`;
    return chatLi;
};

// Initialize the GoogleGenAI instance with Google API key
// const ai = new GoogleGenAI({ apiKey: "API_KEY" });

// Function to generate the response using GoogleGenAI API
// const generateResponse = (incomingChatLi) => {
//     const messageElement = incomingChatLi.querySelector('p');  // Get user's message

//     if (!messageElement) {
//         console.error('Message element not found');
//         return; // If no message element, exit the function
//     }

//     // generate a response
//     ai.models.generateContent({
//         model: "gemini-2.0-flash",  
//         contents: messageElement.innerText  // user's message
//     })
//     .then(response => {
//         // On success, update the message with the response text from Gemini
//         messageElement.textContent = response.text;
//     })
//     .catch((error) => {
//         // If there's an error, update the message with an error message
//         messageElement.classList.add("error");
//         messageElement.textContent = "Sorry, I could not generate a response.";
//     })
//     .finally(() => {
//         // Scroll the chatbox to the latest message
//         const chatbox = document.querySelector('.chatbox');
//         if (chatbox) {
//             chatbox.scrollTo(0, chatbox.scrollHeight);
//         }
//     });
// };
const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector('p');
    const apiKey = API_KEY; // Make sure the API_KEY is correct and imported

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: messageElement.innerText
            }]
        }]
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(res => res.json())
    .then(data => {
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
            messageElement.textContent = responseText;
        } else {
            messageElement.classList.add("error");
            messageElement.textContent = "❌ Could not get a valid response.";
        }
    })
    .catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Sorry, I could not generate a response.";
    })
    .finally(() => {
        document.querySelector('.chatbox').scrollTo(0, chatbox.scrollHeight);
    });
};


// A function to handle sending messages
const handleChat = () => {
    let userMessage = chatInput.value.trim();
    if (!userMessage) return;
    
    // Append user message to chatbox
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", "chat-outgoing");
    chatLi.innerHTML = `<p>${userMessage}</p>`;
    chatbox.appendChild(chatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    chatInput.value = ""; // Clear input field

    // Simulate bot response
    setTimeout(() => {
        const botReply = document.createElement('li');
        botReply.classList.add("chat", "chat-incoming");
        botReply.innerHTML = `<p>Typing...</p>`;
        chatbox.appendChild(botReply);
        // const incomingChatLi = createChatLi("Typing...", "chat-incoming");
        chatbox.appendChild(botReply);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(botReply);
    }, 1000);
};

sendChatBtn.addEventListener('click', handleChat);


chatInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter"){
        e.preventDefault(); // Prevents newline
        handleChat();
    }
});

// Close chatbox function
// function cancel() {
//     let chatbotComplete = document.querySelector('.chatbox');
//     if (chatbotComplete.style.display === "none") {
//         chatbotComplete.style.display = "block";
//         let lastMsg = document.createElement("p");
//         lastMsg.textContent = "Are you sure you want to cancel?";
//         lastMsg.classList.add("lastMessage");
//         document.body.appendChild(lastMsg);
//     } else {
//         chatbotComplete.style.display = "none";
//     }
// }

    crossBtn.addEventListener('click', () => {
        chatbox.innerHTML = ''; // Clear chat messages
        chatInput.value = ''; // Reset input field
    });
});   
