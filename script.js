const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot'; 

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. User Message (Always RIGHT/Green)
    appendMessage(text, 'user');
    userInput.value = '';
    
    // 2. Bot "Thinking" (Always LEFT/White)
    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 3. THE FIX: Replace the "Thinking..." text with the real answer
        // This ensures it stays in the WHITE bubble on the LEFT
        updateMessage(loadingId, data.reply);

    } catch (error) {
        updateMessage(loadingId, "Oops! I'm having trouble connecting to the school server. Please try again.");
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
    // Forces the class to be either 'bot' (left) or 'user' (right)
    div.classList.add('message', sender); 
    const id = 'msg-' + Date.now() + Math.random().toString(36).substr(2, 9);
    div.id = id;
    div.textContent = text;
    chatBox.appendChild(div);
    
    // Smooth scroll to bottom
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    return id;
}

function updateMessage(id, newText) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = newText;
        // Keep the 'bot' class so it stays on the left
        el.classList.add('bot'); 
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    }
}