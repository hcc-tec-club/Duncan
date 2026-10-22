TEC Discord relay
The club's Apps Script (Automation Brain) posts to Discord through this
small Cloudflare Worker instead of straight to Discord. Google's shared
servers sometimes get blocked by Discord ("error code: 1015"); Cloudflare's
don't. If the relay is ever down, Apps Script posts directly, so nothing
breaks.
```
Apps Script --(RELAY_KEY)--> tec-discord-relay (Cloudflare) --> Discord webhooks
```
`worker.js` is the whole relay. It only forwards to the four club
channels, and only when the request carries the club's key.
The webhook URLs and the key live in the Worker's encrypted settings
(Secrets), never in this repo. Don't commit them.
Who owns it
Piece	Where	At handover
Cloudflare account	The president's HCC login (add a second admin when there is one)	Invite the new president as Super Administrator; remove the old one after April 1
Code	This folder, in the hcc-tec-club GitHub org	Covered by the org handover
Key	Worker secret `RELAY_KEY` + Apps Script `RELAY_KEY`	New president runs `makeRelayKey` and pastes the new key into the Worker
Webhooks	Worker secrets + Apps Script (fallback)	Nothing, unless a channel changes
Setup (about 15 minutes, no command line)
Cloudflare
Sign up at dash.cloudflare.com with your HCC email and verify it.
Workers & Pages → Create → Start with Hello World (or "Create
Worker"). Name it `tec-discord-relay` and click Deploy. The first
time, Cloudflare asks you to pick a workers.dev subdomain; use
something like `hcc-tec`.
Click Edit code, replace everything with `worker.js`, click
Deploy.
Note the Worker's address, e.g.
`https://tec-discord-relay.hcc-tec.workers.dev`.
Apps Script (Automation Brain → Extensions → Apps Script)
5. Run `makeRelayKey`. Copy the key from the log.
6. Run `relaySetupHelper`. It logs the four current webhook URLs.
Cloudflare again: the Worker → Settings → Variables and Secrets →
Add, type Secret, one at a time, then Deploy:
Name	Value
`RELAY_KEY`	the key from step 5
`DISCORD_MEMBERS`	from step 6
`DISCORD_OFFICERS`	from step 6
`DISCORD_DATA`	from step 6
`DISCORD_PROJECT`	from step 6
Apps Script again
7. In Discord.gs, paste the Worker's address into `RELAY_NEW_URL`, save,
run `setRelay`, then empty `RELAY_NEW_URL` and save.
8. Run `relayStatus`. Every channel should say `OK`.
9. Run `testDiscordAll`. The test cards should arrive in Club_Data.
10. The logs from steps 5–6 hold the key and webhooks. Only people who
can edit the script can see them, so keep that list to officers.
Checking on it
`relayStatus` (Apps Script) asks the relay to look up every webhook
without posting anything.
`discordStatus` (Apps Script) does the same for the relay and for each
webhook directly.
Cloudflare → the Worker → Logs / Metrics shows requests and errors.
If the relay fails, Apps Script logs "Posting directly instead" and
carries on.
Changing a webhook
In Discord, make the new webhook and copy it.
Cloudflare: Worker → Settings → Variables and Secrets → edit the
matching secret → Deploy.
Apps Script: Discord.gs → `NEW_WEBHOOK_CHANNEL` (members, officers,
data or project) and `NEW_WEBHOOK_URL`, run `setWebhook`, then empty
both and save.
Handover
Outgoing president:
Cloudflare → Manage Account → Members → Invite: the new president,
role Super Administrator.
New president:
Accept the invite.
Run `makeRelayKey` in Apps Script and paste the new key into the
Worker's `RELAY_KEY` secret, then Deploy. The old key stops working.
Run `relayStatus`.
Outgoing president, after April 1:
Remove yourself from the Cloudflare account members.
Limits
Cloudflare's free plan allows 100,000 requests a day. The club uses a
few dozen.
