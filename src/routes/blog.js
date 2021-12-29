import { Router } from "express";
import blog_controller from "../controllers/blog_controller";
const router = Router();

router.get("/", blog_controller.blogs_get);

router.get("/:id", blog_controller.blog_get);

router.get("/:id/comments", blog_controller.blog_comment_get);

router.post("/:id/comments", blog_controller.blog_comment_post);

router.delete("/:id/comments", blog_controller.blog_comment_delete);

router.put("/:id/comments", blog_controller.blog_comment_put);

export default router;
