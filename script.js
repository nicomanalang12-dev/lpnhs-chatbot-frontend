const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot'; 

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. User Message (Always RIGHT)
    appendMessage(text, 'user');
    userInput.value = '';
    
    // 2. Bot "Thinking" (Always LEFT)
    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 3. Update the SAME "Thinking" bubble (Stays LEFT)
        // This ensures it never "jumps" to the right side
        updateMessage(loadingId, data.reply);

    } catch (error) {
        updateMessage(loadingId, "Connection error. Please try again!");
    }
}

sendBtn.addEventListener('click', handleSend);

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
    }
});

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender); // 'bot' = left/grey, 'user' = right/green
    const id = 'msg-' + Date.now();
    div.id = id;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

function updateMessage(id, newText) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = newText;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}