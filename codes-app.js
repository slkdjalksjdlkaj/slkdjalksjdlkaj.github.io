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

// Floating copy notification & clipboard helper
function showFloatingCopyText(anchorElement) {
    const textEl = document.createElement('div');
    textEl.className = 'floating-copy-text';
    textEl.textContent = 'Code copied to clipboard!';

    // Calculate absolute position on the viewport
    const rect = anchorElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;

    // Random horizontal trajectory (-25px to +25px offset)
    const randomAngleX = (Math.random() - 0.5) * 50;
    const endY = -40 - Math.random() * 20; // Float up 40px to 60px

    textEl.style.setProperty('--target-x', `${randomAngleX}px`);
    textEl.style.setProperty('--target-y', `${endY}px`);
    textEl.style.left = `${startX}px`;
    textEl.style.top = `${startY}px`;

    document.body.appendChild(textEl);

    // Remove element when animation completes
    textEl.addEventListener('animationend', () => {
        textEl.remove();
    });
}

function copySupportCode(buttonEl) {
    const code = buttonEl.textContent.trim();

    // Trigger visual feedback immediately on user click
    showFloatingCopyText(buttonEl);

    // Attempt clipboard write
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => {
            fallbackCopy(code);
        });
    } else {
        fallbackCopy(code);
    }
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

document.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    renderCodes();
});
