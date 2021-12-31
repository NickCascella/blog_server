import { Router } from "express";
import blog_controller from "../controllers/blog_controller";
import blog_admin_controller from "../controllers/blog_admin_controller";
const router = Router();

router.get("/", blog_controller.blogs_get);

router.get("/:id", blog_controller.blog_get);

router.get("/:id/comments", blog_controller.blog_comment_get);

router.post("/:id/comments", blog_controller.blog_comment_post);

router.delete("/:id/comments", blog_controller.blog_comment_delete);

router.put("/:id/comments", blog_controller.blog_comment_put);

//admin routes

router.put("/admin/:id", blog_admin_controller.blog_put);

router.delete("/admin/:id", blog_admin_controller.blog_delete);

router.post("/admin", blog_admin_controller.blog_post);

export default router;
