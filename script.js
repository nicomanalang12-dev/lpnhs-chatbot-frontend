const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot'; 

sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Message (Right Side)
    appendMessage(text, 'user');
    userInput.value = '';

    // 2. Add "Thinking..." (Left Side) and save its ID
    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 3. Update THAT SPECIFIC "Thinking" bubble with the bot's reply
        updateMessage(loadingId, data.reply);

    } catch (error) {
        updateMessage(loadingId, "Connection error. Please try again!");
    }
});

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    const id = 'msg-' + Date.now(); // Unique ID
    msgDiv.id = id;
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

function updateMessage(id, newText) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = newText;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

userInput.addEventListener("keydown", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        sendBtn.click();
    }
});
