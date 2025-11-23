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

router.post(
  "/addCredit",
  controller.addCredit
)

router.post(
  "/requestPayment",
  controller.requestPayment
)

router.post(
  "/makePayment",
  controller.makePayment
)

export default router;
