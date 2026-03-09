# 🛡️ PureWill AI Guardian - Detailed Setup Guide

> [!IMPORTANT]
> **Google Cloud Access**: As of August 2025, Google enforces **2-Step Verification (2SV)**. If your access is blocked, go to your [Google Account Security Settings](https://myaccount.google.com/security) and turn on 2-Step Verification. Wait 60 seconds and refresh the Cloud Console.

Follow these steps carefully to get your platform running.

---

### 1. Google Sheets Setup (Your Free Database)
Since we are using Google Sheets as a database, you need to "invite" a small automated program (Service Account) to your sheet.

1.  **Create the Sheet**:
    *   Go to [sheets.new](https://sheets.new) and create a new Google Sheet.
    *   Rename the first tab (bottom left) to **`UserData`**.
    *   In the first row, add these headers: `userId`, `email`, `lockUntil`, `streak`, `partnerEmail`.
    *   **Keep the URL handy**, you'll need the ID (the long string of letters/numbers in the URL).

2.  **Get Google Credentials**:
    *   Go to [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a **New Project** (call it `PureWill`).
    *   Search for **"Google Sheets API"** in the top bar and click **Enable**.
    *   Go to **APIs & Services > Credentials**.
    *   Click **Create Credentials > Service Account**.
    *   Follow the steps (just give it a name like `purewill-bot`) and click **Done**.
    *   Find your new Service Account in the list, click the **three dots (Manage Keys)**.
    *   Click **Add Key > Create New Key > JSON**. This downloads a file.
    *   **IMPORTANT**: Open that JSON file. You need:
        *   `client_email` (looks like `something@something.iam.gserviceaccount.com`)
        *   `private_key` (looks like `-----BEGIN PRIVATE KEY-----\n...`)

3.  **Invite the Bot**:
    *   Go back to your Google Sheet.
    *   Click **Share** (top right).
    *   Paste the `client_email` from your JSON file.
    *   Give it **Editor** access and click **Send**.

---

### 2. Vercel Hosting & Environment Variables
Vercel is where your website lives. It needs your Google credentials to talk to the sheet.

1.  **Push to GitHub**:
    *   Create a new repo on GitHub.
    *   Run these commands in your project folder:
        ```bash
        git init
        git add .
        git commit -m "PureWill Initial"
        git branch -M main
        git remote add origin YOUR_GITHUB_URL
        git push -u origin main
        ```
2.  **Connect to Vercel**:
    *   Go to [vercel.com](https://vercel.com) and import your repo.
3.  **Add Environment Variables**:
    *   In Vercel, go to **Settings > Environment Variables**.
    *   Add these one by one:
        *   `GOOGLE_SERVICE_ACCOUNT_EMAIL`: (Paste the email from JSON)
        *   `GOOGLE_PRIVATE_KEY`: (Paste the ENTIRE private key from JSON, including the `\n` parts)
        *   `GOOGLE_SHEET_ID`: (The long ID from your Google Sheet URL)
        *   `NEXTAUTH_SECRET`: (Type any random long password here)
        *   `RESEND_API_KEY`: (Get this from [resend.com](https://resend.com))

---

### 3. Chrome Extension Deployment
This is the part that sits in your browser and blocks the sites.

1.  Open Chrome and go to: `chrome://extensions/`
2.  Turn on **Developer Mode** (top right toggle).
3.  Click **Load unpacked** (top left).
4.  Navigate to your `stop-porn-ai` folder and select the **`extension`** folder inside it.
5.  Pin the extension to your bar. It’s now active!

---

### 4. Accountability (Resend)
1.  Go to [Resend.com](https://resend.com) and create a free account.
2.  Go to **API Keys** and create a new one.
3.  Copy it and add it to your Vercel Environment Variables as `RESEND_API_KEY`.

---

**That's it!** Your platform is now fully powered by AI and secured by your own Google Sheet.
