const express = require("express");
const router = express.Router();
const JSON = require("JSON");

const Story = require("../schemas/storySchema");

const validator = require("validator");

const checkUser = require("./checkUser");

const csurf = require('csurf');
router.use(csurf());

router.get("/story/:id", async (req, res) => {
    const story = await Story.findById(req.params.id);

    if(!story) return res.send("No Stories Found!");

    res.render("storyPage.ejs", { story, imageSource: story.coverImage });
});

router.get("/new", checkUser, (req, res) => {
    res.render("storyForm.ejs", { csrfToken: req.csrfToken() });
});

router.post("/new", checkUser, async (req, res) => {
    const marked = require("marked");
    const createDomPurify = require("dompurify");
    const { JSDOM } = require("jsdom");
    const dompurify = createDomPurify(new JSDOM().window);

    const articles = await Story.find();
    console.log(articles.length + 1),  100 - articles.length;

    // if(dompurify.sanitize(marked.parse(req.body.content)) == '') {
    //     return res.render("storyForm.ejs", { error: "Validation Failed!" });
    // }

    if(req.body.title == "" || req.body.coverImage == "" || req.body.content == "" || req.body.description == "" || req.body.attachments == "") {
        return res.status(400).send("Validation Failed!");
    }

    var newStory = new Story({
        title: req.body.title,
        coverImage: req.body.coverImage,
        content: req.body.content,
        description: req.body.description,
        sanitizedHtml: dompurify.sanitize(marked.parse(req.body.content)),
        createdAt: Date.now(),
        author: req.user,
        topStory: req.body.topStory,
        articleNumber: articles.length + 1,
        articleOrder: 100 - articles.length
    });


    saveAttachment(newStory, req.body.attachments, "Attachment");
    saveAttachment(newStory, req.body.coverImage, "Cover Image");

    try {
        newStory = await newStory.save();
        res.redirect("/");
        //console.log(newStory);
    } catch (error) {
        res.redirect("/stories/new");
        console.log("The error is:" + error);
    }
});

// router.get("/:id/edit", async (req, res) => {
//     const story = await Story.findById(req.params.id);

//     if(!story) return res.redirect("/");

//     res.render("editStory.ejs", { story });
// });

// router.put("/:id/edit", async (req, res) => {
//     const marked = require("marked");
//     const createDomPurify = require("dompurify");
//     const { JSDOM } = require("jsdom");
//     const dompurify = createDomPurify(new JSDOM().window);

//     const updateArticle = await Story.findByIdAndUpdate(req.params.id, req.body);
//     saveAttachment(updateArticle, req.body.attachments);

//     res.redirect(`/stories/${req.params.id}`);
// });

// router.post("/:id", (req, res) => {
//     res.download(req.body.attachmentUrl, (err) => {
//         console.log(err);
//         res.send("Error!")
//     });
// });

function saveAttachment(story, attachmentEncoded, object) {
    try {
        if (attachmentEncoded == null) return
        if (object == "Attachment") {
            const attachment = JSON.parse(attachmentEncoded);
            if (attachment != null) {
                story.attachment = new Buffer.from(attachment.data, 'base64');
                story.attachmentType = attachment.type;
            }
        } else if (object == "Cover Image") {
            const cover = JSON.parse(attachmentEncoded);
            if (cover != null) {
                story.coverImage = new Buffer.from(cover.data, 'base64');
                story.coverImageType = cover.type;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;