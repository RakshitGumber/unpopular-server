import { Schema, model } from "mongoose";

const userSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  profilepic: { type: String },
  email: {
    type: String,
    required: true,
  },
  bio: { type: String },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    isPublic: {type: Boolean, default: true},
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  followers: [
    {
      followerId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],
  followRequests: [
    {
      requestorId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],
  followings: [
    {
      followingId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],
});

const Users = model("Users", userSchema);

export default Users;
