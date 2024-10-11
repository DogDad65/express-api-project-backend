const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

const commentSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // likes: [likeSchema],
  commentDetails: {
    type: String,
    required: true,
  },
});

const postSchema = new mongoose.Schema(
  {
    photos: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
    likes: [likeSchema],
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Post: mongoose.model("Post", postSchema),
  postSchema,
};