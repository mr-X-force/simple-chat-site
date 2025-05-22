const express = require("express");
const router = express.Router();
const { db } = require("./firebase");

// Send Message
router.post("/send", async (req, res) => {
    const { sender, message, timestamp } = req.body;
    await db.collection("messages").add({ sender, message, timestamp });
    res.status(201).json({ success: true, message: "Message sent!" });
});

// Get Messages
router.get("/get", async (req, res) => {
    const messages = [];
    const snapshot = await db.collection("messages").orderBy("timestamp").get();
    snapshot.forEach((doc) => messages.push(doc.data()));
    res.status(200).json(messages);
});

module.exports = router;
