(function () {
    const NEW_SITE_URL = 'https://rickventure.com/';
    const OBTAINED_KEY = 'fn_obtained_sprites';
    const MASTERED_KEY = 'fn_mastered_sprites';
    const DISMISSED_KEY = 'fn_migration_dismissed';
    const RENAG_DAYS = 7;

    function getStoredArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    }

    function buildPayload() {
        return {
            obtained: getStoredArray(OBTAINED_KEY),
            mastered: getStoredArray(MASTERED_KEY),
        };
    }

    function encodePayload(payload) {
        const json = JSON.stringify(payload);
        return btoa(unescape(encodeURIComponent(json)));
    }

    function goToNewSite() {
        const encoded = encodePayload(buildPayload());
        window.location.href = `${NEW_SITE_URL}?import=${encodeURIComponent(encoded)}`;
    }

    function exportBackup() {
        const blob = new Blob([JSON.stringify(buildPayload(), null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'fnsprites-backup.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }

    function dismiss(overlay) {
        try {
            localStorage.setItem(DISMISSED_KEY, String(Date.now()));
        } catch {
            /* ignore storage errors, just close the box */
        }
        overlay.remove();
    }

    function shouldShow() {
        try {
            const stamp = localStorage.getItem(DISMISSED_KEY);
            if (!stamp) return true;
            const daysSince = (Date.now() - Number(stamp)) / (1000 * 60 * 60 * 24);
            return daysSince > RENAG_DAYS;
        } catch {
            return true;
        }
    }

    function buildOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'migration-overlay';
        overlay.innerHTML = `
            <div class="migration-modal" role="dialog" aria-modal="true" aria-labelledby="migrationTitle">
                <h2 id="migrationTitle">This tracker has moved!</h2>
                <p>Rick's Tracker now lives at <strong>rickventure.com</strong>. Move over now and your collected &amp; mastered sprites will come with you automatically.</p>
                <div class="migration-actions">
                    <button type="button" class="btn btn-accent" id="migrationGoBtn">Move me &amp; my data</button>
                    <button type="button" class="btn" id="migrationExportBtn">Just export my data</button>
                    <button type="button" class="btn" id="migrationDismissBtn">Stay on this site</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#migrationGoBtn').addEventListener('click', goToNewSite);
        overlay.querySelector('#migrationExportBtn').addEventListener('click', exportBackup);
        overlay.querySelector('#migrationDismissBtn').addEventListener('click', () => dismiss(overlay));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) dismiss(overlay);
        });
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                dismiss(overlay);
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (shouldShow()) buildOverlay();
    });
})();
