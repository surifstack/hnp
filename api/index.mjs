import { Readable } from "node:stream";
import app from "../dist/server/server.js";

function getRequestUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  return new URL(req.url || "/", `${proto}://${host}`);
}

function getRequestBody(req) {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }

  return Readable.toWeb(req);
}

function applyResponseHeaders(res, headers) {
  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase() === "set-cookie") {
      continue;
    }

    res.setHeader(key, value);
  }

  const setCookie = headers.getSetCookie?.();
  if (setCookie?.length) {
    res.setHeader("set-cookie", setCookie);
  }
}

export default async function handler(req, res) {
  const request = new Request(getRequestUrl(req), {
    method: req.method,
    headers: new Headers(req.headers),
    body: getRequestBody(req),
    duplex: "half",
  });

  const response = await app.fetch(request);

  res.statusCode = response.status;
  applyResponseHeaders(res, response.headers);

  if (!response.body) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body).pipe(res);
}
