const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Replace with your actual Vercel backend URL
const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot'; 

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Message (Always RIGHT/Green)
    appendMessage(text, 'user');
    userInput.value = '';
    
    // 2. Add "Thinking..." bubble (Always LEFT/White)
    // We save this ID so we can replace the text later
    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 3. THE CRITICAL FIX: Update the specific "Thinking" bubble
        // This ensures NO NEW BUBBLE is created on the wrong side
        updateMessage(loadingId, data.reply);

    } catch (error) {
        console.error("Fetch error:", error);
        updateMessage(loadingId, "Connection error. Please check your internet and try again.");
    }
}

// Click and Enter listeners
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
    }
});

function appendMessage(text, sender) {
    const div = document.createElement('div');
    
    // Safety Lock: Ensure only 'bot' or 'user' classes are added
    div.className = 'message ' + sender; 
    
    // Create a unique ID for this specific bubble
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
        
        // RE-FORCE BOT STYLING:
        // This strips away any accidental 'user' styling and forces it to stay LEFT
        el.classList.remove('user');
        el.classList.add('bot'); 
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}