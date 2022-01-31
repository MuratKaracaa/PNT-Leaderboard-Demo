import { Router } from "express";
import authRouter from "./auth";

const router = Router();

// Seperating different purpose routers as appendix to the domain

router.use("/api/auth", authRouter);

export default router;
