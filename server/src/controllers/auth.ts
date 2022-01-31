import { Request, Response } from "express";
import { Player } from "../models";
import { issueToken } from "../utils/helpers";

// Simple login method with username to issue token
export const login = async (request: Request, response: Response) => {
  try {
    const { userName } = request.body;
    const { _id } = await Player.findOne({ userName }).orFail();
    const token = await issueToken(_id);
    return response.status(200).json({ token });
  } catch (error) {
    return response.status(500).json(error);
  }
};
