import type { Disponibilidad } from "./disponibilidad";

export type Inscripcion = {
  id: string;
  userId: string;
  torneoId: string;
  disponibilidad: Disponibilidad;
  mensaje: string;
  createdAt: Date;
};
