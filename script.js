import { OPENAI_API_KEY } from './config.js'; // config.js

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
    
    // Function to create a chat message element

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className, 'flex', 'justify-start', 'items-center', 'gap-2', 'p-2', 'rounded-lg', 'mb-2');
    chatLi.innerHTML = `<p class ='bg-grey-800 text-white p-2 rounded-lg'>${message}</p>`;
    return chatLi;
};
// Function to generate the response using OpenAI API
const generateResponse = async (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector('p');

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: messageElement.innerText }
            ]
        })
    };
    
    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) throw new Error("Error in response");
            return res.json();
        })
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Sorry, I could not generate a response.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
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
