import { Router } from "express";
import blog_controller from "../controllers/blog_controller";
const router = Router();

router.get("/", blog_controller.blogs_get);

export default router;
