import { Router } from "express";
const router = Router();

router.get("/", (req, res, next) => {
  res.render("homePage");
});

export default router;
