import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  password: string;
  phone: number;
  gender: string;
  referalCode: string;
}

export interface AuthRequest extends Request {
  user?: string;
}


export type ControllerType<
  Params = Record<string, any>, 
  ResBody = any, 
  ReqBody = any, 
  ReqQuery = Record<string, any>
> = (
  req: Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;