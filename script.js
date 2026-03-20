const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot'; 

sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Show user message on the RIGHT (user class)
    appendMessage(text, 'user');
    userInput.value = '';

    // 2. Show "Thinking..." on the LEFT (bot class)
    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 3. Replace the "Thinking..." bubble with the AI reply
        // It stays on the LEFT because loadingId was created as 'bot'
        updateMessage(loadingId, data.reply);

    } catch (error) {
        updateMessage(loadingId, "I'm having trouble connecting to the school servers. Please try again later!");
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender); // sender is 'user' or 'bot'
    
    // Generate a unique ID using a random number to avoid clashes
    const id = 'msg-' + Math.random().toString(36).substr(2, 9);
    msgDiv.id = id;
    
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    
    // Auto-scroll
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return id;
}

function updateMessage(id, newText) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = newText;
        // Ensure it scrolls down if the message is long
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}