(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }

  function convertMarkdownLinksToHTML(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #007bff;">$1</a>');
  }

  function addMessage(role, text) {
    const log = document.getElementById('chat-log');
    if (!log) return;

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.marginBottom = '15px';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.justifyContent = role === 'You' ? 'flex-end' : 'flex-start';

    const avatar = document.createElement('div');
    avatar.style.fontSize = '20px';
    avatar.style.marginRight = '10px';
    avatar.textContent = role === 'You' ? '🙋' : '🤖';

    const bubble = document.createElement('div');
    bubble.style.maxWidth = '70%';
    bubble.style.padding = '10px 14px';
    bubble.style.borderRadius = '18px';
    bubble.style.background = role === 'You' ? '#007bff' : '#f1f1f1';
    bubble.style.color = role === 'You' ? '#fff' : '#000';
    bubble.style.fontSize = '15px';
    bubble.style.textAlign = 'left';
    bubble.innerHTML = convertMarkdownLinksToHTML(text);

    if (role === 'You') {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatar);
    } else {
      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
    }

    log.appendChild(wrapper);
    log.scrollTop = log.scrollHeight;
  }

  function sendMessage() {
    const input = document.getElementById('user-input');
    const userMessage = input.value.trim();
    if (!userMessage) return;

    addMessage('You', userMessage);
    input.value = '';

    fetch("https://carrd-chatbot-backend.onrender.com/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    })
      .then(res => res.json())
      .then(data => addMessage('Bot', data.reply))
      .catch(err => {
        console.error(err);
        addMessage('Bot', '⚠️ Something went wrong.');
      });
  }

  function initChatUI() {
    const container = document.createElement('div');
    container.id = 'chatbox';
    container.style.maxWidth = '600px';
    container.style.margin = '40px auto';
    container.style.padding = '20px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '12px';
    container.style.fontFamily = 'sans-serif';
    container.style.backgroundColor = '#fff';

    container.innerHTML = `
      <div id="chat-log" style="height: 400px; overflow-y: auto; padding: 10px;"></div>
      <div style="display: flex; border-top: 1px solid #ddd; padding: 10px;">
        <input id="user-input" type="text" placeholder="Type a message..." style="flex: 1; padding: 10px; font-size: 16px; border-radius: 6px; border: 1px solid #ccc; text-align: left;" />
        <button id="send-button" style="padding: 10px 16px; font-size: 16px; margin-left: 8px; border-radius: 6px; background-color: #007bff; color: white; border: none;">Send</button>
      </div>
    `;

    document.body.appendChild(container);

    addMessage('Bot', "👋 Hi! Wanna chat?");
    document.getElementById('send-button').onclick = sendMessage;
    document.getElementById('user-input').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // 🚀 Run once the page is fully ready
  ready(initChatUI);
})();
