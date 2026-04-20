# AI-Powered Email Phishing Detection System — Antigravity Prompt

Build an AI-Powered Email Phishing Detection System with the following specifications:

---

## Project Overview

Create a real-time AI phishing detection tool that integrates directly into Gmail
as a sidebar. When a user opens any email, the sidebar automatically
scans it and returns an AI-generated verdict with a plain-English explanation of
any red flags found.

---

## Gmail Extension (Chrome/Edge Browser Extension)

- Build a Chrome Extension using Manifest V3
- Inject a sidebar into the Gmail web interface that activates whenever the user opens an email
- Extract the email's sender name, sender email address,
  reply-to address, subject line, body text, and all hyperlinks
- Send the extracted data to an AI API for analysis
- Display the verdict inside the injected sidebar with a color-coded badge:
  ✅ Safe (green), ⚠️ Suspicious (yellow), 🚨 Phishing (red)
- Below the badge, show a plain-English breakdown of every red flag detected,
  or confirm why the email appears legitimate

---

## AI Analysis Engine

Use a structured prompt to determine if an email is Safe, Suspicious, or Phishing. Check for:
- sender domain vs display name mismatch
- urgency or fear-based language
- requests for credentials, passwords, payments or personal information
- impersonation of known brands or organizations
- mismatched or obfuscated hyperlinks
- unusual grammar or formatting

Return a JSON response with: verdict (Safe / Suspicious / Phishing), confidence score (0-100), and an array of red flags found, and a one-paragraph plain-English summary explaining your verdict.

---

## UI / Sidebar Design

- Clean, minimal sidebar design with a white background
- Large color-coded verdict badge at the top (green / yellow / red)
- Confidence score shown as a percentage bar
- Expandable list of red flags, each with a short explanation
- A "Report False Positive" button at the bottom
- Responsive design that works at narrow sidebar widths

---

## Tech Stack

| Component        | Technology                                          |
|------------------|-----------------------------------------------------|
| Gmail Extension  | Chrome Extension Manifest V3, JavaScript, DOM API   |
| AI Engine        | Provider-Agnostic LLM Integration                   |
| Styling          | Vanilla CSS                                         |

---

## Additional Requirements

- API keys should be stored securely in extension storage, not hardcoded
- Rate limit handling: if the API call fails, show a neutral "Could not scan" state gracefully
- Scan should trigger automatically every time a new email is opened, with a loading spinner while the AI processes
- The extension should work without requiring the user to click anything — fully automatic