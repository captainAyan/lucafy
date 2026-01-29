import process from "process";

import jwt from "jsonwebtoken";

export interface TokenData {
  id: string;
}

export default function (data: TokenData): string {
  return jwt.sign(data, process.env.SECRET_KEY as string, {
    expiresIn: "30d",
  });
}
