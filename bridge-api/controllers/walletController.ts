import { NextFunction, Request, Response } from "express";
import WalletService from "../services/wallet.service";
import config from "../config";

const URL = config.soapWsdl;
const service = new WalletService(URL);

class WalletController {
  async create(req: Request, res: Response, next: any) {
    try {
      const { document, name, email, phone } = req.body;
      const user = await service.create({ document, name, email, phone });
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        code: "201",
        data: [user],
      });
    } catch (error) {
      if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "USER_ALREADY_EXISTS",
          code: "409",
          data: [error.message],
        });
      }
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          message: "ERROR_CREATING_USER",
          code: "500",
          data: [error.message],
        });
      }
      next(error);
    }
  }

  async getBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const { document, phone } = req.body;
      const user = await service.getBalance({ document, phone });
      return res.status(201).json({
        success: true,
        message: "Balance retrieved successfully",
        code: "201",
        data: [user],
      });
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "USER_NOT_FOUND",
          code: "404",
          data: [error.message],
        });
      }
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          message: "ERROR_FETCHING_BALANCE",
          code: "500",
          data: [error.message],
        });
      }
      next(error);
    }
  }

  async addCredit(req: Request, res: Response, next: NextFunction) {
    try {
      const { document, phone, amount } = req.body;
      const user = await service.addCredit({ document, phone, amount });
      return res.status(200).json({
        success: true,
        message: "Credit added successfully",
        code: "200",
        data: [user],
      });
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "USER_NOT_FOUND",
          code: "404",
          data: [error.message],
        });
      }
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          message: "ERROR_ADDING_CREDIT",
          code: "500",
          data: [error.message],
        });
      }
      next(error);
    }
  }

  async requestPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { document, phone, amount } = req.body;
      const paymentRequest = await service.requestPayment({
        document,
        phone,
        amount,
      });
      return res.status(200).json({
        success: true,
        message: "Payment request created successfully",
        code: "200",
        data: [paymentRequest],
      });
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "USER_NOT_FOUND",
          code: "404",
          data: [error.message],
        });
      }
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          message: "ERROR_REQUESTING_PAYMENT",
          code: "500",
          data: [error.message],
        });
      }
      next(error);
    }
  }

  async makePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId, token } = req.body;
      const payment = await service.makePayment({ sessionId, token });
      return res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        code: "200",
        data: [payment],
      });
    } catch (error) {
      if (error instanceof Error && error.message === "TRANSACTION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "TRANSACTION_NOT_FOUND",
          code: "404",
          data: [error.message],
        });
      }
      if (error instanceof Error && error.message === "INSUFFICIENT_FUNDS") {
        return res.status(404).json({
          success: false,
          message: "INSUFFICIENT_FUNDS",
          code: "404",
          data: [error.message],
        });
      }
      if (error instanceof Error && error.message === "TRANSACTION_EXPIRED") {
        return res.status(408).json({
          success: false,
          message: "TRANSACTION_EXPIRED",
          code: "408",
          data: [error.message],
        });
      }
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "ERROR_PROCESSING_PAYMENT",
          code: "500",
          data: [error.message],
        });
      }
      next(error);
    }
  }
}

export default WalletController;
