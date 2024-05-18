import Users from "../model/user.js";

export const friendList = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "user doesn't exist" });
    }

    if (user.followers.length === 0)
      return res.status(200).json({ message: "no friends found" });
    const followers = [];
    await Promise.all(
      user.followers.map(async (i) => {
        let follower = await Users.findOne({ _id: i.followerId });
        followers.push({
          _id: follower._id,
          username: follower.username,
          profilepic: follower.profilepic,
          firstName: follower.firstName,
          lastName: follower.lastName,
        });
      })
    );

    return res.status(200).json({ data: followers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const search = async (req, res) => {
  const { search } = req.query;

  if (search.length <= 0) return res.status(404).send("Please provide a data");
  try {
    const username = new RegExp(search, "i");

    const users = await Users.find({ username });

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(404).send("An error occured: " + error);
  }
};

export const pendingRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findOne({ _id: id });

    if (!user) return res.status(404).json({ message: "user doesn't exist" });

    if (!user.followRequests)
      return res.status(404).json({ data: "noPendingRequest" });

    const requestors = [];
    await Promise.all(
      user.followRequests.map(async (i) => {
        let requestor = await Users.findOne({ _id: i.requestorId });
        requestors.push({
          _id: requestor._id,
          username: requestor.username,
          profilepic: requestor.profilepic,
          firstName: requestor.firstName,
          lastName: requestor.lastName,
        });
      })
    );

    return res.status(200).json({ data: requestors });
  } catch (error) {
    res.status(404).send("An error occured while getting pending: " + error);
  }
};

export const sendRequest = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    await Users.findByIdAndUpdate(userId, {
      $addToSet: { followRequests: { requestorId: id } },
    });
    res.status(200).json({ message: "Request sent", requestedFrom: userId });
  } catch (error) {
    res.status(404).send("An error occured: " + error);
  }
};

export const rejectRequest = async (req, res) => {
  const { requestorId } = req.body;
  const { id } = req.params;
  console.log(requestorId, id);
  try {
    await Users.findByIdAndUpdate(id, {
      $pull: { followRequests: { requestorId } },
    });
    res
      .status(200)
      .json({ message: "friend request rejected", requestedFrom: requestorId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  const { requestorId } = req.body;
  const { id } = req.params;

  try {
    await Users.findByIdAndUpdate(id, {
      $pull: { followRequests: { requestorId } },
      $addToSet: { followers: { followerId: requestorId } },
    });
    await Users.findByIdAndUpdate(requestorId, {
      $addToSet: { followings: { followingId: id } },
    });
    res
      .status(200)
      .json({ message: "friend request accepted", requestedFrom: requestorId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const followingList = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "user doesn't exist" });
    }

    if (user.followings.length === 0)
      return res.status(200).json({ message: "no friends found" });
    const followers = [];
    await Promise.all(
      user.followings.map(async (i) => {
        let follower = await Users.findOne({ _id: i.followingId });
        followers.push({
          _id: follower._id,
          username: follower.username,
          profilepic: follower.profilepic,
          firstName: follower.firstName,
          lastName: follower.lastName,
        });
      })
    );

    return res.status(200).json({ data: followers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFollower = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    await Users.findByIdAndUpdate(id, {
      $pull: { followers: { followerId: userId } },
    });
    await Users.findByIdAndUpdate(userId, {
      $pull: { followings: { followingId: id } },
    });
    res.status(200).json({ message: "Follower Removed Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFollowing = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    await Users.findByIdAndUpdate(id, {
      $pull: { followings: { followingId: userId } },
    });
    await Users.findByIdAndUpdate(userId, {
      $pull: { followers: { followerId: id } },
    });
    res.status(200).json({ message: "Following Removed Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
