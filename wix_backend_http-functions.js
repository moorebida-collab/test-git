// ============================================================
// FILE: backend/http-functions.js  (Wix Velo backend file)
// HOW TO USE:
// 1. In Wix Editor, click the {} Dev Mode toggle (top bar)
// 2. In the left panel click "Backend" → "+" → "New .js file"
// 3. Name it exactly: http-functions.js
// 4. Delete everything in it and paste this entire file
// 5. Then go to Wix Secrets Manager (see step 6 in README)
//    and add secret named "mailerlite_token" with your API key
// ============================================================

import { ok, badRequest, serverError } from 'wix-http-functions';
import { fetch } from 'wix-fetch';
import { getSecret } from 'wix-secrets-backend';

// Group IDs from your MailerLite account
const GROUPS = {
  'app-signup': '186454432189253151',
  'book-buyer':  '186454451894093750',
  'both':        '186454463685329925'
};

// POST /_functions/subscribe
// Called by the landing page form on submission
export async function post_subscribe(request) {

  // Allow CORS from your Wix site
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  let body;
  try {
    body = await request.body.json();
  } catch (e) {
    return badRequest({ body: JSON.stringify({ success: false, error: 'Invalid request body' }), headers });
  }

  const { name, email, path } = body;

  if (!email || !name || !path) {
    return badRequest({ body: JSON.stringify({ success: false, error: 'Missing fields' }), headers });
  }

  // Assign groups based on selection
  let groupIds;
  if (path === 'both') {
    groupIds = [GROUPS['app-signup'], GROUPS['book-buyer'], GROUPS['both']];
  } else {
    groupIds = [GROUPS[path] || GROUPS['app-signup']];
  }

  // Get API token from Wix Secrets Manager
  let token;
  try {
    token = await getSecret('mailerlite_token');
  } catch (e) {
    return serverError({ body: JSON.stringify({ success: false, error: 'Auth error' }), headers });
  }

  // Subscribe to MailerLite
  const payload = {
    email: email.trim().toLowerCase(),
    fields: {
      name: name.trim(),
      journey_path: path
    },
    groups: groupIds
  };

  let mlResponse;
  try {
    mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    return serverError({ body: JSON.stringify({ success: false, error: 'MailerLite unreachable' }), headers });
  }

  if (mlResponse.ok || mlResponse.status === 200 || mlResponse.status === 201) {
    return ok({ body: JSON.stringify({ success: true }), headers });
  } else {
    const errText = await mlResponse.text();
    return serverError({ body: JSON.stringify({ success: false, error: errText }), headers });
  }
}

// Handle preflight OPTIONS requests (CORS)
export function options_subscribe(request) {
  return ok({
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
