# TASK 4 — AUTOMATION LOGIC
**Brand:** Moorebida | **Author:** Marlon Moore
**Summary:** Complete step-by-step automation map covering Wix form logic, Mailchimp Customer Journey setup, cross-sell triggers, graduation tags, Facebook and TikTok pixel installation, custom retargeting audiences, and a weekly social posting schedule. No coding required.

---

# PART 1 — WIX FORM AUTOMATION

## What happens when someone submits the form

The HTML form embed (from Task 1) captures three pieces of information:
- **First name** (FNAME)
- **Email address** (EMAIL)
- **Journey path selection** (MMERGE3): `app-signup` | `book-buyer` | `both`

After submission, the form automatically:
1. Shows a success message on screen
2. Redirects the visitor after 2.5 seconds:
   - `app-signup` → https://moorebida-wellness-path.lovable.app
   - `book-buyer` → https://www.moorebida.com/thebook
   - `both` → https://moorebida-wellness-path.lovable.app (app first, book link is in Email B1)
3. Sends the contact + their selection to Mailchimp via the form action URL

---

## Setting up Wix Thank You Pages (optional but recommended)

If you want a dedicated "thank you" page instead of a redirect to the app/book:

1. In Wix editor, click **Pages → Add Page**
2. Create two pages:
   - **Thank You — App** (URL slug: `/thank-you-app`)
     Copy: "You're in! Head to the app and start Week 1 → [button linking to app]"
   - **Thank You — Book** (URL slug: `/thank-you-book`)
     Copy: "Your order is confirmed! Check your inbox for your free app gift → [button linking to app]"
3. In the HTML form embed, update the redirect URLs to your two thank-you page URLs

---

## Connecting the Wix Form to Mailchimp

The HTML embed submits directly to Mailchimp using your list's form action URL.

**Step-by-step to get your Mailchimp form action URL:**

1. Log into **mailchimp.com** with Moorebida@gmail.com
2. Click **Audience** in the left sidebar → **All contacts**
3. Click **Signup forms** (button near the top right)
4. Click **Embedded forms**
5. On the embedded forms page, scroll down to see the `<form>` tag — copy the URL inside `action="..."`
   It looks like: `https://gmail.us21.list-manage.com/subscribe/post?u=XXXXXXXX&id=XXXXXXXX`
6. In your Wix HTML embed, find the line that says:
   `var MC_URL = 'YOUR_MAILCHIMP_FORM_ACTION_URL';`
7. Replace `YOUR_MAILCHIMP_FORM_ACTION_URL` with the URL you copied (keep the single quotes)
8. Save and publish the Wix page

---

# PART 2 — MAILCHIMP SETUP (STEP BY STEP)

## Step 1 — Create Your Audience Fields

You need two custom fields in Mailchimp: one for the subscriber's first name (may already exist) and one for the journey path selection.

1. In Mailchimp, go to **Audience → Settings → Audience fields and *|MERGE|* tags**
2. Check that **First Name** exists with merge tag `FNAME` — if not, add it
3. Click **Add a field** → choose **Text**
   - Label: `Journey Path`
   - Merge tag: `MMERGE3`
   - Click **Save**

---

## Step 2 — Create Your Tags

Tags let you segment your list and trigger the right email sequence.

1. Go to **Audience → Tags**
2. Click **Create Tag** and create these five tags:
   - `app-signup`
   - `book-buyer`
   - `both`
   - `community-member`
   - `book-upsell-clicked` *(used for cross-sell trigger)*

---

## Step 3 — Create the Customer Journey: Sequence A (App Signup)

1. Go to **Automations** in the left sidebar
2. Click **Create** → **Customer Journey**
3. Name it: `Sequence A — App Signup`
4. Click **Add a starting point**
5. Choose **Subscribes to audience** as the trigger
6. Click **Add a filter** → choose **Tag** → **is** → `app-signup`
   *(This means only subscribers tagged "app-signup" or "both" enter this sequence)*
7. Click the **+** button after the starting point to add emails:

**Add these 8 emails in order with the following delays:**

| Email | Delay | Subject line |
|-------|-------|-------------|
| A1 | Send immediately | You just made a high-frequency decision 🎉 |
| A2 | Wait 7 days | One week in — how's your frequency feeling? |
| A3 | Wait 7 more days (Day 14) | The app gives you the journey. The book gives you the map. |
| A4 | Wait 7 more days (Day 21) | The food in your fridge might be lowering your frequency 🥦 |
| A5 | Wait 7 more days (Day 28) | The fastest way to raise your frequency (it's not meditation) |
| A6 | Wait 7 more days (Day 35) | 5 weeks in — you've already done more than most people ever will |
| A7 | Wait 7 more days (Day 42) | Who in your life is raising your frequency — and who is draining it? |
| A8 | Wait 14 more days (Day 56) | You graduated. And I couldn't be more proud of you. 🎓 |

8. For each email, paste the full body copy from the `email_sequences.md` file
9. Set sender name: `Marlon | Moorebida` · Reply-to: `Moorebida@gmail.com`
10. Click **Turn On** when ready

---

## Step 4 — Create the Customer Journey: Sequence B (Book Buyer)

1. Go to **Automations → Create → Customer Journey**
2. Name it: `Sequence B — Book Buyer`
3. Starting point trigger: **Subscribes to audience**
4. Filter: **Tag → is → book-buyer**
5. Add 4 emails:

| Email | Delay | Subject line |
|-------|-------|-------------|
| B1 | Send immediately | Your book is confirmed — and I have a free gift for you 🎁 |
| B2 | Wait 3 days | How to use the book + app together (this changes everything) |
| B3 | Wait 4 more days (Day 7) | There's a community waiting for you — come join us |
| B4 | Wait 14 more days (Day 21) | Three weeks in — how's your frequency? + a small favor |

6. Paste body copy from `email_sequences.md` for each email
7. Click **Turn On** when ready

---

## Step 5 — Tag Users Based on Their Form Selection

Because the form passes `MMERGE3` (the journey path) into Mailchimp, you need to create an automation that reads that field and applies the correct tag.

1. Go to **Automations → Create → Customer Journey**
2. Name it: `Tag Router`
3. Starting point: **Subscribes to audience** (no filter — catches everyone)
4. After the starting point, click **+** → choose **If/Else split**

**Branch 1:**
- Condition: `Journey Path (MMERGE3)` **contains** `app-signup`
- Action: **Add tag** → `app-signup`

**Branch 2:**
- Condition: `Journey Path (MMERGE3)` **contains** `book-buyer`
- Action: **Add tag** → `book-buyer`

**Branch 3 (If neither — covers "both"):**
- Action: **Add tag** → `both`
- Then add a second action: **Add tag** → `app-signup` *(so they also enter Sequence A)*
- Then add a third action: **Add tag** → `book-buyer` *(so they also enter Sequence B)*

5. Click **Turn On**

> **Note:** Subscribers tagged "both" will receive both sequences. Mailchimp will send from both journeys simultaneously. This is intentional — they signed up for both.

---

## Step 6 — Cross-Sell Trigger (Day 17 Re-Engagement)

This fires if an app subscriber opened Email A3 (the book upsell) but did NOT click the book link within 48 hours.

1. Go to **Automations → Create → Customer Journey**
2. Name it: `Cross-Sell Follow-Up — Day 17`
3. Starting point: **Email activity**
   - Select: **Sequence A — App Signup** → Email A3
   - Trigger: **Opened but did not click**
4. Add a wait step: **Wait 48 hours**
5. Add a condition: **If/Else**
   - Check: Has tag `book-upsell-clicked`? → **No**
   - If No: send the cross-sell email (Day 17 email from `email_sequences.md`)
   - If Yes: end the journey (they already clicked — no need to follow up)
6. Click **Turn On**

> **How to set the `book-upsell-clicked` tag:** In Email A3, go to the book link → click **Track clicks** → in the link settings, add a tag action: "When this link is clicked, add tag: book-upsell-clicked." This prevents the follow-up from sending to people who already took action.

---

## Step 7 — Graduation Trigger (Email A8 → Community Tag)

After Email A8 is sent, automatically tag the subscriber as a community member and trigger a Facebook group invite.

1. In the **Sequence A Customer Journey**, after Email A8 is added:
2. Click **+** → **Add tag** → `community-member`
3. Click **+** → **Send email** (one additional email):
   - Subject: "One more thing — your community is waiting 👥"
   - Body: Brief note with the direct Facebook group link and a warm invitation
   - This is separate from Email A8 so the graduation email stays clean

---

# PART 3 — RETARGETING PIXEL SETUP

## Facebook Pixel — Add to Wix Landing Page

**Step 1: Create your Facebook Pixel**
1. Go to **business.facebook.com** → **Events Manager**
2. Click **Connect Data Sources** → **Web** → **Facebook Pixel**
3. Name it: `Moorebida Pixel`
4. Click **Create Pixel**
5. Copy your **Pixel ID** (a 15–16 digit number)

**Step 2: Add the Pixel to your Wix site**
1. In Wix, go to **Settings** (left sidebar gear icon)
2. Click **Marketing Integrations** (or search "Marketing Tools")
3. Click **Facebook Pixel** → **Connect**
4. Paste your Pixel ID into the field
5. Click **Save**
6. Wix automatically adds the pixel code to every page

**Step 3: Verify it's working**
1. Install the **Facebook Pixel Helper** Chrome extension (free from the Chrome Web Store)
2. Visit your Wix landing page
3. Click the Pixel Helper icon — it should show your pixel as "Active"

---

## TikTok Pixel — Add to Wix Landing Page

**Step 1: Create your TikTok Pixel**
1. Go to **ads.tiktok.com** → create a TikTok Ads account if you don't have one
2. In the dashboard, click **Assets → Events**
3. Click **Manage** → **Create Pixel**
4. Name: `Moorebida TikTok Pixel`
5. Choose **Standard Mode** → **Manually Install Pixel Code**
6. Copy your **Pixel ID**

**Step 2: Add to Wix**
1. In Wix editor, go to **Settings → Custom Code** (under the Advanced section)
2. Click **+ Add Custom Code**
3. Paste the TikTok pixel base code (shown in TikTok Ads Manager)
4. Set it to load on **All Pages** → **Head**
5. Name it: `TikTok Pixel`
6. Click **Apply**

**Step 3: Verify**
1. Install the **TikTok Pixel Helper** Chrome extension
2. Visit your landing page — confirm the pixel fires

---

## Custom Audience 1 — Visitors Who Did NOT Submit the Form

These are your warmest retargeting targets — they showed interest but didn't convert.

**Facebook:**
1. Go to **Ads Manager → Audiences → Create Audience → Custom Audience**
2. Choose **Website**
3. Rule: **People who visited** your landing page URL **in the last 30 days**
4. Add exclusion: **People who visited** your thank-you page URL (these people converted)
5. Name: `Landing Page — No Conversion`
6. Retarget with: **Ad 2 (Conversion)** — both Version A and Version B

**TikTok:**
1. Go to **TikTok Ads → Assets → Audiences → Create Audience**
2. Choose **Website Traffic**
3. Rule: **Visited** landing page URL → **Exclude** thank-you page visitors
4. Name: `Landing Page Visitors — No Conversion`
5. Retarget with TikTok Video 1 or Video 3 (high-hook content)

---

## Custom Audience 2 — App Signups (Book Retargeting at Day 14)

These are app users who are 2 weeks into their journey — prime time for a book upsell.

**Facebook:**
1. Go to **Ads Manager → Audiences → Custom Audience → Customer List**
2. In Mailchimp: go to **Audience → Segments**
3. Create a segment: **Tag is "app-signup"** AND **Date Added is 14+ days ago**
4. Export as CSV (name, email)
5. Upload that CSV to Facebook as a Custom Audience
6. Name: `App Users — Day 14 Book Retarget`
7. Retarget with: A book-focused ad (use the radio station metaphor, ~~$35~~ $20 price, urgency)

> **Tip:** Repeat this export + upload weekly so the audience stays current.

---

# PART 4 — WEEKLY SOCIAL POSTING SCHEDULE

**Cadence:** Repeating weekly. Rotate content from the `social_content.md` library. Adjust for live events, launches, or campaign milestones.

| Day | Platform | Content Type | Notes |
|-----|----------|-------------|-------|
| **Monday** | Facebook Community | Weekly check-in post | Use the affirmation + question template from Task 3. Rotate through the 8-week bank. |
| **Tuesday** | TikTok | Short video (30–45 sec) | Rotate through Videos 1–4. After first cycle, create new videos using the same Hook → Value → CTA format. |
| **Wednesday** | Instagram | Reel (60 sec) | Alternate Reel 1 and Reel 2. After first cycle, create Step-specific Reels (one per step). |
| **Thursday** | YouTube | Short (60 sec) | Alternate Short 1 and Short 2. After first cycle, create step-specific Shorts. |
| **Friday** | Instagram | Story sequence (5 slides) | Alternate Story 1 and Story 2. Rotate polls and questions weekly for fresh engagement data. |
| **Saturday** | Facebook Ads | Paid ad (rotate) | Week 1–2: Awareness (Ad 1). Week 3–4: Conversion (Ad 2A). Week 5–6: Conversion (Ad 2B). Repeat. |
| **Sunday** | Email | Automated sequence | No action needed — Mailchimp Customer Journeys send automatically based on each subscriber's sign-up date. |

---

**Production note:**
- **Video production days:** Tuesday and Wednesday require filmed content. Batch-film on the weekend — 4 TikToks + 2 Reels in one session saves time and energy.
- **Written-only days:** Monday (Facebook post), Thursday (YouTube Short is filmed but can be repurposed from TikTok), Friday (Story slides are graphic/text-based).
- **Repurpose rule:** Every TikTok video can be cross-posted as an Instagram Reel and a YouTube Short with minor edits (remove TikTok watermark, adjust caption).

---

*End of Task 4.*
