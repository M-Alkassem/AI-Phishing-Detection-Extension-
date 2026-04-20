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
  renderCorrections();
}

async function renderCorrections() {
  const { corrections = [] } = await chrome.storage.local.get('corrections');
  const listEl = document.getElementById('corrections-list');
  const emptyEl = document.getElementById('no-corrections');
  
  listEl.innerHTML = '';
  
  if (corrections.length === 0) {
    emptyEl.style.display = 'block';
    return;
  }
  
  emptyEl.style.display = 'none';
  corrections.forEach(item => {
    const li = document.createElement('li');
    li.className = 'correction-item';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.padding = '10px';
    li.style.borderBottom = '1px solid #eee';
    li.style.fontSize = '13px';
    
    li.innerHTML = `
      <div style="flex-grow: 1;">
        <div style="font-weight: 600; color: #1a73e8;">${item.email}</div>
        <div style="color: #666; font-size: 11px;">Subject: ${item.subject}</div>
      </div>
      <button class="remove-correction" data-email="${item.email}" data-subject="${item.subject}" style="background: none; color: #d93025; padding: 4px 8px; font-size: 12px; border: 1px solid #fad2cf; border-radius: 4px;">Delete</button>
    `;
    listEl.appendChild(li);
  });

  document.querySelectorAll('.remove-correction').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const email = e.target.getAttribute('data-email');
      const subject = e.target.getAttribute('data-subject');
      const { corrections: currentCorrections = [] } = await chrome.storage.local.get('corrections');
      const newCorrections = currentCorrections.filter(c => !(c.email === email && c.subject === subject));
      await chrome.storage.local.set({ corrections: newCorrections });
      renderCorrections();
    });
  });
}

async function clearCorrections() {
  if (confirm('Are you sure you want to clear the AI correction memory? Accuracy might decrease until new reports are made.')) {
    await chrome.storage.local.set({ corrections: [] });
    renderCorrections();
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clear-corrections').addEventListener('click', clearCorrections);
