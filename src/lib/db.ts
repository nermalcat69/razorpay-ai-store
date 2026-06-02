import { createClient, type Client } from "@libsql/client";

let _client: Client | undefined;

function getClient(): Client {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return _client;
}

export const db: Client = new Proxy({} as Client, {
  get(_, prop: string | symbol) {
    const client = getClient();
    const value = client[prop as keyof Client];
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
});
