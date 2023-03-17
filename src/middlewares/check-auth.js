import HttpError from "../models/http-errors.js";
import jwt from "jsonwebtoken";
import Function from "../utils/function.js";
import dotenv from 'dotenv'
dotenv.config()

const getTokenFromRequest = Function.getTokenFromRequest;

export default async (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = getTokenFromRequest(req);
    if (!token) throw new Error();
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECURITY_KEY);
    //const userIDIsExist = await User.isUserIDExist(decodedToken.userID);
    //if (!userIDIsExist) return next(new HttpError("AUTHORIZATION_FAIL_USERID_NOT_EXIST", 404));

    req.userData = { userID: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' })
  }
};
