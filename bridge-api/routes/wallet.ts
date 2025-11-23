import { Router } from "express";
import WalletController from "../controllers/walletController";
const router = Router();
const controller = new WalletController();
router.post(
  "/createUser",
  //   passport.authenticate("jwt", { session: false }),
  //   logMiddleware,
  controller.create
);

export default router;
