import { Router } from "express";
import {
  getUserData,
  signupUser,
  loginUser,
  updateUser,
} from "../../controller/user.js";
import {
  friendList,
  search,
  pendingRequests,
  sendRequest,
  rejectRequest,
  acceptRequest,
  followingList,
  removeFollower,
  removeFollowing,
} from "../../controller/followers.js";

const router = Router();

router
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .get("/:id", getUserData)
  .patch("/:id", updateUser);

router
  .get("/:id/followers", friendList)
  .post("/:id/followers/remove", removeFollower)
  .get("/:id/followings", followingList)
  .post("/:id/followings/remove", removeFollowing)
  .get("/:id/followers/search", search)
  .post("/:id/followers/requests/reject", rejectRequest)
  .post("/:id/followers/requests/accept", acceptRequest);

router.route("/:id/followers/requests").get(pendingRequests).post(sendRequest);

export default router;
