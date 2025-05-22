const express = require("express");
const router = express.Router();
const { admin, db } = require("./firebase");

// Signup
router.post("/signup", async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        const user = await admin.auth().createUser({ email, password, displayName: fullName });
        await db.collection("users").doc(user.uid).set({ fullName, email });
        res.status(201).json({ success: true, uid: user.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        res.status(200).json({ success: true, uid: userRecord.uid });
    } catch (error) {
        res.status(400).json({ error: "User not found" });
    }
});

module.exports = router;
