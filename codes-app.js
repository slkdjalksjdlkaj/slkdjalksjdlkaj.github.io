const REDEEMED_KEY = 'fn_redeemed_codes';

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
                <span class="code-value">${item.code}</span>
                <span class="code-reward"><strong>Gives:</strong> ${item.reward}</span>
                <span class="code-source"><strong>Source:</strong> ${item.source}</span>
            </div>
            <button class="btn ${isRedeemed ? '' : 'btn-accent'}" type="button">
                ${isRedeemed ? 'Redeemed' : 'Mark Redeemed'}
            </button>
        `;

        card.querySelector('button').addEventListener('click', () => toggleRedeem(item.code));
        list.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', renderCodes);
