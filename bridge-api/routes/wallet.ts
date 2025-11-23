import { Router } from "express";
import WalletController from "../controllers/walletController";
const router = Router();
const controller = new WalletController();
router.post(
  "/createUser",
  controller.create
);

router.post(
  "/balance",
  controller.getBalance
)

export default router;
