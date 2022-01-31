import { Router } from "express";
import { authController } from "../controllers";

const router = Router();

// Authentication routes defined under this router will be appended to the domainName/api/auth

router.post("/login", authController.login);

export default router;
