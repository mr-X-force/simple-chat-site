const socket = io("http://localhost:5000");  // Backend URL

// DOM Elements
const chatBox = document.querySelector("#chat-box");
const messageInput = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");

// On Form Submit
sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        sendMessage(message);
        messageInput.value = "";  // Clear input field
    }
});

// Send Message to Backend (Emit to WebSocket)
function sendMessage(message) {
    const sender = localStorage.getItem("userUID");
    const timestamp = new Date().toISOString();

    // Send message to the server via WebSocket
    socket.emit("sendMessage", { sender, message, timestamp });

    // Display message in the chat box (UI)
    appendMessage(sender, message, timestamp);
}

// Receive messages from the server
socket.on("receiveMessage", (messageData) => {
    const { sender, message, timestamp } = messageData;
    appendMessage(sender, message, timestamp);
});

// Append messages to the chat UI
function appendMessage(sender, message, timestamp) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const senderElement = document.createElement("strong");
    senderElement.innerText = sender;
    messageElement.appendChild(senderElement);

    const messageText = document.createElement("p");
    messageText.innerText = message;
    messageElement.appendChild(messageText);

    const timeElement = document.createElement("span");
    timeElement.classList.add("timestamp");
    timeElement.innerText = formatTimestamp(timestamp);
    messageElement.appendChild(timeElement);

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the bottom
}

// Format timestamp into a readable format (HH:MM AM/PM)
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = date.getHours() < 12 ? "AM" : "PM";
    return `${hours}:${minutes} ${period}`;
}

// Auto-scrolling feature for chat box
chatBox.addEventListener("scroll", () => {
    const isAtBottom = chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;
    if (isAtBottom) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

// Fetch previous messages when the user enters the chat
window.onload = () => {
    fetchMessages();
};

// Fetch previous messages from the backend (MongoDB or Firebase)
async function fetchMessages() {
    try {
        const response = await fetch("/api/chat/get");
        const messages = await response.json();
        messages.forEach((msg) => {
            appendMessage(msg.sender, msg.message, msg.timestamp);
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}
