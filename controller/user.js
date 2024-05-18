import Users from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(409).json({ message: "invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JSON_SECRET,
      {
        expiresIn: "5h",
      }
    );

    res.status(200).json({ user: user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signupUser = async (req, res) => {
  const {
    firstName,
    LastName,
    email,
    username,
    password,
    dateOfBirth,
    profilepic,
  } = req.body;

  try {
    const existingEmailUser = await Users.findOne({ email });
    const existingUsernameUser = await Users.findOne({ username });

    if (existingEmailUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    if (existingUsernameUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      firstName,
      LastName,
      email,
      username,
      dateOfBirth,
      profilepic,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findOne({ _id: id });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const updateUser = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("User not found");
  }

  const {
    profilepic,
    username,
    lastName,
    firstName,
    dateOfBirth,
    location,
    bio,
  } = req.body;

  try {
    const updatedFields = {};
    if (profilepic) updatedFields.profilepic = profilepic;
    if (username) updatedFields.username = username;
    if (lastName) updatedFields.lastName = lastName;
    if (firstName) updatedFields.firstName = firstName;
    if (dateOfBirth) updatedFields.dateOfBirth = dateOfBirth;
    if (location) updatedFields.location = location;
    if (bio) updatedFields.bio = bio;
    const updatedUser = await Users.findByIdAndUpdate(_id, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send("Post not found");
    }

    res.json(updatedUser);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("Error updating post");
  }
};
