import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

export const generateToken = async (payload) => {
  const options = { expiresIn: "30d" };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.log("error: ", error);
    return false;
  }
};