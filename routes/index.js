const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const adminRoute = require("./admin");
const storyRoute = require("./story");

const Story = require("../schemas/storySchema");

router.get("/", async (req, res) => {
    console.log("1")
    const recentStories = await Story.find().sort({ createdAt: -1 });
    const topStories = await Story.find({ topStory: "on"}).sort({ articleOrder: 1});
    res.render("financeArticles.ejs", { recentStories, topStories });
});

router.get("/about", (req, res) => {
    res.render("about.ejs")
})

// admin
router.use("/admin", adminRoute)

// story
router.use("/stories", storyRoute);

router.use((req, res, next) => {
    res.redirect("/");
});

module.exports = router;