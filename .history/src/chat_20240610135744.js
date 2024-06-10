const socket = io();

const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('/message-tone.mp3');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on('clients-total', (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`;
});

function sendMessage() {
  if (messageInput.value === '') return;

  const data = {
    taskId: taskId,  // Use the injected taskId
    sender: loggedInUsername, 
    reciever:  // Use the injected loggedInUsername
    message: messageInput.value,
    dateTime: new Date().toISOString(),
  };

  console.log('Sending message:', data);  // Debugging log
  socket.emit('message', data);
  addMessageToUI(true, data);
  messageInput.value = '';
}

socket.on('chat-message', (data) => {
  console.log('Received message:', data);  // Debugging log
  messageTone.play();
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
      <p class="message">
        ${data.message}
        <span>${data.sender} ● ${moment(data.dateTime).fromNow()}</span>
      </p>
    </li>
  `;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${loggedInUsername} is typing a message`,
  });
});

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${loggedInUsername} is typing a message`,
  });
});

messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: '',
  });
});

socket.on('feedback', (data) => {
  clearFeedback();
  const element = `
    <li class="message-feedback">
      <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
  `;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
