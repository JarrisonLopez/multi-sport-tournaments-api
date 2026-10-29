export const DISPONIBILIDADES = [
  "fines-de-semana",
  "noches",
  "mananas",
  "flexible",
] as const;

export type Disponibilidad = (typeof DISPONIBILIDADES)[number];
