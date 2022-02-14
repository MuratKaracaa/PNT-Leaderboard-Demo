import { Player } from "../models";
import { IPlayer } from "../typings";

export const getPlayerProfile = async (id: string): Promise<IPlayer> => {
  return await Player.findById(id).select("-_id -__v").orFail();
};

export const updatePlayerMoney = async (id: string, money: number) => {
  await Player.findByIdAndUpdate(id, {
    $inc: { money },
  }).orFail();
};
