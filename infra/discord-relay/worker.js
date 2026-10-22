// ===== TEC Discord relay (Cloudflare Worker) =====
// The club's Apps Script sends Discord posts here instead
// of straight to Discord. Google's shared servers sometimes
// get blocked by Discord (error 1015); Cloudflare's don't.
//
// Settings (Worker > Settings > Variables and Secrets),
// all of type Secret:
//   RELAY_KEY         the key Apps Script sends (makeRelayKey)
//   DISCORD_MEMBERS   Member_Notifs webhook URL
//   DISCORD_OFFICERS  Officer_Notifs webhook URL
//   DISCORD_DATA      Club_Data_Notifs webhook URL
//   DISCORD_PROJECT   project channel webhook URL
//
// POST /post    {channel, payload}  -> forwards to Discord
// GET  /health                      -> checks each webhook
// Both need the header X-Relay-Key. Anything else: 404.

const CHANNELS = {
  members: "DISCORD_MEMBERS",
  officers: "DISCORD_OFFICERS",
  data: "DISCORD_DATA",
  project: "DISCORD_PROJECT",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!env.RELAY_KEY) {
      return json({ error: "RELAY_KEY isn't set on the Worker." }, 500);
    }
    if (!sameKey(request.headers.get("X-Relay-Key") || "", env.RELAY_KEY)) {
      return json({ error: "Wrong or missing key." }, 401);
    }
    if (request.method === "GET" && url.pathname === "/health") {
      return health(env);
    }
    if (request.method === "POST" && url.pathname === "/post") {
      return post(request, env);
    }
    return json({ error: "Not found." }, 404);
  },
};

async function post(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "Body must be JSON." }, 400);
  }
  const prop = CHANNELS[body && body.channel];
  if (!prop) return json({ error: "Unknown channel." }, 400);
  const hook = env[prop];
  if (!hook) return json({ error: prop + " isn't set on the Worker." }, 500);
  const p = body.payload || {};
  // Only the parts of a webhook message the club uses.
  const out = {};
  ["content", "embeds", "username", "allowed_mentions"].forEach((k) => {
    if (p[k] !== undefined) out[k] = p[k];
  });
  let res;
  for (let attempt = 0; attempt < 2; attempt++) {
    res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(out),
    });
    if (res.status !== 429) break;
    // Short waits are waited out here; longer ones go back
    // to Apps Script, which holds the post and retries.
    const wait = Number(res.headers.get("Retry-After")) || 0;
    if (wait > 3 || attempt === 1) break;
    await new Promise((r) => setTimeout(r, wait * 1000 + 250));
  }
  const headers = { "Content-Type": "application/json" };
  const ra = res.headers.get("Retry-After");
  if (ra) headers["Retry-After"] = ra;
  // Discord answers a successful post with 204 (no body),
  // and a 204 response can't carry one.
  const text = await res.text();
  const empty = res.status === 204 || res.status === 205
    || res.status === 304;
  return new Response(empty ? null : text, { status: res.status, headers });
}

// Looks each webhook up without posting anything.
async function health(env) {
  const out = {};
  for (const [name, prop] of Object.entries(CHANNELS)) {
    if (!env[prop]) {
      out[name] = "not set";
      continue;
    }
    const res = await fetch(env[prop]);
    out[name] = res.status === 200 ? "OK"
      : res.status + " " + (await res.text()).slice(0, 120);
  }
  return json(out, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Compares keys without leaking how much matched.
function sameKey(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
