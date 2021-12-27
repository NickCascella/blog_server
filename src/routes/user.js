import { Router } from "express";
import passport from "../passport";

const router = Router();

router.get("/", (req, res) => {
  console.log(req.user, "CHECK");
  res.send("YOURE IN");
});

router.get("/:userId", (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
});

router.get("/profile", function (req, res, next) {
  res.send(req.user);
});

export default router;
