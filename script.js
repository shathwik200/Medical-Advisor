// ----- Theme Functionality -----
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleText = document.querySelector('.theme-toggle__text');

const setTheme = (theme) => {
  document.body.classList.toggle('light-mode', theme === 'light');
  document.body.classList.toggle('dark-mode', theme === 'dark');
  localStorage.setItem('theme', theme);
  themeToggleText.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
};

const currentTheme = localStorage.getItem('theme') || 'light';
setTheme(currentTheme);

themeToggle.onclick = () => {
  const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  setTheme(newTheme);
};

// ----- Chat UI Handling -----
const outputDiv = document.getElementById('output');
const chatInput = document.querySelector('.chat-input__field');
const chatForm = document.querySelector('.chat-input');

// Function to handle chat messages
async function handleChat(message) {
  try {
    // Display user message and AI thinking message
    outputDiv.innerHTML = marked.parse(`**User**: ${message}\n\n*Medical Advisor is thinking...*`);

    // Send user message to the server
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    // Display AI response
    outputDiv.innerHTML = marked.parse(`**User**: ${message}\n\n**Medical Advisor**: ${data.response}`);
  } catch (error) {
    // Display error message
    outputDiv.innerHTML = marked.parse(`❌ **Error**: ${error.message}`);
  }
}

// Event listener for form submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  chatInput.value = '';
  handleChat(message);
});

// Event listener for Shift + Enter to send message
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    chatInput.value = '';
    handleChat(message);
  }
});

// Event listeners for action buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.querySelector('.btn__text').textContent;
    chatInput.value = action + " ";
    chatInput.focus();
  });
});
