#!/usr/bin/env node
/*
 * Creates the FIRST admin account for the German Expert admin panel.
 *
 *   node scripts/bootstrap-admin.js
 *
 * Run it yourself, in your own terminal (PowerShell / Command Prompt), NOT
 * through Claude: it asks for the password with the typing hidden, and the
 * password goes straight from your keyboard to Supabase. Nobody else ever sees
 * or chooses it.
 *
 * It only works ONCE. The edge function refuses to bootstrap as soon as one
 * admin exists ("already_bootstrapped"); after that, further accounts are
 * added from the admin panel's own Accounts tab while logged in.
 *
 * Plain Node, no dependencies. --dry-run shows what would be sent without
 * sending it (and without asking for a password).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DRY = process.argv.includes('--dry-run');

// The URL and the publishable (public, not secret) key live in one config file.
const cfg = fs.readFileSync(path.join(__dirname, '..', 'code', 'js', '01-config-data.js'), 'utf8');
const url = (cfg.match(/GE_SB_URL\s*=\s*'([^']+)'/) || [])[1];
const keyB64 = (cfg.match(/GE_SB_KEY_B64\s*=\s*'([^']+)'/) || [])[1];
if (!url || !keyB64) { console.error('Could not read the Supabase URL/key from code/js/01-config-data.js'); process.exit(1); }
const key = Buffer.from(keyB64, 'base64').toString('utf8');

const ROLE_LIST = [
  ['super',   'super   - owner, full access'],
  ['bahar15', 'bahar15 - manager'],
  ['1',       '1       - admin'],
  ['custom',  'custom  - team member (limited tabs)']
];
const ROLES = Object.fromEntries(ROLE_LIST);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: !!process.stdin.isTTY });
let muted = false;
rl._writeToOutput = function (s) {
  // While muted, swallow everything except the line break so the password is not echoed.
  if (!muted) rl.output.write(s);
  else if (s === '\r\n' || s === '\n') rl.output.write(s);
};
// Lines are queued as they arrive, so it works the same typed by hand (hidden
// password) or piped in for testing.
const queue = [], waiting = [];
rl.on('line', line => { muted = false; (waiting.shift() || (v => queue.push(v)))(line); });
const ask = (q, hidden) => new Promise(res => {
  process.stdout.write(q);
  muted = !!hidden;
  if (queue.length) { muted = false; res(queue.shift()); } else waiting.push(res);
});

(async () => {
  console.log('\nGerman Expert - create the first admin account');
  console.log('Project: ' + url + '\n');

  const username = (await ask('Username (letters/numbers, e.g. owner): ')).trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) { console.error('\nUsername must be 3-32 characters: letters, numbers, . _ -'); process.exit(1); }

  console.log('\nRoles:'); ROLE_LIST.forEach(r => console.log('  ' + r[1]));
  const role = ((await ask('\nRole [super]: ')).trim() || 'super');
  if (!ROLES[role]) { console.error('\nUnknown role "' + role + '"'); process.exit(1); }

  if (DRY) {
    console.log('\n--dry-run: would POST to ' + url + '/functions/v1/admin-manage-accounts');
    console.log(JSON.stringify({ action: 'bootstrap', accounts: [{ username, password: '<hidden>', role }] }, null, 2));
    rl.close(); return;
  }

  const pw1 = await ask('Password (typing is hidden, 10+ characters): ', true);
  const pw2 = await ask('Repeat password: ', true);
  rl.close();
  if (pw1 !== pw2) { console.error('\nThe two passwords do not match. Nothing was sent.'); process.exit(1); }
  if (pw1.length < 10) { console.error('\nUse at least 10 characters. Nothing was sent.'); process.exit(1); }

  const res = await fetch(url + '/functions/v1/admin-manage-accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key, Authorization: 'Bearer ' + key },
    body: JSON.stringify({ action: 'bootstrap', accounts: [{ username, password: pw1, role }] })
  });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch (e) { body = { raw: text }; }

  if (res.ok && body.ok) {
    console.log('\nDone. Account created: ' + username + '  (role: ' + role + ')');
    console.log('Log in at https://mukarramkebra.github.io/German-Expert/admin/ with that username and your password.');
  } else if (body && body.error === 'already_bootstrapped') {
    console.error('\nAn admin account already exists, so bootstrap is closed (it only works once).');
    console.error('Log in to the admin panel and add more accounts from its Accounts tab.');
    process.exit(1);
  } else {
    console.error('\nFailed (' + res.status + '): ' + text);
    process.exit(1);
  }
})().catch(e => { console.error('\nError: ' + e.message); process.exit(1); });
