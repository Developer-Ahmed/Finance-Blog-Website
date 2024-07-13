const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: "A title is required!",
    },
    coverImage: {
        type: Buffer,
        required: "A cover image is required!"
    },
    coverImageType: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: "Content is required!"
    },
    description: {
        type: String,
        required: "Description is required!"
    },
    sanitizedHtml: {
        type: String,
        required: "Validation Failed!"
    },
    createdAt: {
        type: Date,
        required: true
    },
    author: {
        type: String,
        required: true
    }, 
    topStory: {
        type: Array,
        required: true
    },
    attachment: {
        type: Buffer,
        required: "An attachment is required!"
    },
    attachmentType: {
        type: String,
        required: true
    },
    articleNumber: {
        type: Number,
        required: true
    },
    articleOrder: {
        type: Number,
        required: true
    }
});

storySchema.virtual('attachmentPath').get(function() {
    if (this.attachment != null && this.attachmentType != null) {
      return `data:${this.attachmentType};charset=utf-8;base64,${this.attachment.toString('base64')}`
    }
});

storySchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
});

module.exports = mongoose.model("Stories", storySchema);