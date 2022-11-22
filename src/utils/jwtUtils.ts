import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

  const curSec : Secret = process.env.APP_SECRET!;
  
  export function createJWT(payload:object){
    return jwt.sign(payload, curSec, {
      expiresIn: 5000,
    });
  };

  export function createRefreshJWT(payload:object) {
    return jwt.sign(payload, curSec, {
      expiresIn: 1000 * 24 * 60 * 60 * 30,
    });
  };

  export function isTokenValid(token:string){
    return jwt.verify(token, curSec);
  }

  export function attachCookiesToResponse(res:Response, token:string, refreshToken:string ){
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
    });
  };

