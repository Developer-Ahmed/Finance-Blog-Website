const express = require("express");
const router = express.Router();

const adminUser = require("../schemas/adminUser");
const Story = require("../schemas/storySchema");
const bcrypt = require("bcrypt");

const checkUser = require("./checkUser");


const csurf = require('csurf');
router.use(csurf());

router.get("/", checkUser, async (req, res) => {
    const recentStories = await Story.find().sort({ createdAt: -1 });
    const topStories = await Story.find({ topStory: "on"}).sort({ articleOrder: 1});
    res.render("admin.ejs", { recentStories, topStories, csrfToken: req.csrfToken() });
});

router.post("/", checkUser, async (req, res) => {
    const story = await Story.findByIdAndUpdate(req.body.id, {articleOrder: req.body.articleOrder});
    res.redirect("/admin")
});

router.get("/login", (req, res) => {
    if(!req.user) return res.render("login.ejs", { csrfToken: req.csrfToken() });
    res.redirect("/");
});

router.post("/login", async (req, res) => {
    try {
        const user = await adminUser.findOne({ email: req.body.email });
        console.log(user);
        if (!user) {
            return res.status(400).send("Wrong email or password.");
        }

        const comparePassword = await bcrypt.compare(req.body.password, user.password); 
        console.log(comparePassword);
        if (!comparePassword) {
            res.status(400).send("Wrong email or password");
        }
        req.session.userId = user.id;
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.redirect("/admin");
    }
});

// add a method to check the user
router.get("/signup", (req, res, next) => {
    if(req.user) next();
    res.redirect("/");
}, (req, res) => {
    res.render("signup.ejs", { csrfToken: req.csrfToken() });
});

router.post("/signup", checkUser, async (req, res) => {
    const password = await bcrypt.hash(req.body.password, 10)
    var user = new adminUser({
        username: req.body.username,
        email: req.body.email,
        password: password
    }); 
    try {
        user = await user.save();
        req.session.userId = user.id;
        res.redirect("/");
        console.log(user._id);
    } catch (error) {
        return res.status(400).send("There was an error!");
    }
});

router.get("/logout", checkUser, (req, res) => {
    req.session.userId = null;
    return res.redirect("/")
});


module.exports = router;