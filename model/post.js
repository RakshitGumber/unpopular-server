import { Schema, model } from "mongoose";

const postSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  images: [{ type: String }],
  comments: [
    {
      comment: { type: String, required: true },
      commentBy: {
        username: String,
        profilepic: { type: String },
        firstName: String,
        lastName: String,
        _id: String,
      },
    },
  ],
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Posts = model("Posts", postSchema);

export default Posts;
