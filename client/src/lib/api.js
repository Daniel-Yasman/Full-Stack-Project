const BASE = "/api";

export class HttpError extends Error {
  constructor(status, body) {
    super(body?.error || `http_error_${status}`);
    this.status = status;
    this.body = body;
  }
}

// simple single-flight per key to avoid request dogpiles
const inflight = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function api(
  path,
  { method = "GET", headers = {}, body, on401 } = {},
  { key } = {}
) {
  const finalKey = key || `${method}:${path}`;
  if (method === "GET" && inflight.has(finalKey)) {
    return inflight.get(finalKey);
  }

  const run = (async () => {
    let attempt = 0;
    let lastErr;

    while (attempt < 3) {
      try {
        const r = await fetch(`${BASE}${path}`, {
          method,
          credentials: "include",
          headers: { "Content-Type": "application/json", ...headers },
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        let data = null;
        try {
          data = await r.json();
        } catch {}

        if (r.status === 401 && typeof on401 === "function") on401(r);
        if (!r.ok) throw new HttpError(r.status, data);
        return data;
      } catch (e) {
        lastErr = e;
        // network-ish → backoff; HttpError 4xx (except 429) don’t retry
        if (e instanceof HttpError && e.status < 500 && e.status !== 429) break;
        await sleep(200 * 2 ** attempt); // 200, 400, 800ms
        attempt++;
      }
    }
    throw lastErr;
  })();

  if (method === "GET") inflight.set(finalKey, run);
  try {
    return await run;
  } finally {
    if (method === "GET") inflight.delete(finalKey);
  }
}
