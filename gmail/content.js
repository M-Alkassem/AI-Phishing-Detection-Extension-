const SIDEBAR_ID = 'ai-phishing-detector-sidebar';

function injectSidebar() {
  if (document.getElementById(SIDEBAR_ID)) return;

  const sidebar = document.createElement('div');
  sidebar.id = SIDEBAR_ID;
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <img src="${(chrome.runtime && chrome.runtime.getURL) ? chrome.runtime.getURL('icons/icon48.png') : ''}" alt="Logo" class="logo">
      <h3>Phishing Detector</h3>
      <button id="close-sidebar">&times;</button>
    </div>
    <div class="sidebar-content">
      <div id="scan-status" class="status-loading">
        <div class="spinner"></div>
        <p>Scanning email...</p>
      </div>
      <div id="scan-result" style="display: none;">
        <div id="verdict-badge" class="badge"></div>
        <div class="confidence-container">
          <span>Confidence</span>
          <div class="progress-bar">
            <div id="confidence-bar" class="progress"></div>
          </div>
          <span id="confidence-text"></span>
        </div>
        <div id="summary-section">
          <h4>Summary</h4>
          <p id="verdict-summary"></p>
        </div>
        <div id="recommendation-section">
          <h4>What should you do?</h4>
          <p id="verdict-recommendation" class="recommendation-box"></p>
        </div>
        <div id="red-flags-section">
          <h4>Red Flags</h4>
          <ul id="red-flags-list"></ul>
        </div>
      </div>
      <div id="error-message" style="display: none;" class="error-state">
        <p>Could not scan this email.</p>
      </div>
    </div>
    <div class="sidebar-footer">
      <button id="report-false-positive">Report False Positive</button>
    </div>
  `;

  document.body.appendChild(sidebar);

  document.getElementById('close-sidebar').addEventListener('click', () => {
    sidebar.style.display = 'none';
  });

  document.getElementById('report-false-positive').addEventListener('click', () => {
    const btn = document.getElementById('report-false-positive');
    const originalText = btn.innerText;
    btn.innerText = '✅ Report Sent! Thank you.';
    btn.disabled = true;
    btn.style.backgroundColor = '#e8f5e9';
    btn.style.color = '#2e7d32';
    
    setTimeout(() => {
      btn.innerText = originalText;
      btn.disabled = false;
      btn.style.backgroundColor = '';
      btn.style.color = '';
    }, 3000);
  });
}

function extractEmailData() {
  // Enhanced Gmail specific selectors
  const subject = document.querySelector('h2.hP')?.innerText || 'No Subject';
  
  // Try multiple ways to get sender info
  const senderNameEl = document.querySelector('span.gD');
  const senderEmailEl = document.querySelector('span.gD');
  
  const senderName = senderNameEl?.innerText || 'Unknown';
  const senderEmail = senderEmailEl?.getAttribute('email') || senderEmailEl?.innerText?.match(/<(.+@.+)>/)?.[1] || 'Unknown';
  
  const bodyEl = document.querySelector('div.a3s.aiL') || document.querySelector('div.adn.ads');
  const body = bodyEl?.innerText || '';
  
  const links = Array.from((bodyEl || document).querySelectorAll('a')).map(a => ({
    text: a.innerText.trim(),
    href: a.href
  })).filter(link => link.href && !link.href.startsWith('mailto:'));

  console.log('Extracted Email Data:', { subject, senderName, senderEmail });

  return {
    subject,
    senderName,
    senderEmail,
    replyTo: senderEmail,
    body: body.substring(0, 5000), // Safety limit for prompt size
    links
  };
}

async function startScan() {
  const statusEl = document.getElementById('scan-status');
  const resultEl = document.getElementById('scan-result');
  const errorEl = document.getElementById('error-message');

  statusEl.style.display = 'block';
  resultEl.style.display = 'none';
  errorEl.style.display = 'none';

  const emailData = extractEmailData();
  
  // Use sendMessage to talk to the background script (bypassing CSP)
  chrome.runtime.sendMessage({ 
    action: 'analyzeEmail', 
    emailData 
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Runtime Error:', chrome.runtime.lastError);
      showError(chrome.runtime.lastError.message);
      return;
    }

    if (response.success) {
      displayResult(response.data);
    } else {
      console.error('API Error:', response.error);
      showError(response.error);
    }
  });
}

function showError(message) {
  const statusEl = document.getElementById('scan-status');
  const errorEl = document.getElementById('error-message');
  statusEl.style.display = 'none';
  errorEl.style.display = 'block';
  errorEl.innerHTML = `<p>Could not scan this email.</p><small style="color: #999; font-size: 10px;">${message}</small>`;
}

function displayResult(analysis) {
  const statusEl = document.getElementById('scan-status');
  const resultEl = document.getElementById('scan-result');
  const badgeEl = document.getElementById('verdict-badge');
  const confBarEl = document.getElementById('confidence-bar');
  const confTextEl = document.getElementById('confidence-text');
  const summaryEl = document.getElementById('verdict-summary');
  const recommendationEl = document.getElementById('verdict-recommendation');
  const redFlagsList = document.getElementById('red-flags-list');

  statusEl.style.display = 'none';
  resultEl.style.display = 'block';

  badgeEl.innerText = analysis.verdict;
  badgeEl.className = `badge badge-${analysis.verdict.toLowerCase()}`;
  
  confBarEl.style.width = `${analysis.confidence_score}%`;
  confTextEl.innerText = `${analysis.confidence_score}%`;
  
  summaryEl.innerText = analysis.summary;
  recommendationEl.innerText = analysis.recommendation;
  
  // Add styling based on threat level
  recommendationEl.className = `recommendation-box threat-${(analysis.threat_level || 'low').toLowerCase()}`;

  redFlagsList.innerHTML = '';
  analysis.red_flags.forEach(flag => {
    const li = document.createElement('li');
    li.innerText = flag;
    redFlagsList.appendChild(li);
  });
}

// Watch for URL changes or DOM changes to detect when an email is opened
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    if (url.includes('/#inbox/') || url.includes('/#sent/') || url.includes('/#all/') || url.includes('/#spam/')) {
        // Debounce or wait for content to load
        setTimeout(() => {
            if (document.querySelector('h2.hP')) {
                injectSidebar();
                document.getElementById(SIDEBAR_ID).style.display = 'flex';
                startScan();
            }
        }, 1000);
    }
  }
}).observe(document, {subtree: true, childList: true});

// Initial check
if (location.href.includes('/#inbox/') || location.href.includes('/#sent/') || location.href.includes('/#all/') || location.href.includes('/#spam/')) {
    setTimeout(() => {
        if (document.querySelector('h2.hP')) {
            injectSidebar();
            startScan();
        }
    }, 1000);
}
