import { Request, Response } from "express";

export const validatePasswd = (req: Request, res: Response, next: Function) => {

  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).json({
      message: "Please enter a password with min. 6 chars",
    });
  }
  if (
    !req.body.password_repeat ||
    req.body.password != req.body.password_repeat
  ) {
    return res.status(400).json({
      message: "Both passwords must match",
    });
  }
  next();
};
