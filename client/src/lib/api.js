const BASE = "/api";

export class HttpError extends Error {
  constructor(status, body) {
    super(body?.error || "http_error");
    this.status = status;
    this.body = body;
  }
}

export async function api(
  path,
  { method = "GET", headers = {}, body, on401 } = {}
) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await r.json();
  } catch {}

  if (r.status === 401 && typeof on401 === "function") on401();
  if (!r.ok) throw new HttpError(r.status, data);

  return data;
}
