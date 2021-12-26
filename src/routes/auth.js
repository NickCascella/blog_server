import { Router } from "express";
import auth_controller from "../controllers/auth_controller";
const router = Router();

router.post("/signup", auth_controller.sign_up_post);

router.post("/login", auth_controller.login_post);
export default router;
