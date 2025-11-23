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
        code: 201,
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
}

export default WalletController;
