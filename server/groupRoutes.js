const express = require("express");
const router = express.Router();
const { db } = require("./firebase");

// Create Group
router.post("/create", async (req, res) => {
    const { groupName, members } = req.body;
    const groupRef = await db.collection("groups").add({ groupName, members });
    res.status(201).json({ success: true, groupId: groupRef.id });
});

// Get Groups
router.get("/get", async (req, res) => {
    const groups = [];
    const snapshot = await db.collection("groups").get();
    snapshot.forEach((doc) => groups.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(groups);
});

module.exports = router;
