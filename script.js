const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// This URL will be replaced with your live Vercel link later!
const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot'; 

sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Show user message on screen
    appendMessage(text, 'user');
    userInput.value = '';

    // 2. Show a temporary "loading" message
    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        // 3. Send message to the Vercel Backend
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 4. Replace loading text with the real AI response
        updateMessage(loadingId, data.reply);

    } catch (error) {
        updateMessage(loadingId, "Sorry, I'm having trouble connecting to the school servers right now. We haven't linked the Vercel backend yet!");
    }
});

// Allow hitting "Enter" to send
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.id = 'msg-' + Date.now(); // Give it a unique ID
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    
    // Auto-scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return msgDiv.id;
}

function updateMessage(id, newText) {
    document.getElementById(id).textContent = newText;
}