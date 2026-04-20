# AI-Powered Email Phishing Detection System — Antigravity Prompt

Build an AI-Powered Email Phishing Detection System with the following specifications:

---

## Project Overview

Create a real-time AI phishing detection tool that integrates directly into Gmail
and Outlook as a sidebar. When a user opens any email, the sidebar automatically
scans it and returns an AI-generated verdict with a plain-English explanation of
any red flags found.

---

## Platform 1 — Gmail (Chrome/Edge Browser Extension)

- Build a Chrome Extension using Manifest V3
- Inject a sidebar into the Gmail web interface that activates whenever the user opens an email
- Use the Gmail API to extract the email's sender name, sender email address,
  reply-to address, subject line, body text, and all hyperlinks
- Send the extracted data to the Gemini API (gemini-2.0-flash) for analysis
- Display the verdict inside the injected sidebar with a color-coded badge:
  ✅ Safe (green), ⚠️ Suspicious (yellow), 🚨 Phishing (red)
- Below the badge, show a plain-English breakdown of every red flag detected,
  or confirm why the email appears legitimate

---

## Platform 2 — Outlook (Office Add-in)

- Build an Office.js Add-in that works across Outlook Web, Outlook Desktop (Windows/Mac)
- Use the Microsoft Graph API to extract the same email fields:
  sender info, subject, body, and links
- Use the same Gemini API integration and verdict format as the Gmail extension
- Display the sidebar natively inside Outlook using the Office Add-in task pane UI

---

## AI Analysis Engine (shared between both platforms)

Send the following structured prompt to Gemini for every email scanned:

> "You are a cybersecurity expert specializing in phishing detection. Analyze the
> following email and determine if it is Safe, Suspicious, or Phishing. Check for:
> sender domain vs display name mismatch, urgency or fear-based language, requests
> for credentials, passwords, payments or personal information, impersonation of
> known brands or organizations, mismatched or obfuscated hyperlinks, and unusual
> grammar or formatting. Return a JSON response with: verdict (Safe / Suspicious /
> Phishing), confidence score (0-100), and an array of red flags found (empty if
> Safe), and a one-paragraph plain-English summary explaining your verdict."

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
| Gmail Extension  | Chrome Extension Manifest V3, JavaScript, Gmail API |
| Outlook Add-in   | Office.js, Microsoft Graph API, JavaScript          |
| AI Engine        | Google Gemini API (gemini-2.0-flash)                |
| Styling          | Vanilla CSS or TailwindCSS                          |

---

## Additional Requirements

- API key for Gemini should be stored securely in extension storage, not hardcoded
- Rate limit handling: if the API call fails, show a neutral "Could not scan" state gracefully
- Scan should trigger automatically every time a new email is opened,
  with a loading spinner while the AI processes
- The extension should work without requiring the user to click anything — fully automatic