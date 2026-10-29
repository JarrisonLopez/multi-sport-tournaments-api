export const ESTADOS_TORNEO = ["abierto", "en_curso", "proximo"] as const;

export type EstadoTorneo = (typeof ESTADOS_TORNEO)[number];
