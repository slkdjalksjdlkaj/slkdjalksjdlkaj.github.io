const REDEEMED_KEY = 'fn_redeemed_codes';
const ALERT_SETTING_KEY = 'fn_alert_new_codes';

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
    if (!list) return;

    const redeemed = getRedeemedCodes();
    list.innerHTML = '';

    baseCodes.forEach(item => {
        const isRedeemed = redeemed.includes(item.code);
        const card = document.createElement('div');
        card.className = `code-card ${isRedeemed ? 'redeemed' : ''}`;

        card.innerHTML = `
            <div class="code-info">
                <span class="code-value" title="Click to copy">${item.code}</span>
                <span class="code-reward"><strong>Gives:</strong> ${item.reward}</span>
                <span class="code-source"><strong>Source:</strong> ${item.source}</span>
            </div>
            <div class="code-card-actions">
                <button type="button" class="btn btn-copy">Copy Code</button>
                <button type="button" class="btn btn-redeem ${isRedeemed ? '' : 'btn-accent'}">
                    ${isRedeemed ? 'Redeemed' : 'Mark Redeemed'}
                </button>
            </div>
        `;

        // Click code name to copy
        const codeValueEl = card.querySelector('.code-value');
        codeValueEl.addEventListener('click', () => copyToClipboard(item.code, codeValueEl));

        // Copy button
        const copyBtn = card.querySelector('.btn-copy');
        copyBtn.addEventListener('click', () => copyToClipboard(item.code, copyBtn));

        // Redeem button
        const redeemBtn = card.querySelector('.btn-redeem');
        redeemBtn.addEventListener('click', () => toggleRedeem(item.code));

        list.appendChild(card);
    });
}

function initToolbar() {
    const redeemAllBtn = document.getElementById('redeemAllBtn');
    const unredeemAllBtn = document.getElementById('unredeemAllBtn');
    const alertToggle = document.getElementById('alertNewCodesToggle');

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
}

document.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    renderCodes();
});
