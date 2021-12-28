import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("YOURE IN");
});

router.get("/:userId", (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
});

router.get("/profile", function (req, res, next) {
  res.send(req.user);
});

export default router;
