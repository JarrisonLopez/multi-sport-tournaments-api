import type { Request, Response } from "express";
import { getHealthStatus } from "../../application/health/get-health-status";

export function getHealth(_request: Request, response: Response): void {
  response.status(200).json(getHealthStatus());
}
