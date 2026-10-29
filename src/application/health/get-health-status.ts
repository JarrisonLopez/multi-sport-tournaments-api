import type { HealthStatus } from "../../domain/health-status";

export function getHealthStatus(): HealthStatus {
  return { status: "ok" };
}
