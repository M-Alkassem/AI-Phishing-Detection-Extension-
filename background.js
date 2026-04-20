// background.js - Generic AI handler for public deployment

async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get({
      apiUrl: '', // e.g., https://api.groq.com/openai/v1/chat/completions
      apiKey: '',
      modelId: 'llama-3.3-70b-versatile'
    }, resolve);
  });
}

async function analyzeEmail(emailData) {
  const settings = await getSettings();
  
  if (!settings.apiUrl || !settings.apiKey) {
    throw new Error('API configuration missing. Please set your URL and Key in the extension options.');
  }

  const prompt = `You are a world-class Cybersecurity Expert. Analyze the following email for phishing risks. 
Return a JSON response:
{
  "verdict": "Safe" | "Suspicious" | "Phishing",
  "confidence_score": 0-100,
  "red_flags": ["details"],
  "summary": "explanation",
  "recommendation": "advice",
  "threat_level": "Low" | "Medium" | "High"
}

Email:
Sender: ${emailData.senderName} (${emailData.senderEmail})
Subject: ${emailData.subject}
Body: ${emailData.body}
Links: ${JSON.stringify(emailData.links)}`;

  try {
    const response = await fetch(settings.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: settings.modelId,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`[API Error ${response.status}] Check your configuration.`);
    }

    const result = await response.json();
    // Support both OpenAI style (choices) and generic JSON responses
    const textResponse = result.choices ? result.choices[0].message.content : JSON.stringify(result);
    
    const analysis = parseAIResponse(textResponse);
    analysis.scanned_at = new Date().toLocaleTimeString();
    return analysis;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

function parseAIResponse(text) {
  try {
    const jsonString = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(jsonString);
  } catch (e) {
    throw new Error('[FORMAT ERROR] AI did not return valid JSON');
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeEmail') {
    analyzeEmail(request.emailData)
      .then(analysis => sendResponse({ success: true, data: analysis }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; 
  }
});
