const REDEEMED_KEY = 'fn_redeemed_codes';
const ALERT_SETTING_KEY = 'fn_alert_new_codes';
const HIDE_REDEEMED_KEY = 'fn_hide_redeemed_codes';

function getRedeemedCodes() {
    try {
        return JSON.parse(localStorage.getItem(REDEEMED_KEY)) || [];
    } catch {
        return [];
    }
}

function saveRedeemedCodes(codes) {
    localStorage.setItem(REDEEMED_KEY, JSON.stringify(codes));
}

function toggleRedeem(code) {
    let redeemed = getRedeemedCodes();
    if (redeemed.includes(code)) {
        redeemed = redeemed.filter(c => c !== code);
    } else {
        redeemed.push(code);
    }
    saveRedeemedCodes(redeemed);
    renderCodes();
}

function redeemAll() {
    const allCodes = baseCodes.map(c => c.code);
    saveRedeemedCodes(allCodes);
    renderCodes();
}

function unredeemAll() {
    saveRedeemedCodes([]);
    renderCodes();
}

function copyToClipboard(text, targetElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = targetElement.textContent;
        targetElement.textContent = "Copied!";
        setTimeout(() => {
            targetElement.textContent = originalText;
        }, 1200);
    });
}

function renderCodes() {
    const list = document.getElementById('codesList');
    const hideRedeemedToggle = document.getElementById('hideRedeemedToggle');
    if (!list) return;

    const redeemed = getRedeemedCodes();
    const hideRedeemed = hideRedeemedToggle ? hideRedeemedToggle.checked : true;

    list.innerHTML = '';

    const filteredCodes = baseCodes.filter(item => {
        if (hideRedeemed && redeemed.includes(item.code)) {
            return false;
        }
        return true;
    });

    if (filteredCodes.length === 0) {
        list.innerHTML = '<div class="codes-empty">No codes to display</div>';
        return;
    }

    filteredCodes.forEach(item => {
        const isRedeemed = redeemed.includes(item.code);
        const row = document.createElement('div');
        row.className = `code-row ${isRedeemed ? 'redeemed' : ''}`;

        // Format Source link or plain text
        const sourceHtml = item.link && item.link.trim() !== ''
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="code-source-link">${item.source || ''}</a>`
            : `<span class="code-source">${item.source || ''}</span>`;

        row.innerHTML = `
            <span class="code-value" title="Click to copy">${item.code}</span>
            <span class="code-reward">${item.reward}</span>
            <div class="code-source-cell">${sourceHtml}</div>
            <span class="code-date-cell">${getRelativeTimeString(item.date)}</span>
            <div class="code-card-actions">
                <button type="button" class="btn btn-copy">Copy Code</button>
                <button type="button" class="btn btn-redeem ${isRedeemed ? '' : 'btn-accent'}">
                    ${isRedeemed ? 'Redeemed' : 'Mark Redeemed'}
                </button>
            </div>
        `;

        // Click code name to copy
        const codeValueEl = row.querySelector('.code-value');
        codeValueEl.addEventListener('click', () => copyToClipboard(item.code, codeValueEl));

        // Copy button
        const copyBtn = row.querySelector('.btn-copy');
        copyBtn.addEventListener('click', () => copyToClipboard(item.code, copyBtn));

        // Redeem button
        const redeemBtn = row.querySelector('.btn-redeem');
        redeemBtn.addEventListener('click', () => toggleRedeem(item.code));

        list.appendChild(row);
    });
}

function initToolbar() {
    const redeemAllBtn = document.getElementById('redeemAllBtn');
    const unredeemAllBtn = document.getElementById('unredeemAllBtn');
    const alertToggle = document.getElementById('alertNewCodesToggle');
    const hideRedeemedToggle = document.getElementById('hideRedeemedToggle');

    if (redeemAllBtn) redeemAllBtn.addEventListener('click', redeemAll);
    if (unredeemAllBtn) unredeemAllBtn.addEventListener('click', unredeemAll);

    // Alert setting toggle persistence
    if (alertToggle) {
        const storedSetting = localStorage.getItem(ALERT_SETTING_KEY);
        alertToggle.checked = storedSetting !== null ? JSON.parse(storedSetting) : true;

        alertToggle.addEventListener('change', (e) => {
            localStorage.setItem(ALERT_SETTING_KEY, JSON.stringify(e.target.checked));
        });
    }

    // Hide redeemed setting toggle persistence
    if (hideRedeemedToggle) {
        const storedSetting = localStorage.getItem(HIDE_REDEEMED_KEY);
        hideRedeemedToggle.checked = storedSetting !== null ? JSON.parse(storedSetting) : true;

        hideRedeemedToggle.addEventListener('change', (e) => {
            localStorage.setItem(HIDE_REDEEMED_KEY, JSON.stringify(e.target.checked));
            renderCodes();
        });
    }
}

// Helper to compute relative time string
function getRelativeTimeString(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(diffInSeconds / 3600);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(diffInSeconds / 86400);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
}

document.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    renderCodes();
});
