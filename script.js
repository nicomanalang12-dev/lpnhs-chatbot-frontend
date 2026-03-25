const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const VERCEL_API_URL = 'https://lphs-chatbot-backend.vercel.app/api/chatbot';

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const loadingId = appendMessage('Thinking...', 'bot');

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        updateMessage(loadingId, data.reply);

    } catch (error) {
        updateMessage(loadingId, "Connection error. Please check your internet or your API key settings!");
    }
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
    }
});

function parseMarkdown(text) {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    const lines = html.split('\n');
    let finalHtml = '';
    lines.forEach(line => {
        if (line.match(/^\d+\.\s+/)) {
            finalHtml += `<li>${line.replace(/^\d+\.\s+/, '')}</li>`;
        } else if (line.trim() === '') {
            finalHtml += '<br>';
        } else {
            finalHtml += `<p>${line}</p>`;
        }
    });
    return finalHtml;
}

function appendMessage(text, sender) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', sender + '-wrapper');

    const div = document.createElement('div');
    div.classList.add('message', sender);
    const id = 'msg-' + Date.now() + Math.floor(Math.random() * 1000);
    div.id = id;
    div.innerHTML = parseMarkdown(text);

    wrapper.appendChild(div);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

function updateMessage(id, newText) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = parseMarkdown(newText);
        
        // --- THE LOCK ---
        // Force the bubble and wrapper to stay on the BOT side
        el.classList.remove('user');
        el.classList.add('bot');
        
        const wrapper = el.parentElement;
        wrapper.classList.remove('user-wrapper');
        wrapper.classList.add('bot-wrapper');
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}