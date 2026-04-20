// options.js - Handles saving/loading generic AI settings

function saveOptions() {
  const apiUrl = document.getElementById('api-url').value;
  const apiKey = document.getElementById('api-key').value;
  const modelId = document.getElementById('model-id').value;

  chrome.storage.local.set({
    apiUrl: apiUrl,
    apiKey: apiKey,
    modelId: modelId
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Configuration saved successfully!';
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
}

function restoreOptions() {
  chrome.storage.local.get({
    apiUrl: '',
    apiKey: '',
    modelId: 'llama-3.3-70b-versatile'
  }, (items) => {
    document.getElementById('api-url').value = items.apiUrl;
    document.getElementById('api-key').value = items.apiKey;
    document.getElementById('model-id').value = items.modelId;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
