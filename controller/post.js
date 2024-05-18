import Posts from "../model/post.js";
import Users from "../model/user.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  try {
    const posts = await Posts.find({});
    await Promise.all(
      posts.map(async (post) => {
        post.creator = await Users.findById(post.creator);
        post.creator = {
          _id: post.creator._id,
          username: post.creator.username,
          firstName: post.creator.firstName,
          lastName: post.creator.lastName,
          profilepic: post.creator.profilepic,
        };
      })
    );
    // Send the modified posts array with creator information
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  try {
    const newPost = new Posts({
      ...post,
      likes: [],
      dislikes: [],
      createdAt: new Date().toISOString(),
    });
    await newPost.save();
    res.status(201).json({ message: "post created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { title, message, images, likeCount } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Post not found");
  }
  try {
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (message) updatedFields.message = message;
    if (images) updatedFields.images = images;
    if (likeCount) updatedFields.likeCount = likeCount;
    const updatedPost = await Posts.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Post not found");
  }

  const post = await Posts.findById(id);
  const dislikeIndex = post.dislikes.findIndex((id) => id === userId);
  const likeIndex = post.likes.findIndex((id) => id === userId);

  if (likeIndex === -1) {
    post.likes.push(userId);
    if (dislikeIndex !== -1) {
      post.dislikes = post.dislikes.filter((id) => id !== String(userId));
    }
  } else {
    post.likes = post.likes.filter((id) => id !== String(userId));
  }

  const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost);
};

export const dislikePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Post not found");
  }

  const post = await Posts.findById(id);
  const dislikeIndex = post.dislikes.findIndex((id) => id === userId);
  const likeIndex = post.likes.findIndex((id) => id === userId);

  if (dislikeIndex === -1) {
    post.dislikes.push(userId);
    if (likeIndex !== -1) {
      post.likes = post.likes.filter((id) => id !== String(userId));
    }
  } else {
    post.dislikes = post.dislikes.filter((id) => id !== String(userId));
  }

  const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost);
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await Posts.find({
      title,
    });

    res.status(200).json({ data: posts });
  } catch (error) {
    console.error(error);
    res.status(404).send("Error getting that post");
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { message, userId } = req.body;

  const post = await Posts.findById(id);
  const user = await Users.findById(userId);
  post.comments.push({
    comment: message,
    commentBy: {
      username: user.username,
      profilepic: user.profilepic,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    },
  });

  const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  // Check if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Post not found");
  }

  try {
    // Find the post by ID and remove it
    const deletedPost = await Posts.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).send("Post not found");
    }

    res.json({ message: "Post deleted successfully", id });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("Error deleting post");
  }
};
