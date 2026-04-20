# AI Phishing Detector 🛡️

A real-time, AI-powered phishing detection extension for Gmail. Built with **Manifest V3**, **JavaScript**, and a flexible AI integration layer.

## 🚀 Overview
This project is an AI-driven security tool that helps users identify phishing attempts in their Gmail inbox. It extracts email metadata and content and analyzes it using a world-class cybersecurity expert prompt.

### Key Features
- **Real-time Scanning**: Automatically detects when an email is opened.
- **Provider Agnostic**: Use any OpenAI-compatible API (Groq, OpenAI, etc.).
- **Deep Content Analysis**: Detects brand impersonation, deceptive urgency, and mismatched URLs.
- **Actionable Advice**: Provides specific "What should you do?" instructions for every verdict.
- **Secure Architecture**: API keys are stored locally in Chrome storage—never hardcoded in source.

## 🛠️ Tech Stack
- **Extension Framework**: Chrome Manifest V3
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Messaging**: Background Service Worker for CSP bypass

## ⚙️ How to Use (Local Setup)

### 1. Installation
1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (top-right toggle).
4. Click **Load Unpacked** and select this project folder.

### 2. Configure AI Connection
1. In `chrome://extensions/`, find this extension and click **Details**.
2. Click **Extension Options**.
3. Enter your **API URL**, **API Key**, and **Model ID**.
4. Click **Save Configuration**.

### 3. Start Scanning!
Open any email in Gmail, and the sidebar will automatically appear with the AI analysis.

---

*Built for cybersecurity research and educational purposes.*



<img width="1114" height="641" alt="image" src="https://github.com/user-attachments/assets/3c8db9fc-941c-4f4b-bad2-03f474bf6017" />

---

<img width="1109" height="644" alt="image" src="https://github.com/user-attachments/assets/0c0b8e1c-9944-4374-81c7-843df1e84525" />

