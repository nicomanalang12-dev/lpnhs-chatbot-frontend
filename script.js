const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Your Vercel Backend URL
const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot'; 

// MAIN SEND FUNCTION
async function handleSendMessage() {
    const text = userInput.value.trim();
    
    // Prevent sending empty messages
    if (!text) return;

    // 1. Add User Message (Aligned Right via CSS 'user' class)
    appendMessage(text, 'user');
    
    // Clear input and keep focus so the user can type again immediately
    userInput.value = '';
    userInput.focus();

    // 2. Add "Thinking..." bubble (Aligned Left via CSS 'bot' class)
    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // 3. Replace "Thinking..." with the actual AI reply
        // This ensures the reply stays in the same LEFT-aligned bubble
        updateMessage(loadingId, data.reply);

    } catch (error) {
        console.error("Fetch error:", error);
        updateMessage(loadingId, "Connection error. Please check your internet or the Vercel logs!");
    }
}

// CLICK EVENT
sendBtn.addEventListener('click', handleSendMessage);

// ENTER KEY EVENT
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents a new line in the input
        handleSendMessage();
    }
});

// HELPER: CREATE NEW MESSAGE BUBBLE
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    
    // Generate a unique ID so we can find this specific bubble later
    const id = 'msg-' + Date.now() + Math.floor(Math.random() * 1000);
    msgDiv.id = id;
    
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    
    // Smooth scroll to the newest message
    scrollToBottom();
    
    return id;
}

// HELPER: UPDATE AN EXISTING BUBBLE (For the "Thinking..." effect)
function updateMessage(id, newText) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = newText;
        scrollToBottom();
    }
}

// HELPER: SCROLL TO BOTTOM
function scrollToBottom() {
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
    });
}