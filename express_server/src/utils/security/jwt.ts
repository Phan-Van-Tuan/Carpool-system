import jwt from "jsonwebtoken";
import config from "../configs/variable";
import { IToken } from "../types/token";

const generateToken = (data: object, expire: number) => {
  return jwt.sign(
    {
      payload: data,
    },
    config.JWT_SECRET,
    { expiresIn: expire }
  );
};

const decodeToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET) as IToken;
};

export { generateToken, decodeToken };
