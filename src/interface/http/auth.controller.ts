import type { NextFunction, Request, Response } from "express";
import type { LoginUser, RegisterUser } from "../../application/auth/ports";
import { parseLoginBody, parseRegisterBody } from "../../domain/auth-input";

export function createRegisterController(registerUser: RegisterUser) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const parsed = parseRegisterBody(request.body);

    if (!parsed.ok) {
      response.status(400).json({ message: parsed.message });
      return;
    }

    try {
      const user = await registerUser(parsed.value);
      response.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  };
}

export function createLoginController(loginUser: LoginUser) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const parsed = parseLoginBody(request.body);

    if (!parsed.ok) {
      response.status(400).json({ message: parsed.message });
      return;
    }

    try {
      const result = await loginUser(parsed.value);
      response.status(200).json({
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };
}
