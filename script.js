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
    const lines = text.split('\n');
    let html = '';
    let inOrderedList = false;
    let inUnorderedList = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Inline formatting
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Numbered list: "1. item"
        const orderedMatch = line.match(/^\d+\.\s+(.*)/);
        // Bullet list: "- item" or "* item"
        const unorderedMatch = line.match(/^[-*]\s+(.*)/);

        if (orderedMatch) {
            if (!inOrderedList) {
                if (inUnorderedList) { html += '</ul>'; inUnorderedList = false; }
                html += '<ol>';
                inOrderedList = true;
            }
            html += '<li>' + orderedMatch[1] + '</li>';
        } else if (unorderedMatch) {
            if (!inUnorderedList) {
                if (inOrderedList) { html += '</ol>'; inOrderedList = false; }
                html += '<ul>';
                inUnorderedList = true;
            }
            html += '<li>' + unorderedMatch[1] + '</li>';
        } else {
            if (inOrderedList) { html += '</ol>'; inOrderedList = false; }
            if (inUnorderedList) { html += '</ul>'; inUnorderedList = false; }
            if (line.trim() === '') {
                html += '<br>';
            } else {
                html += '<p>' + line + '</p>';
            }
        }
    }

    if (inOrderedList) html += '</ol>';
    if (inUnorderedList) html += '</ul>';

    return html;
}

function appendMessage(text, sender) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', sender + '-wrapper');

    const div = document.createElement('div');
    div.classList.add('message', sender);
    const id = 'msg-' + Date.now();
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
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}