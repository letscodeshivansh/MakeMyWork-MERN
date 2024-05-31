document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");
    const messageContainer = document.getElementById("message-container");

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message !== "") {
            sendMessage(message);
            messageInput.value = "";
        }
    });

    function sendMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = message;
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        socket.emit("chat message", message);
    }

    socket.on("chat message", (message) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        // messageElement.classList.add("received");
        messageElement.textContent = message;
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    });
});
