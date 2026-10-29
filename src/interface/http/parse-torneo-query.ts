export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;
const MAX_PAGE = 10000;

export function parseTorneoListQuery(query: unknown): ParseResult<{ page: number; limit: number }> {
  if (!isRecord(query)) {
    return failure("Los parámetros de consulta no son válidos.");
  }

  const unknown = Object.keys(query).find((key) => key !== "page" && key !== "limit");

  if (unknown !== undefined) {
    return failure("Los parámetros de consulta contienen campos no permitidos.");
  }

  const page = readQueryInt(query.page, "page", DEFAULT_PAGE, MAX_PAGE);
  if (!page.ok) {
    return page;
  }

  const limit = readQueryInt(query.limit, "limit", DEFAULT_LIMIT, MAX_LIMIT);
  if (!limit.ok) {
    return limit;
  }

  return { ok: true, value: { page: page.value, limit: limit.value } };
}

function readQueryInt(value: unknown, name: string, fallback: number, max: number): ParseResult<number> {
  if (value === undefined) {
    return { ok: true, value: fallback };
  }

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return failure(`El parámetro ${name} debe ser un entero positivo.`);
  }

  const parsed = Number(value);

  if (parsed > max) {
    return failure(`El parámetro ${name} supera el máximo permitido.`);
  }

  return { ok: true, value: parsed };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function failure(message: string): ParseResult<never> {
  return { ok: false, message };
}
