document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");
    const messageContainer = document.getElementById("message-container");

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message !== "") {
            sendMessage(message, "sender");
            messageInput.value = "";
        }
    });

    function sendMessage(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = message;
        messageElement.classList.add(sender); // Add class to differentiate sender and receiver
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        socket.emit("chat message", message);
    }

    socket.on("chat message", (message) => {
        displayReceivedMessage(message);
    });

    function displayReceivedMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = message;
        messageElement.classList.add("receiver"); // Add class to differentiate sender and receiver
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});
