const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Replace with your actual Vercel backend URL
const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot'; 

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Message (Always Green/Right)
    appendMessage(text, 'user');
    userInput.value = '';
    
    // 2. Add "Thinking..." placeholder (Always White/Left)
    // We save the ID to update this SPECIFIC bubble later
    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 3. THE FIX: Update the placeholder with the AI's reply
        updateMessage(loadingId, data.reply);

    } catch (error) {
        console.error("Error:", error);
        updateMessage(loadingId, "Connection error. Please check your internet and try again.");
    }
}

// Click listener
sendBtn.addEventListener('click', handleSend);

// Enter key listener
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
    }
});

function appendMessage(text, sender) {
    const div = document.createElement('div');
    
    // Assigns 'message' class and the sender class ('bot' or 'user')
    div.classList.add('message', sender); 
    
    // Unique ID for tracking
    const id = 'msg-' + Date.now() + Math.floor(Math.random() * 1000);
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
        
        // --- HARD ALIGNMENT FIX ---
        // This ensures that even during an update, the bubble stays on the LEFT
        el.classList.remove('user');
        el.classList.add('bot'); 
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}