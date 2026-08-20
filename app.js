/* ===================================================
   Constants
   =================================================== */

const KEYS = {
    obtained: 'fn_obtained_sprites',
    mastered: 'fn_mastered_sprites',
    search: 'fn_state_search',
    theme: 'fn_state_theme',
    status: 'fn_state_status_filter',
    hideMastered: 'fn_state_hide_mastered',
    sortOrder: 'fn_state_sort_order',
    showUnreleased: 'fn_state_unreleased',
    lowFidelity: 'fn_state_low_fidelity',
    openExports: 'fn_state_open_exports',
    season: 'fn_state_season',
};

const THEME_ORDER = ['Basic', 'Gold', 'Candy', 'Galaxy', 'Gem', 'Holofoil', 'Cube', 'Rift', 'Quack', 'Cheat'];
const RARITY_ORDER = ['Mythic', 'Legendary', 'Epic', 'Rare', 'Special'];
const STATUS_FILTERS = ['all', 'owned', 'missing'];
const SORT_METHODS = ['theme', 'sprite', 'name', 'rarity'];
const UI_THEME_LABELS = { Candy: 'Gummy' };
const EXPORT_THEME_LABELS = { Basic: 'NORMAL', Candy: 'GUMMY' };
const TRADE_THEME_LABELS = { Basic: 'Base', Candy: 'Gummy' };
const TRACKER_URL = 'https://staticvacant.github.io/fnsprites/';
const CROWN_ICON = '<svg class="crown-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 19h20v2H2v-2zM2 5l5 3.5L12 2l5 6.5L22 5v12H2V5z"/></svg>';

const EXPORT_LAYOUT = {
    border: 4,
    sidePad: 8,
    minCanvasW: 240,
    compactHeaderW: 760,
    headerH: 50,
    compactHeaderH: 80,
    colHeaderH: 25,
    cardW: 110,
    cardH: 138,
    rowGap: 6,
    cardGap: 6,
    labelW: 90,
    colGap: 16,
    footerH: 32,
    maxSingleColumnRows: 6,
};

/* ===================================================
   State
   =================================================== */

const state = {
    obtained: [],
    mastered: [],
    viewMode: false,
    filters: { search: '', theme: 'all', season: 'all', status: 'all' },
    settings: {
        hideMastered: false,
        sortOrder: 'theme',
        showUnreleased: false,
        lowFidelity: false,
        openExports: false,
    },
};

/* ===================================================
   DOM References
   =================================================== */

const dom = {
    viewBanner: document.getElementById('viewBanner'),
    grid: document.getElementById('spriteGrid'),
    searchInput: document.getElementById('searchInput'),
    themeFilter: document.getElementById('themeFilter'),
    sortOrder: document.getElementById('sortOrder'),
    statusPills: document.getElementById('statusPills'),
    hideMastered: document.getElementById('hideMastered'),
    showUnreleased: document.getElementById('showUnreleased'),
    lowFidelity: document.getElementById('lowFidelity'),
    seasonFilter: document.getElementById('seasonFilter'),
    openExports: document.getElementById('openExports'), // ADD THIS
    exportModeSwitch: document.getElementById('exportModeSwitch'),
    exportDropdown: document.getElementById('exportDropdown'),
    exportToggle: document.getElementById('exportToggle'),
    copyDropdown: document.getElementById('copyDropdown'),
    copyToggle: document.getElementById('copyToggle'),
    shareBtn: document.getElementById('shareBtn'),
    copyTradeTextBtn: document.getElementById('copyTradeTextBtn'),
    copyTradeGridBtn: document.getElementById('copyTradeGridBtn'),
    collectionRatio: document.getElementById('collectionRatio'),
    collectionFill: document.getElementById('collectionFill'),
    masteryRatio: document.getElementById('masteryRatio'),
    masteryFill: document.getElementById('masteryFill'),
    exportBackupBtn: document.getElementById('exportBackupBtn'),
    importBtn: document.getElementById('importBtn'),
    importInput: document.getElementById('importInput'),
};

/* ===================================================
   Persistence
   =================================================== */

function persist(key, value) {
    try {
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    } catch (err) {
        console.warn('Unable to save tracker state.', err);
    }
}

function readStoredArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function uniqueValidIds(ids, validIds = getSpriteIdSet()) {
    return [...new Set(ids)].filter(id => validIds.has(id));
}

function saveCollection() {
    persist(KEYS.obtained, state.obtained);
    persist(KEYS.mastered, state.mastered);
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function load() {
    const validIds = getSpriteIdSet();
    state.obtained = uniqueValidIds(readStoredArray(KEYS.obtained), validIds);
    state.mastered = uniqueValidIds(readStoredArray(KEYS.mastered), validIds)
        .filter(id => state.obtained.includes(id));
    state.filters.search = localStorage.getItem(KEYS.search) || '';
    state.filters.theme = localStorage.getItem(KEYS.theme) || 'all';
    state.filters.season = localStorage.getItem(KEYS.season) || 'all';

    let savedStatus = localStorage.getItem(KEYS.status) || 'all';
    if (savedStatus === 'obtained') savedStatus = 'owned';
    state.filters.status = STATUS_FILTERS.includes(savedStatus) ? savedStatus : 'all';

    state.settings.hideMastered = localStorage.getItem(KEYS.hideMastered) === 'true';
    
    let savedSort = localStorage.getItem(KEYS.sortOrder);
    if (!savedSort) {
        const legacyGroup = localStorage.getItem('fn_state_group_theme');
        savedSort = legacyGroup === 'false' ? 'sprite' : 'theme';
    }
    state.settings.sortOrder = SORT_METHODS.includes(savedSort) ? savedSort : 'theme';

    state.settings.showUnreleased = localStorage.getItem(KEYS.showUnreleased) === 'true';
    state.settings.lowFidelity = localStorage.getItem(KEYS.lowFidelity) === 'true';
    state.settings.openExports = localStorage.getItem(KEYS.openExports) === 'true';
}

function applyStateToDOM() {
    dom.searchInput.value = state.filters.search;
    dom.themeFilter.value = state.filters.theme;
    dom.seasonFilter.value = state.filters.season;
    dom.sortOrder.value = state.settings.sortOrder;
    dom.hideMastered.checked = state.settings.hideMastered;
    dom.showUnreleased.checked = state.settings.showUnreleased;
    dom.lowFidelity.checked = state.settings.lowFidelity;
    document.body.classList.toggle('low-fidelity', state.settings.lowFidelity);
   
    if (isIOS()) {
            if (dom.exportModeSwitch) dom.exportModeSwitch.hidden = true;
        } else {
            dom.openExports.checked = !state.settings.openExports;
            const switchLabel = dom.exportModeSwitch.querySelector('span');
            if (switchLabel) {
                switchLabel.textContent = dom.openExports.checked ? 'Download Exports' : 'Open Exports';
            }
        }


   
    dom.statusPills.querySelectorAll('.pill').forEach(pill => {
        const match =
            (pill.dataset.status === 'all' && state.filters.status === 'all') ||
            (pill.dataset.status === 'owned' && state.filters.status === 'owned') ||
            (pill.dataset.status === 'missing' && state.filters.status === 'missing');
        pill.classList.toggle('active', match);
        pill.setAttribute('aria-pressed', String(match));
    });
}

function checkUnredeemedCodes() {
    const notifDot = document.getElementById('codesNotification');
    const codesBtn = document.getElementById('codesBtn');
    if (typeof baseCodes === 'undefined') return;

    let showAlerts = true;
    try {
        const storedSetting = localStorage.getItem('fn_alert_new_codes');
        if (storedSetting !== null) {
            showAlerts = JSON.parse(storedSetting);
        }
    } catch {
        showAlerts = true;
    }

    if (!showAlerts) {
        if (notifDot) notifDot.hidden = true;
        if (codesBtn) codesBtn.classList.remove('btn-hack-active');
        return;
    }

    let redeemed = [];
    try {
        redeemed = JSON.parse(localStorage.getItem('fn_redeemed_codes')) || [];
    } catch {
        redeemed = [];
    }

    const hasUnredeemed = baseCodes.some(c => c.active && !redeemed.includes(c.code));
    if (notifDot) notifDot.hidden = !hasUnredeemed;

    // Outline button if any unredeemed code matches an uncollected sprite
    const hasUncollectedReward = baseCodes.some(c => 
        c.active && 
        !redeemed.includes(c.code) && 
        c.internalreward && 
        !isObtained(c.internalreward)
    );

    if (codesBtn) {
        codesBtn.classList.toggle('btn-hack-active', hasUncollectedReward);
    }
}

/* ===================================================
   Share Encoding / Decoding
   =================================================== */

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function encodeBits(bits) {
    while (bits.length % 6 !== 0) {
        bits += '0';
    }
    let code = '';
    for (let i = 0; i < bits.length; i += 6) {
        const val = parseInt(bits.substring(i, i + 6), 2);
        code += B64_CHARS[val];
    }
    return code.replace(/A+$/, '');
}

function decodeBits(code) {
    if (!code) return '';
    let bits = '';
    for (let i = 0; i < code.length; i++) {
        const val = B64_CHARS.indexOf(code[i]);
        if (val === -1) return '';
        bits += val.toString(2).padStart(6, '0');
    }
    return bits;
}

function compressCollection(sprites, obtained, mastered) {
    let obtainedBits = '';
    let masteredBits = '';
    
    sprites.forEach(s => {
        obtainedBits += obtained.includes(s.id) ? '1' : '0';
        masteredBits += mastered.includes(s.id) ? '1' : '0';
    });

    const obtainedCode = encodeBits(obtainedBits);
    const masteredCode = encodeBits(masteredBits);

    if (!masteredCode) {
        return obtainedCode;
    }
    return `${obtainedCode}~${masteredCode}`;
}

function decompressCollection(sprites, code) {
    if (!code) return { obtained: [], mastered: [] };
    
    const parts = code.split('~');
    if (parts.length > 2) {
        return { obtained: [], mastered: [] };
    }

    const obtainedCode = parts[0];
    const masteredCode = parts[1] || '';

    if (!/^[A-Za-z0-9\-_]*$/.test(obtainedCode) || !/^[A-Za-z0-9\-_]*$/.test(masteredCode)) {
        return { obtained: [], mastered: [] };
    }

    try {
        const obtainedBits = decodeBits(obtainedCode);
        const masteredBits = decodeBits(masteredCode);

        const obtained = [];
        const mastered = [];

        sprites.forEach((s, idx) => {
            const isObtained = obtainedBits[idx] === '1';
            const isMastered = masteredBits[idx] === '1';

            if (isObtained) {
                obtained.push(s.id);
                if (isMastered) {
                    mastered.push(s.id);
                }
            }
        });

        return { obtained, mastered };
    } catch {
        return { obtained: [], mastered: [] };
    }
}

/* ===================================================
   Toast Notifications
   =================================================== */

function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));
    setTimeout(() => {
        el.classList.remove('visible');
        el.addEventListener('transitionend', () => el.remove(), { once: true });
        setTimeout(() => el.remove(), 500);
    }, 2500);
}

/* ===================================================
   Sprite Helpers
   =================================================== */

function getFamilyKey(sprite) {
    return sprite.id.split('_')[0];
}

function getSpriteIdSet(sprites = baseSprites) {
    return new Set(sprites.map(sprite => sprite.id));
}

function getSeasonData(season) {
    if (season === 'Runners') return { name: 'Runners', img: 'siteimages/s_runners.png' };
    if (season === 'Override') return { name: 'Override', img: 'siteimages/s_override.png' };
    return { name: 'Unknown', img: 'siteimages/s_unknown.png' };
}

function getReleasedSprites() {
    return baseSprites.filter(sprite => {
        if (sprite.unreleased) return false;
        if (state.filters.season !== 'all' && (sprite.season || 'Unknown') !== state.filters.season) return false;
        return true;
    });
}

function getFamilyKeys(sprites = getReleasedSprites()) {
    return sprites.reduce((keys, sprite) => {
        const key = getFamilyKey(sprite);
        if (!keys.includes(key)) keys.push(key);
        return keys;
    }, []);
}

function getActiveThemes(sprites = getReleasedSprites()) {
    return sprites
        .reduce((themes, sprite) => {
            if (!themes.includes(sprite.theme)) themes.push(sprite.theme);
            return themes;
        }, [])
        .sort((a, b) => getOrderedIndex(THEME_ORDER, a) - getOrderedIndex(THEME_ORDER, b));
}

function getOrderedIndex(order, value) {
    const index = order.indexOf(value);
    return index === -1 ? Infinity : index;
}

function getCharName(charKey) {
    const basicSprite = baseSprites.find(sprite => sprite.id === `${charKey}_basic`);
    return basicSprite ? basicSprite.name : charKey.charAt(0).toUpperCase() + charKey.slice(1);
}

function getDisplayName(name) {
    return name === 'Burnt Peanut' ? name : `${name} Sprite`;
}

function getUiThemeLabel(theme) {
    return UI_THEME_LABELS[theme] || theme;
}

function getExportThemeLabel(theme) {
    return EXPORT_THEME_LABELS[theme] || theme.toUpperCase();
}

function getTradeThemeLabel(theme) {
    return TRADE_THEME_LABELS[theme] || theme;
}

function getCollectionCounts(sprites = getReleasedSprites()) {
    return {
        total: sprites.length,
        collected: sprites.filter(sprite => isObtained(sprite.id)).length,
        mastered: sprites.filter(sprite => isMastered(sprite.id)).length,
    };
}

function getFamilyThemeMap(sprites) {
    return sprites.reduce((map, sprite) => {
        const familyKey = getFamilyKey(sprite);
        if (!map.has(familyKey)) map.set(familyKey, new Map());
        map.get(familyKey).set(sprite.theme, sprite);
        return map;
    }, new Map());
}

function isObtained(id) {
    return state.obtained.includes(id);
}

function isMastered(id) {
    return state.mastered.includes(id);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    }[char]));
}

/* ===================================================
   Progress
   =================================================== */

function updateProgress() {
    const { total, collected, mastered } = getCollectionCounts();

    dom.collectionRatio.textContent = `${collected} / ${total}`;
    dom.collectionFill.style.width = total > 0 ? `${(collected / total) * 100}%` : '0%';
    dom.masteryRatio.textContent = `${mastered} / ${total}`;
    dom.masteryFill.style.width = total > 0 ? `${(mastered / total) * 100}%` : '0%';
}
/* ===================================================
   Filtering & Sorting
   =================================================== */

function filterSprites() {
    const search = state.filters.search.trim().toLowerCase();

    return baseSprites.filter(sprite => {
        if (state.settings.hideMastered && isMastered(sprite.id)) return false;
        if (!state.settings.showUnreleased && sprite.unreleased) return false;
        if (state.viewMode && (!isObtained(sprite.id) || sprite.unreleased)) return false;

        const matchesSearch = !search || sprite.name.toLowerCase().includes(search);
        const matchesTheme = state.filters.theme === 'all' || sprite.theme === state.filters.theme;
        const matchesSeason = state.filters.season === 'all' || (sprite.season || 'Unknown') === state.filters.season;

        let matchesStatus = true;
        if (!state.viewMode) {
            const isOwned = isObtained(sprite.id);
            if (state.filters.status === 'owned') matchesStatus = isOwned;
            if (state.filters.status === 'missing') matchesStatus = !isOwned;
        }

        return matchesSearch && matchesTheme && matchesSeason && matchesStatus;
    });
}

function sortSprites(items, method) {
    const sorted = [...items];
    if (method === 'theme') {
        return sorted.sort((a, b) => {
            const idxA = getOrderedIndex(THEME_ORDER, a.theme);
            const idxB = getOrderedIndex(THEME_ORDER, b.theme);
            if (idxA !== idxB) return idxA - idxB;
            return 0;
        });
    }
    if (method === 'sprite') {
        return sorted.sort((a, b) => {
            const familyA = getFamilyKey(a);
            const familyB = getFamilyKey(b);
            if (familyA !== familyB) return familyA.localeCompare(familyB);
            return getOrderedIndex(THEME_ORDER, a.theme) - getOrderedIndex(THEME_ORDER, b.theme);
        });
    }
    if (method === 'name') {
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (method === 'rarity') {
        return sorted.sort((a, b) => {
            const idxA = getOrderedIndex(RARITY_ORDER, a.rarity);
            const idxB = getOrderedIndex(RARITY_ORDER, b.rarity);
            if (idxA !== idxB) return idxA - idxB;
            return a.name.localeCompare(b.name);
        });
    }
    return sorted;
}

/* ===================================================
   Rendering
   =================================================== */

function populateThemeFilter() {
    const themes = getActiveThemes(baseSprites);
    const selectedTheme = themes.includes(state.filters.theme) ? state.filters.theme : 'all';

    dom.themeFilter.replaceChildren(
        new Option('All themes', 'all'),
        ...themes.map(theme => new Option(getUiThemeLabel(theme), theme))
    );
    state.filters.theme = selectedTheme;
}

function renderGrid() {
    let items = filterSprites();
    items = sortSprites(items, state.settings.sortOrder);

    // Get unredeemed active code rewards
    let redeemed = [];
    try {
        redeemed = JSON.parse(localStorage.getItem('fn_redeemed_codes')) || [];
    } catch {
        redeemed = [];
    }
    const hackableRewards = new Set(
        baseCodes
            .filter(c => c.active && !redeemed.includes(c.code) && c.internalreward)
            .map(c => c.internalreward)
    );

    const frag = document.createDocumentFragment();

    for (const sprite of items) {
        const obtained = isObtained(sprite.id);
        const mastered = isMastered(sprite.id);
        const hasHack = !obtained && hackableRewards.has(sprite.id);

        const card = document.createElement('div');
        card.dataset.id = sprite.id;

        const classes = ['card', `rarity-${sprite.rarity}`, `theme-${sprite.theme}`];
        if (obtained) classes.push('obtained');
        if (mastered) classes.push('mastered');
        if (hasHack) classes.push('hack-available');
        card.className = classes.join(' ');

        if (!state.viewMode) {
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', String(obtained));
            card.setAttribute('aria-label', `${obtained ? 'Remove' : 'Mark'} ${sprite.name} ${obtained ? 'from' : 'as part of'} your collection`);
        }

        let cardHTML = buildCardHTML(sprite, obtained, mastered);
        if (hasHack) {
            cardHTML = `<div class="hack-badge">Hack Available</div>` + cardHTML;
        }
       

        card.innerHTML = cardHTML;
        frag.appendChild(card);
    }

    dom.grid.innerHTML = '';
    dom.grid.appendChild(frag);
    fitCardNames();
    updateProgress();
}

function buildCardHTML(sprite, obtained, mastered) {
    const rarityLabel = sprite.rarity === 'Mythic' ? 'MYTHIC' : sprite.rarity.toUpperCase();
    const imgPath = `sprites/${encodeURIComponent(sprite.id)}.png`;
    const safeName = escapeHTML(sprite.name);
    const safeRarity = escapeHTML(rarityLabel);
    const seasonData = getSeasonData(sprite.season);
    const safeSeasonName = escapeHTML(seasonData.name);

    let badge = '';
    if (sprite.unreleased) {
        badge = '<div class="card-badge unreleased-badge">Unreleased</div>';
    } else if (mastered) {
        badge = '<div class="card-badge mastered-badge">Mastered</div>';
    } else if (obtained) {
        badge = '<div class="card-badge collected">Collected</div>';
    }

    let crownAction = '';
    if (obtained && !mastered && !state.viewMode) {
        crownAction = `<button class="card-crown" type="button" title="Toggle mastery" aria-label="Mark ${safeName} as mastered">${CROWN_ICON}</button>`;
    }

    let crownDisplay = '';
    if (mastered) {
        crownDisplay = `<div class="card-crown-display">${CROWN_ICON}</div>`;
    }

    return `${badge}${crownAction}
        <div class="card-display">
            ${crownDisplay}
            <img src="${imgPath}" alt="${safeName}" loading="lazy">
            <div class="card-rarity">${safeRarity}</div>
            <div class="card-season" title="${safeSeasonName}">
                <img src="${seasonData.img}" alt="${safeSeasonName}" title="${safeSeasonName}">
            </div>
        </div>
        <div class="card-name"><span>${safeName}</span></div>`;
}

function fitCardNames() {
    dom.grid.querySelectorAll('.card-name span').forEach(span => {
        const parent = span.parentElement;
        if (!parent || parent.clientWidth === 0) return;
        let size = 14;
        span.style.fontSize = size + 'px';
        while (span.scrollWidth > parent.clientWidth && size > 8) {
            size -= 0.5;
            span.style.fontSize = size + 'px';
        }
    });
}

/* ===================================================
   Collection Actions
   =================================================== */

function toggleObtained(id) {
    if (isObtained(id)) {
        state.obtained = state.obtained.filter(x => x !== id);
        state.mastered = state.mastered.filter(x => x !== id);
    } else {
        state.obtained.push(id);
    }
    saveCollection();
    renderGrid();
}

function toggleMastery(id) {
    if (!isObtained(id)) return;
    if (isMastered(id)) {
        state.mastered = state.mastered.filter(x => x !== id);
    } else {
        state.mastered.push(id);
    }
    saveCollection();
    renderGrid();
}

/* ===================================================
   Canvas Export - Helpers
   =================================================== */

function getRarityGradient(rarity, theme) {
    const map = {
        Rare: ['#104273', '#081a35'],
        Epic: ['#4d1566', '#1e052c'],
        Legendary: ['#743e0a', '#301702'],
        Mythic: ['#70531c', '#2e2107'],
    };
    if (rarity !== 'Special') return map[rarity] || map.Rare;

    const themes = {
        Basic: ['#1c2436', '#0c0f17'], Gold: ['#61460b', '#241a02'],
        Candy: ['#6b183f', '#260514'], Galaxy: ['#1f1145', '#080314'],
        Gem: ['#114c47', '#041a18'], Holofoil: ['#204454', '#09171f'],
        Cube: ['#4c1d95', '#1e0b3d'],
        Rift: ['#154b5e', '#04161c'],
        Quack: ['#322554', '#12091f'],
        Cheat: ['#003b00', '#000800'],
    };
    return themes[theme] || themes.Basic;
}

function getRarityTagColors(rarity) {
    const map = {
        Rare: ['#004A8E', '#00FFFB'], Epic: ['#511D7F', '#ED2BFF'],
        Legendary: ['#8E4122', '#FBC568'], Mythic: ['#80622A', '#FFF1A9'],
        Special: ['#51f7cc', '#000000'],
    };
    return map[rarity] || map.Rare;
}

function getExportConfig(mode) {
    const releasedSprites = getReleasedSprites();
    let rawItems = [];

    if (mode === 'collected') rawItems = releasedSprites.filter(sprite => isObtained(sprite.id));
    else if (mode === 'missing') rawItems = releasedSprites.filter(sprite => !isObtained(sprite.id));
    else if (mode === 'unmastered') rawItems = releasedSprites.filter(sprite => isObtained(sprite.id) && !isMastered(sprite.id));
    else if (mode === 'mastered') rawItems = releasedSprites.filter(sprite => isObtained(sprite.id) && isMastered(sprite.id));
    else if (mode === 'trade') rawItems = releasedSprites;

    const items = mode === 'trade' ? rawItems : sortSprites(rawItems, state.settings.sortOrder);

    const configs = {
        collected: {
            items, titleL1: 'FORTNITE SPRITES TRACKER:', titleL2: 'MY COLLECTION',
            color: '#32cd32', filename: 'fnsprites-collection', emptyMsg: 'No collected sprites to export!',
        },
        missing: {
            items, titleL1: 'FORTNITE SPRITES TRACKER:', titleL2: "I'M LOOKING FOR THESE!",
            color: '#ef4444', filename: 'fnsprites-missing', emptyMsg: "You aren't missing any released sprites!",
        },
        unmastered: {
            items, titleL1: 'FORTNITE SPRITES TRACKER:', titleL2: 'UNMASTERED SPRITES',
            color: '#00f0ff', filename: 'fnsprites-unmastered', emptyMsg: "You don't have any unmastered sprites!",
        },
        mastered: {
            items, titleL1: 'FORTNITE SPRITES TRACKER:', titleL2: 'MASTERED SPRITES',
            color: '#ffd700', filename: 'fnsprites-mastered', emptyMsg: "You don't have any mastered sprites!",
        },
        trade: {
            items, titleL1: 'FORTNITE SPRITES TRACKER:', titleL2: 'TRADE CARD',
            color: '#ffd700', filename: 'fnsprites-trade-card', emptyMsg: 'No sprites to export!',
        },
    };

    const config = configs[mode];
    if (!config || config.items.length === 0) {
        toast(config?.emptyMsg || 'Nothing to export!', 'error');
        return null;
    }
    return config;
}

function getExportCardState(sprite, mode) {
    const isOwned = isObtained(sprite.id);
    const mastered = isMastered(sprite.id);

    if (mode === 'trade') return isOwned ? (mastered ? 'mastered' : 'owned') : 'missing_gray';
    if (mode === 'collected') return isOwned ? (mastered ? 'mastered' : 'owned') : 'empty';
    if (mode === 'missing') return !isOwned ? 'missing_color' : 'empty';
    if (mode === 'mastered') return mastered ? 'mastered' : 'empty';
    if (mode === 'unmastered') return isOwned && !mastered ? 'unmastered' : 'empty';
    return 'empty';
}

function loadImage(item) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve({ id: item.id, img, success: true });
        img.onerror = () => resolve({ id: item.id, img, success: false });
        img.src = item.src;
    });
}

function drawCrown(ctx, cx, cy) {
    ctx.save();
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy + 5);
    ctx.lineTo(cx + 7, cy + 5);
    ctx.lineTo(cx + 7, cy - 2);
    ctx.lineTo(cx + 3, cy + 1.5);
    ctx.lineTo(cx, cy - 4.5);
    ctx.lineTo(cx - 3, cy + 1.5);
    ctx.lineTo(cx - 7, cy - 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawMiniCard(ctx, sprite, x, y, w, h, cardState, imageMap) {
    if (cardState === 'empty') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        drawRoundRect(ctx, x, y, w, h, 8);
        ctx.stroke();
        ctx.restore();
        return;
    }

    const rarity = sprite.rarity || 'Rare';
    const theme = sprite.theme || 'Basic';
    const innerH = h - 22; // 100 - 22 = 78

    const isMastered = cardState === 'mastered';
    const isGrayed = cardState === 'missing_gray';
    const isMissing = cardState === 'missing_gray' || cardState === 'missing_color';

    /* Card base background */
    ctx.fillStyle = '#0f141d';
    ctx.beginPath();
    drawRoundRect(ctx, x, y, w, h, 8);
    ctx.fill();

    /* Rarity background */
    ctx.save();
    ctx.beginPath();
    drawRoundRect(ctx, x, y, w, innerH, 8);
    ctx.clip();

    const grad = ctx.createLinearGradient(x, y, x, y + innerH);
    const [c1, c2] = getRarityGradient(rarity, theme);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, innerH);

    /* Special rainbow overlay */
    if (rarity === 'Special') {
        const rainbow = ctx.createLinearGradient(x, y, x + w, y + innerH);
        rainbow.addColorStop(0, 'rgba(81,247,204,0.25)');
        rainbow.addColorStop(0.5, 'rgba(227,116,238,0.35)');
        rainbow.addColorStop(1, 'rgba(181,246,158,0.25)');
        ctx.fillStyle = rainbow;
        ctx.fillRect(x, y, w, innerH);
    }

    /* Highlight shine */
    const shine = ctx.createLinearGradient(x, y, x, y + innerH);
    shine.addColorStop(0, 'rgba(255,255,255,0.12)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    ctx.fillRect(x, y, w, innerH);

    if (isGrayed) {
        ctx.fillStyle = 'rgba(11, 13, 20, 0.45)';
        ctx.fillRect(x, y, w, innerH);
    }
    ctx.restore();

    /* Sprite image */
    const img = imageMap[sprite.id];
    if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, x, y, w, innerH, 8);
        ctx.clip();

        if (isGrayed) {
            try {
                ctx.filter = 'grayscale(100%) brightness(48%)';
            } catch {}
        }
        const maxDim = w * 0.82;
        const ratio = Math.min(maxDim / img.width, maxDim / img.height);
        const nw = img.width * ratio;
        const nh = img.height * ratio;
        ctx.drawImage(img, x + (w - nw) / 2, y + (innerH - nh) / 2, nw, nh);
        ctx.restore();

        if (isGrayed) {
            ctx.fillStyle = 'rgba(15, 20, 30, 0.15)';
            ctx.beginPath();
            drawRoundRect(ctx, x, y, w, innerH, 8);
            ctx.fill();
        }
    }

    /* Status label */
    ctx.save();
    ctx.font = '900 8.5px "Oswald", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 2;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let labelText = 'COLLECTED';
    let labelColor = '#22c55e';
    if (isMastered) {
        labelText = 'MASTERED';
        labelColor = '#ffd700';
    } else if (isMissing) {
        labelText = 'MISSING';
        labelColor = '#ef4444';
    }

    ctx.fillStyle = labelColor;
    ctx.fillText(labelText, x + 5, y + 5);
    ctx.restore();

    /* Rarity tag (angled shape) */
    const [tagBg, tagText] = getRarityTagColors(rarity);
    ctx.save();
    ctx.beginPath();
    drawRoundRect(ctx, x, y, w, innerH, 8);
    ctx.clip();

    if (rarity === 'Special') {
        const tg = ctx.createLinearGradient(x, y + innerH - 12, x + w * 0.6, y + innerH - 12);
        tg.addColorStop(0, '#51f7cc');
        tg.addColorStop(0.5, '#e374ee');
        tg.addColorStop(1, '#b5f69e');
        ctx.fillStyle = tg;
    } else {
        ctx.fillStyle = tagBg;
    }
    ctx.beginPath();
    ctx.moveTo(x, y + innerH - 12);
    ctx.lineTo(x + w * 0.48, y + innerH - 12);
    ctx.lineTo(x + w * 0.58, y + innerH);
    ctx.lineTo(x, y + innerH);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = tagText;
    ctx.font = '900 8.5px "Oswald", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(rarity === 'Mythic' ? 'MYTHIC' : rarity.toUpperCase(), x + 4, y + innerH - 6);

    /* Name/Theme footer */
    ctx.fillStyle = 'rgba(15,20,29,0.9)';
    ctx.fillRect(x, y + innerH, w, 22);

    ctx.fillStyle = isMissing ? '#ef4444' : '#ffffff';
    let fontSize = 14.25;
    const name = sprite.name.toUpperCase();
    ctx.font = `bold ${fontSize}px "Oswald", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    while (ctx.measureText(name).width > w - 6 && fontSize > 9.75) {
        fontSize -= 0.5;
        ctx.font = `bold ${fontSize}px "Oswald", sans-serif`;
    }
    ctx.fillText(name, x + w / 2, y + innerH + 11);

    /* Bottom accent + border */
    let bottomAccentColor = tagBg;
    let borderColor = '#1a2233';
    if (isMastered) {
        bottomAccentColor = '#ffd700';
        borderColor = '#ffd700';
    } else if (isMissing) {
        bottomAccentColor = '#ef4444';
    } else if (cardState === 'unmastered') {
        bottomAccentColor = '#00f0ff';
    }

    ctx.fillStyle = bottomAccentColor;
    ctx.fillRect(x, y + h - 3, w, 3);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = isMastered ? 2 : 1;
    ctx.beginPath();
    drawRoundRect(ctx, x, y, w, h, 8);
    ctx.stroke();

    /* Crown at top center */
    if (isMastered) {
        drawCrown(ctx, x + w / 2, y - 2);
    }
}

/* ===================================================
   Canvas Export - Status Icons & Trade Card Exporter
   =================================================== */

function drawRoundRect(ctx, x, y, width, height, radius) {
    if (ctx.roundRect) {
        ctx.roundRect(x, y, width, height, radius);
    } else {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

function exportImage(mode) {
    const config = getExportConfig(mode);
    if (!config) return;

    const releasedSprites = getReleasedSprites();
    const imagesToLoad = [
        { id: 'mascot', src: 'siteimages/staticsprite.png' },
        ...releasedSprites.map(sprite => ({ id: sprite.id, src: `sprites/${encodeURIComponent(sprite.id)}.png` })),
    ];

    toast('Generating image export...', 'info');

    Promise.all(imagesToLoad.map(loadImage)).then(loadedImages => {
        const imageMap = {};
        loadedImages.forEach(res => {
            if (res.success) {
                imageMap[res.id] = res.img;
            }
        });

        const layout = EXPORT_LAYOUT;
        let canvasW, canvasH, headerH, useCompactHeader;
        let cols = 0, rows = 0, startGridY = 0, gridWidth = 0;

        // Trade Card Layout Variables
        let charKeys, familyThemeMap, themeColumns, leftColumnKeys, rightColumnKeys, tableColumnCount, colW, tableW;

        if (mode === 'trade') {
            charKeys = getFamilyKeys(releasedSprites);
            familyThemeMap = getFamilyThemeMap(releasedSprites);
            themeColumns = getActiveThemes(releasedSprites).map(theme => ({
                name: getExportThemeLabel(theme),
                themeName: theme,
            }));

            const activeCharKeys = charKeys.filter(charKey => {
                return [...familyThemeMap.get(charKey).values()]
                    .some(sprite => getExportCardState(sprite, mode) !== 'empty');
            });

            themeColumns = themeColumns.filter(t => {
                return activeCharKeys.some(charKey => {
                    const sprite = familyThemeMap.get(charKey).get(t.themeName);
                    return sprite && getExportCardState(sprite, mode) !== 'empty';
                });
            });

            tableColumnCount = activeCharKeys.length > layout.maxSingleColumnRows ? 2 : 1;
            const half = tableColumnCount === 1 ? activeCharKeys.length : Math.ceil(activeCharKeys.length / 2);
            leftColumnKeys = activeCharKeys.slice(0, half);
            rightColumnKeys = activeCharKeys.slice(half);

            const maxRows = Math.max(leftColumnKeys.length, rightColumnKeys.length);
            const rowH = layout.cardH + layout.rowGap;
            const rowsH = maxRows * rowH;
            const cardBlockW = themeColumns.length * layout.cardW + Math.max(0, themeColumns.length - 1) * layout.cardGap;
            colW = layout.labelW + cardBlockW;
            tableW = colW * tableColumnCount + layout.colGap * Math.max(0, tableColumnCount - 1);
            canvasW = Math.max(layout.minCanvasW, tableW + layout.border * 2 + layout.sidePad * 2);
            useCompactHeader = canvasW < layout.compactHeaderW;
            headerH = useCompactHeader ? layout.compactHeaderH : layout.headerH;
            canvasH = layout.border * 2 + headerH + layout.colHeaderH + rowsH + layout.footerH;
        } else {
            // Square-optimized Compact Layout for non-trade cards
            const totalItems = config.items.length;
            const cardAspect = (layout.cardW + layout.cardGap) / (layout.cardH + layout.rowGap);

            // Compute ideal column count to make overall layout aspect ratio as close to 1:1 as possible
            cols = Math.max(1, Math.round(Math.sqrt(totalItems / cardAspect)));
            rows = Math.ceil(totalItems / cols);

            gridWidth = cols * layout.cardW + (cols - 1) * layout.cardGap;
            const gridHeight = rows * layout.cardH + (rows - 1) * layout.rowGap;

            canvasW = Math.max(layout.minCanvasW, gridWidth + layout.border * 2 + layout.sidePad * 2);
            useCompactHeader = canvasW < layout.compactHeaderW;
            headerH = useCompactHeader ? layout.compactHeaderH : layout.headerH;
            
            canvasH = layout.border * 2 + headerH + layout.sidePad + gridHeight + layout.sidePad + layout.footerH;
            startGridY = layout.border + headerH + layout.sidePad;
        }

        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = canvasW * scale;
        canvas.height = canvasH * scale;

        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Border gradient
        let borderGrad;
        if (mode === 'trade') {
            borderGrad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
            borderGrad.addColorStop(0, '#ffd700');
            borderGrad.addColorStop(1, '#22c55e');
            ctx.fillStyle = borderGrad;
        } else {
            ctx.fillStyle = config.color;
            borderGrad = config.color;
        }
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Inner Background
        ctx.fillStyle = '#0b0d13';
        ctx.fillRect(layout.border, layout.border, canvasW - layout.border * 2, canvasH - layout.border * 2);

        // Header Background
        ctx.fillStyle = '#181c25';
        ctx.fillRect(layout.border, layout.border, canvasW - layout.border * 2, headerH);

        // Header separator
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(layout.border, layout.border + headerH);
        ctx.lineTo(canvasW - layout.border, layout.border + headerH);
        ctx.stroke();

        // Header Stats / Progress Bars
        const { total: totalCount, collected: ownedCount, mastered: masteredCount } = getCollectionCounts(releasedSprites);
        const colPct = totalCount > 0 ? ownedCount / totalCount : 0;
        const masPct = totalCount > 0 ? masteredCount / totalCount : 0;

        const bw = 110;
        const statGap = 25;
        const mascotImg = imageMap['mascot'];
        const fullTitle = `${config.titleL1} ${config.titleL2}`;

        const fitFont = (text, maxWidth, startSize, minSize, style) => {
            let size = startSize;
            ctx.font = `${style} ${size}px "Oswald", sans-serif`;
            while (ctx.measureText(text).width > maxWidth && size > minSize) {
                size -= 0.5;
                ctx.font = `${style} ${size}px "Oswald", sans-serif`;
            }
            return size;
        };

        const drawProgressBlock = (label, count, total, pct, x, y, color) => {
            ctx.font = '900 12px "Oswald", sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = color;
            ctx.fillText(`${label}: ${count}/${total}`, x, y);
            ctx.fillStyle = '#0e1117';
            ctx.fillRect(x, y + 15, bw, 12);
            ctx.strokeStyle = '#3b4253';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y + 15, bw, 12);
            ctx.fillStyle = color;
            ctx.fillRect(x, y + 16, bw * pct, 10);
        };

if (useCompactHeader) {
            const topY = layout.border + 24;
            const mascotSize = 24;
            const mascotGap = mascotImg ? 8 : 0;
            fitFont(config.titleL1, canvasW - layout.border * 2 - 60, 14, 10, 'italic 900');
            const titleL1W = ctx.measureText(config.titleL1).width;
            const titleGroupW = titleL1W + (mascotImg ? mascotSize + mascotGap : 0);
            let groupX = (canvasW - titleGroupW) / 2;
            if (mascotImg) {
                ctx.drawImage(mascotImg, groupX, topY - mascotSize / 2, mascotSize, mascotSize);
                groupX += mascotSize + mascotGap;
            }
            ctx.fillStyle = borderGrad;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(config.titleL1, groupX, topY);

            fitFont(config.titleL2, canvasW - layout.border * 2 - 36, 20, 13, 'italic 900');
            ctx.fillStyle = borderGrad;
            ctx.textAlign = 'center';
            ctx.fillText(config.titleL2, canvasW / 2, layout.border + 52);

            if (mode === 'trade') {
                const statsW = bw * 2 + statGap;
                const statsX = (canvasW - statsW) / 2;
                const statsY = layout.border + 86;
                drawProgressBlock('COLLECTION', ownedCount, totalCount, colPct, statsX, statsY, '#22c55e');
                drawProgressBlock('MASTERY', masteredCount, totalCount, masPct, statsX + bw + statGap, statsY, '#ffd700');
            }
        } else {
            const statsRight = canvasW - layout.border - layout.sidePad;
            const collectionX = statsRight - bw * 2 - statGap;
            const masteryX = statsRight - bw;
            const titleX = layout.border + layout.sidePad;
            const mascotSize = 32;
            const mascotGap = mascotImg ? 10 : 0;
            const titleMaxW = (mode === 'trade') ? (collectionX - titleX - 20) : (canvasW - titleX - layout.border - layout.sidePad);

            fitFont(fullTitle, titleMaxW - (mascotImg ? mascotSize + mascotGap : 0), 26, 16, 'italic 900');
            ctx.fillStyle = borderGrad;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            let textLeft = titleX;
            if (mascotImg) {
                ctx.drawImage(mascotImg, textLeft, layout.border + headerH / 2 - mascotSize / 2, mascotSize, mascotSize);
                textLeft += mascotSize + mascotGap;
            }
            ctx.fillText(fullTitle, textLeft, layout.border + headerH / 2);

            if (mode === 'trade') {
                drawProgressBlock('COLLECTION', ownedCount, totalCount, colPct, collectionX, layout.border + 28, '#22c55e');
                drawProgressBlock('MASTERY', masteredCount, totalCount, masPct, masteryX, layout.border + 28, '#ffd700');
            }
        }

        if (mode === 'trade') {
            const startTableY = layout.border + headerH + layout.colHeaderH;

            const drawColHeaders = (startX) => {
                ctx.fillStyle = '#8891a5';
                ctx.font = 'bold 12px "Oswald", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                themeColumns.forEach((t, i) => {
                    const cx = startX + layout.labelW + i * (layout.cardW + layout.cardGap) + layout.cardW / 2;
                    ctx.fillText(t.name, cx, startTableY - 8);
                });
            };

            const leftTableX = layout.border + (canvasW - layout.border * 2 - tableW) / 2;
            const rightTableX = leftTableX + colW + layout.colGap;

            drawColHeaders(leftTableX);
            if (rightColumnKeys.length > 0) {
                drawColHeaders(rightTableX);
            }

            const drawRow = (charKey, startX, y) => {
                const name = getCharName(charKey);
                const displayName = getDisplayName(name);

                ctx.fillStyle = '#ffffff';
                let fontSize = 14;
                ctx.font = `bold ${fontSize}px "Oswald", sans-serif`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                while (ctx.measureText(displayName).width > layout.labelW - 12 && fontSize > 8) {
                    fontSize -= 0.5;
                    ctx.font = `bold ${fontSize}px "Oswald", sans-serif`;
                }
                ctx.fillText(displayName, startX + layout.labelW - 10, y + layout.cardH / 2);

                const rowCards = themeColumns.map(t => familyThemeMap.get(charKey).get(t.themeName));

                rowCards.forEach((s, colIndex) => {
                    const cx = startX + layout.labelW + colIndex * (layout.cardW + layout.cardGap);

                    if (s) {
                        const cardState = getExportCardState(s, mode);
                        drawMiniCard(ctx, s, cx, y, layout.cardW, layout.cardH, cardState, imageMap);
                    } else {
                        ctx.save();
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([4, 4]);
                        ctx.beginPath();
                        drawRoundRect(ctx, cx, y, layout.cardW, layout.cardH, 8);
                        ctx.stroke();
                        ctx.restore();
                    }
                });
            };

            leftColumnKeys.forEach((charKey, idx) => {
                const y = startTableY + idx * (layout.cardH + layout.rowGap);
                drawRow(charKey, leftTableX, y);
            });

            rightColumnKeys.forEach((charKey, idx) => {
                const y = startTableY + idx * (layout.cardH + layout.rowGap);
                drawRow(charKey, rightTableX, y);
            });
        } else {
            // Render non-trade compact grid
            const startGridX = (canvasW - gridWidth) / 2;

            config.items.forEach((sprite, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);

                const x = startGridX + col * (layout.cardW + layout.cardGap);
                const y = startGridY + row * (layout.cardH + layout.rowGap);

                const cardState = getExportCardState(sprite, mode);
                drawMiniCard(ctx, sprite, x, y, layout.cardW, layout.cardH, cardState, imageMap);
            });
        }

        // Footer
        ctx.fillStyle = '#0e1117';
        ctx.fillRect(layout.border, canvasH - layout.footerH - layout.border, canvasW - layout.border * 2, layout.footerH);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Oswald", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('staticvacant.github.io/fnsprites/', canvasW / 2, canvasH - layout.border - layout.footerH / 2);

        // Export mode
        const shouldOpenInNewTab = isIOS() || state.settings.openExports;
        
        if (shouldOpenInNewTab) {
            canvas.toBlob((blob) => {
                if (!blob) {
                    toast('Failed to generate image', 'error');
                    return;
                }
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                toast('Image opened in new tab!', 'success');
            }, 'image/png');
        } else {
            const link = document.createElement('a');
            link.download = `${config.filename}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast('Image exported successfully!', 'success');
        }
    });
}

/* ===================================================
   Trade Text Generation
   =================================================== */

function generateTradeText() {
    const releasedSprites = getReleasedSprites();
    const charKeys = getFamilyKeys(releasedSprites);
    const familyThemeMap = getFamilyThemeMap(releasedSprites);
    const { total, collected, mastered } = getCollectionCounts(releasedSprites);

    const buildSection = (title, selectSprites) => {
        const lines = [];

        charKeys.forEach(charKey => {
            const name = getCharName(charKey);
            const themeSprites = [...familyThemeMap.get(charKey).values()];
            const selected = selectSprites(themeSprites);
            if (selected.length === 0) return;

            const list = selected.map(sprite => getTradeThemeLabel(sprite.theme)).join(', ');
            lines.push(`  ▸ ${name} ➔ ${list}`);
        });

        return lines.length > 0 ? `【 ${title} 】\n${lines.join('\n')}` : '';
    };

    const sections = [
        buildSection('LOOKING FOR', sprites => sprites.filter(sprite => !isObtained(sprite.id))),
        buildSection('HAVE', sprites => sprites.filter(sprite => isObtained(sprite.id))),
        buildSection('STILL NEED TO MASTER', sprites => sprites.filter(sprite => isObtained(sprite.id) && !isMastered(sprite.id))),
        [
            `Collected: ${collected}/${total}`,
            `Mastered: ${mastered}/${total}`,
            `Track yours: ${TRACKER_URL}`,
        ].join('\n'),
    ].filter(Boolean);

    return sections.join('\n\n');
}

function generateTradeGridText() {
    const releasedSprites = getReleasedSprites();
    const activeThemes = getActiveThemes(releasedSprites);
    const charKeys = getFamilyKeys(releasedSprites);
    const familyThemeMap = getFamilyThemeMap(releasedSprites);
    const { total, collected, mastered } = getCollectionCounts(releasedSprites);

    let lines = [
        '```',
        '✅ Owned  👑 Mastered  ❌ Missing',
        '',
        `| ${activeThemes.map(getExportThemeLabel).join(' | ')} | Sprite`,
        '-----------------------',
    ];

    charKeys.forEach(charKey => {
        const rowStates = activeThemes.map(theme => {
            const s = familyThemeMap.get(charKey).get(theme);
            if (!s) return '⬛';
            if (isMastered(s.id)) return '👑';
            return isObtained(s.id) ? '✅' : '❌';
        });

        lines.push(`| ${rowStates.join(' | ')} | ${getCharName(charKey)}`);
    });

    lines.push(
        '',
        `Collected: ${collected}/${total}`,
        `Mastered: ${mastered}/${total}`,
        `Track yours: ${TRACKER_URL}`,
        '```'
    );

    return lines.join('\n');
}

function setDropdownOpen(dropdown, toggle, open) {
    dropdown.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
}

function closeDropdowns() {
    setDropdownOpen(dom.exportDropdown, dom.exportToggle, false);
    setDropdownOpen(dom.copyDropdown, dom.copyToggle, false);
}

function copyText(text, successMsg, errorMsg) {
    if (!navigator.clipboard?.writeText) {
        toast(errorMsg, 'error');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        toast(successMsg, 'success');
    }).catch(() => {
        toast(errorMsg, 'error');
    });
}

/* ===================================================
   Event Binding
   =================================================== */

function bindEvents() {
    /* Image error delegation (using capture phase since error does not bubble) */
    dom.grid.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.style.opacity = '0.2';
        }
    }, true);

    /* Grid - event delegation */
    dom.grid.addEventListener('click', (e) => {
        if (state.viewMode) return;
        const crown = e.target.closest('.card-crown');
        const card = e.target.closest('.card');
        if (!card) return;

        const id = card.dataset.id;
        if (crown) {
            e.stopPropagation();
            toggleMastery(id);
        } else {
            toggleObtained(id);
        }
    });

    dom.grid.addEventListener('keydown', (e) => {
        if (state.viewMode || e.target.closest('.card-crown')) return;
        if (e.key !== 'Enter' && e.key !== ' ') return;

        const card = e.target.closest('.card');
        if (!card) return;

        e.preventDefault();
        toggleObtained(card.dataset.id);
    });

    /* Search */
    dom.searchInput.addEventListener('input', () => {
        state.filters.search = dom.searchInput.value;
        persist(KEYS.search, state.filters.search);
        renderGrid();
    });

    /* Theme filter */
    dom.themeFilter.addEventListener('change', () => {
        state.filters.theme = dom.themeFilter.value;
        persist(KEYS.theme, state.filters.theme);
        renderGrid();
    });

    /* Season filter */
    dom.seasonFilter.addEventListener('change', () => {
        state.filters.season = dom.seasonFilter.value;
        persist(KEYS.season, state.filters.season);
        renderGrid();
    });

   
    /* Sort order dropdown */
    dom.sortOrder.addEventListener('change', () => {
        state.settings.sortOrder = dom.sortOrder.value;
        persist(KEYS.sortOrder, state.settings.sortOrder);
        renderGrid();
    });

    /* Status pills */
    dom.statusPills.addEventListener('click', (e) => {
        const pill = e.target.closest('.pill');
        if (!pill || state.viewMode) return;
        state.filters.status = pill.dataset.status;
        persist(KEYS.status, state.filters.status);
        applyStateToDOM();
        renderGrid();
    });

    /* Toggle switches */
    const switchKeys = ['hideMastered', 'showUnreleased', 'lowFidelity', 'openExports'];
    switchKeys.forEach(key => {
        dom[key].addEventListener('change', () => {
            if (key === 'openExports') {
                state.settings.openExports = !dom.openExports.checked;
                persist(KEYS.openExports, state.settings.openExports);
                applyStateToDOM();
            } else {
                state.settings[key] = dom[key].checked;
                persist(KEYS[key], state.settings[key]);
                if (key === 'lowFidelity') {
                    document.body.classList.toggle('low-fidelity', dom[key].checked);
                }
                renderGrid();
            }
        });
    });

    /* Export dropdown */
    dom.exportToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setDropdownOpen(dom.copyDropdown, dom.copyToggle, false);
        setDropdownOpen(dom.exportDropdown, dom.exportToggle, !dom.exportDropdown.classList.contains('open'));
    });

    dom.exportDropdown.querySelectorAll('[data-export]').forEach(btn => {
        btn.addEventListener('click', () => {
            exportImage(btn.dataset.export);
            setDropdownOpen(dom.exportDropdown, dom.exportToggle, false);
        });
    });

    /* Copy dropdown */
    dom.copyToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setDropdownOpen(dom.exportDropdown, dom.exportToggle, false);
        setDropdownOpen(dom.copyDropdown, dom.copyToggle, !dom.copyDropdown.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
        if (!dom.exportDropdown.contains(e.target)) {
            setDropdownOpen(dom.exportDropdown, dom.exportToggle, false);
        }
        if (!dom.copyDropdown.contains(e.target)) {
            setDropdownOpen(dom.copyDropdown, dom.copyToggle, false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDropdowns();
    });

    /* Backup Export */
    dom.exportBackupBtn.addEventListener('click', () => {
        const data = {
            obtained: state.obtained,
            mastered: state.mastered
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'fnsprites-backup.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast('Backup file exported!', 'success');
        setDropdownOpen(dom.exportDropdown, dom.exportToggle, false);
    });

    /* Backup Import */
    dom.importBtn.addEventListener('click', () => {
        if (state.viewMode) {
            toast('Cannot import in view-only mode!', 'error');
            return;
        }
        dom.importInput.click();
    });

    dom.importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!data || !Array.isArray(data.obtained) || !Array.isArray(data.mastered)) {
                    throw new Error('Invalid backup file format');
                }

                const validIds = getSpriteIdSet();
                const obtained = uniqueValidIds(data.obtained, validIds);
                const obtainedIds = new Set(obtained);
                const mastered = uniqueValidIds(data.mastered, validIds)
                    .filter(id => obtainedIds.has(id));

                state.obtained = obtained;
                state.mastered = mastered;

                saveCollection();

                renderGrid();
                toast('Collection imported successfully!', 'success');
            } catch (err) {
                toast('Failed to import: invalid JSON format', 'error');
                console.error(err);
            }
            dom.importInput.value = '';
        };
        reader.readAsText(file);
    });

    /* Copy trade list */
    dom.copyTradeTextBtn.addEventListener('click', () => {
        copyText(generateTradeText(), 'Trade list copied to clipboard!', 'Failed to copy trade list');
        setDropdownOpen(dom.copyDropdown, dom.copyToggle, false);
    });

    /* Copy trade grid */
    dom.copyTradeGridBtn.addEventListener('click', () => {
        copyText(generateTradeGridText(), 'Trade grid copied to clipboard!', 'Failed to copy trade grid');
        setDropdownOpen(dom.copyDropdown, dom.copyToggle, false);
    });

    /* Share */
    dom.shareBtn.addEventListener('click', () => {
        const code = compressCollection(baseSprites, state.obtained, state.mastered);
        const url = `${location.origin}${location.pathname}?c=${code}`;
        copyText(url, 'Share link copied to clipboard!', 'Failed to copy link');
    });
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

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Prevent scrolling or zooming on mobile Safari/Chrome
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
}

// Attach listener when DOM content loads
document.addEventListener('DOMContentLoaded', () => {
    const supportBtn = document.getElementById('supportCodeBtn');
    if (supportBtn) {
        supportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            copySupportCode(supportBtn);
        });
    }
});

/* ===================================================
   Initialization
   =================================================== */

function init() {
    if (typeof baseSprites === 'undefined') {
        console.error('baseSprites is not defined.');
        return;
    }

    const params = new URLSearchParams(location.search);
    const shareCode = params.get('c');

    if (shareCode) {
        state.viewMode = true;
        const decoded = decompressCollection(baseSprites, shareCode);
        state.obtained = decoded.obtained;
        state.mastered = decoded.mastered;
        dom.viewBanner.hidden = false;
    } else {
        load();
    }

    populateThemeFilter();
    applyStateToDOM();
    renderGrid();
    bindEvents();
    checkUnredeemedCodes();
}

init();

