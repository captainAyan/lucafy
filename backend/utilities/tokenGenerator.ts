import process from "process";

import jwt from "jsonwebtoken";

export default function (data) {
  jwt.sign(data, process.env.SECRET_KEY as string, {
    expiresIn: "30d",
  });
}
