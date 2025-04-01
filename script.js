const chatInput = document.querySelector('.chat-form__input textarea');
const sendChatBtn = document.querySelector('.chat-form__button button');
const chatbox = document.querySelector('.chatbox');
const apiKey = 'OPENAI_API_KEY '; //API KEY 

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className);
    chatLi.innerHTML = `<p>${message}</p>`;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector('p');

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
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

const handleChat = () => {
    let userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    chatInput.value = "";

    setTimeout(() => {
        const incomingChatLi = createChatLi("Typing...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 1000);
};

sendChatBtn.addEventListener('click', handleChat);
chatInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") handleChat();
});

function cancel() {
    let chatbotComplete = document.querySelector('.chatbox');
    if (chatbotComplete.style.display === "none") {
        chatbotComplete.style.display = "block";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = "Are you sure you want to cancel?";
        lastMsg.classList.add("lastMessage");
        document.body.appendChild(lastMsg);
    } else {
        chatbotComplete.style.display = "none";
    }
}
