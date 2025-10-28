import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import pg from "pg";
const { Pool } = pg;

let pool = null;

async function getPool() {
  if (pool) return pool;

  const client = new SecretsManagerClient({});
  const res = await client.send(
    new GetSecretValueCommand({ SecretId: process.env.DB_SECRET_ARN })
  );
  if (!res.SecretString) throw new Error("DB secret missing SecretString");

  const secret = JSON.parse(res.SecretString);
  pool = new Pool({
    host: secret.host,
    port: secret.port ?? 5432,
    database: secret.dbname,
    user: secret.username,
    password: secret.password,
    ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  return pool;
}

function extractUserAttrs(event) {
  const u1 = event?.request?.userAttributes;
  if (u1 && (u1.sub || u1.email)) {
    return {
      sub: u1.sub,
      email: u1.email ?? null,
      phone_number: u1.phone_number ?? null,
      given_name: u1.given_name ?? null,
      family_name: u1.family_name ?? null,
      address: u1.address ?? null,
    };
  }

  const req = event?.detail?.request ?? event?.detail?.requestParameters;

  const arr = req?.UserAttributes ?? req?.userAttributes;
  if (Array.isArray(arr)) {
    const map = {};
    for (const item of arr) {
      if (item?.Name && typeof item.Value === "string")
        map[item.Name] = item.Value;
    }
    const username = req?.Username ?? req?.username ?? map["sub"];
    return {
      sub: username ?? map["sub"],
      email: map["email"] ?? null,
      phone_number: map["phone_number"] ?? null,
      given_name: map["given_name"] ?? null,
      family_name: map["family_name"] ?? null,
      address: map["address"] ?? null,
    };
  }

  if (req && typeof req === "object") {
    return {
      sub: req.Username ?? req.username ?? req.sub,
      email: req.email ?? null,
      phone_number: req.phone_number ?? null,
      given_name: req.given_name ?? null,
      family_name: req.family_name ?? null,
      address: req.address ?? null,
    };
  }

  throw new Error("Could not extract user attributes from event");
}

async function upsertUser({
  sub,
  email,
  phone_number,
  given_name,
  family_name,
  address,
}) {
  if (!sub) throw new Error("Missing user id (sub/Username)");
  const firstname = given_name ?? null;
  const lastname = family_name ?? null;
  const addressLine1 = address ?? null;

  const pool = await getPool();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `
      INSERT INTO users (user_id, first_name, last_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name
      `,
      [sub, firstname, lastname]
    );
    await client.query(
      `
      INSERT INTO contacts (fk_user_id, email, phone_number)
      VALUES ($1, $2, $3)
      ON CONFLICT (fk_user_id) DO UPDATE SET
        email = EXCLUDED.email,
        phone_number = EXCLUDED.phone_number
      `,
      [sub, email, phone_number]
    );
    await client.query(
      `
      INSERT INTO addresses (fk_user_id, address_line_one)
      VALUES ($1, $2)
      ON CONFLICT (fk_user_id) DO UPDATE SET
        address_line_one = EXCLUDED.address_line_one
        `,
      [sub, addressLine1]
    );
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export const handler = async (event, _ctx) => {
  try {
    const attrs = extractUserAttrs(event);
    await upsertUser(attrs);

    if (event?.triggerSource) return event;

    return { statusCode: 200 };
  } catch (err) {
    console.error("User sync failed:", err, "Event:", JSON.stringify(event));
    if (event?.triggerSource) return event;
    return { statusCode: 500, body: err?.message ?? "error" };
  }
};
