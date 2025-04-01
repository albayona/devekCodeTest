const io = require("socket.io-client");

const user1 = io("http://localhost:3000");
const user2 = io("http://localhost:3000");
const user3 = io("http://localhost:3000");

user1.on("connect", () => {
    console.log("User1 connected");
    user1.emit("join", "user1");
});

user2.on("connect", () => {
    console.log("User2 connected");
    user2.emit("join", "user2");
});

user3.on("connect", () => {
    console.log("User3 connected");
    user3.emit("join", "user3");
});

// Listen for messages
user1.on("message", (data) => console.log("User1 received:", data));
user2.on("message", (data) => console.log("User2 received:", data));
user3.on("message", (data) => console.log("User3 received:", data));

// Join private chat
user1.emit("join_chat", { user1: "user1", user2: "user2" });
user2.emit("join_chat", { user1: "user2", user2: "user1" });

// Send a direct message
setTimeout(() => {
    user1.emit("message", { from: "user1", to: "user2", message: "Hello User2!" });
}, 1000);

setTimeout(() => {
    user2.emit("message", { from: "user2", to: "user1", message: "Hello User1!" });
}, 1000);

// Join group chat
user1.emit("join_group", { group: "group1" });
user2.emit("join_group", { group: "group1" });
user3.emit("join_group", { group: "group1" });

// Send a group message
setTimeout(() => {
    user3.emit("g_message", { room: "group1", message: "Hello Group!" });
}, 2000);

// Disconnect after test
setTimeout(() => {
    user1.disconnect();
    user2.disconnect();
    user3.disconnect();
}, 5000);
