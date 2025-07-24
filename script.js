
const chatToggleBtn = document.getElementById('chat-toggle');
const chatBox = document.getElementById('chat-box');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

chatToggleBtn.addEventListener('click', () => {
  if (chatBox.style.display === 'none' || chatBox.style.display === '') {
    chatBox.style.display = 'flex';
    chatInput.focus();
  } else {
    chatBox.style.display = 'none';
  }
});

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; // ضع مفتاحك هنا

async function sendMessageToOpenAI(message) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'أنت مساعد فندق ذكي ومتعاون يساعد النزلاء بإجابات مختصرة وواضحة.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  addMessage('user', userMessage);
  chatInput.value = '';
  chatInput.disabled = true;

  try {
    const botReply = await sendMessageToOpenAI(userMessage);
    addMessage('bot', botReply);
  } catch (err) {
    addMessage('bot', 'عذراً، حدث خطأ في الاتصال بالمساعد.');
  } finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
});

function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.style.margin = '8px 0';
  messageDiv.style.padding = '8px 12px';
  messageDiv.style.borderRadius = '15px';
  messageDiv.style.maxWidth = '80%';
  messageDiv.style.wordWrap = 'break-word';

  if (sender === 'user') {
    messageDiv.style.background = '#000';
    messageDiv.style.color = 'gold';
    messageDiv.style.alignSelf = 'flex-end';
  } else {
    messageDiv.style.background = '#eee';
    messageDiv.style.color = '#222';
    messageDiv.style.alignSelf = 'flex-start';
  }

  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
