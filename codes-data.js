// display strings
const codeCategories = {
    cat1: "Sprites",
    cat2: "Loading Screens & Locker Items",
    cat3: "Consumable Resources",
    cat4: "Fun Effects",
    cat5: "Miscellaneous"
};

// category ordering
const CATEGORY_ORDER = ["cat1", "cat2", "cat3", "cat4"];

// code data sheet
const baseCodes = [
    // --- cat1
    { code: "Born2Play", reward: "Cheat Master Adventure Sprite", internalreward: "adventure_cheat", category: "cat1", source: "Nintendo of America", link: "https://x.com/NintendoAmerica/status/2089396842798669841", active: true },
    { code: "8BitBlast", reward: "Cheat Master 8-Bit Sprite", internalreward: "8bit_cheat", category: "cat1", source: "Xbox", link: "https://x.com/XBOX/status/2089034524046897618", active: true },
    { code: "GottaGoFast", reward: "Cheat Master Sonic Sprite", internalreward: "sonic_cheat", category: "cat1", source: "Fortnite Discord", link: "https://x.com/FireMonkey/status/2086832948829901078", active: true },
    { code: "IWannaFlyHigh", reward: "Cheat Master Tails Sprite", internalreward: "tails_cheat", category: "cat1", source: "Fortnite Discord", link: "", active: true },

    // --- cat2
    { code: "BeMoreAlien", reward: "Override Ready Loading Screen", internalreward: null, category: "cat2", source: "AlienWare", link: "https://x.com/Alienware/status/2089429140709556283", active: true },
    { code: "ReachYourImpossible", reward: "Block Party Loading Screen", internalreward: null, category: "cat2", source: "Unknown", link: "", active: true },

    // --- cat3
    { code: "OverrideXP", reward: "40,000 XP", internalreward: null, category: "cat3", source: "Fortnite", link: "https://x.com/Fortnite/status/2088702226705567916", active: true },
    { code: "Magilume", reward: "2,000 Sprite Dust", internalreward: null, category: "cat3", source: "Fortnite Brazil", link: "https://x.com/Brasil_Fortnite", active: true },
    { code: "Chispambo", reward: "2,000 Sprite Dust", internalreward: null, category: "cat3", source: "Fortnite Spain", link: "https://x.com/Fortnite_ES/status/2089389318687297587", active: true },
    { code: "Abgestaubt", reward: "2,000 Sprite Dust", internalreward: null, category: "cat3", source: "Fortnite German", link: "https://x.com/FortniteDE/status/2089677733353926697", active: true },
    { code: "PerlimPinPin", reward: "2,000 Sprite Dust", internalreward: null, category: "cat3", source: "Fortnite France", link: "", active: true },
    { code: "SurviveTheNight", reward: "2 Cheat Code Locators", internalreward: null, category: "cat3", source: "Grandma's Favourite Studio", link: "https://x.com/grandmasfaves/status/2087162231230443856", active: true },
    { code: "TakeYourHeart", reward: "2 Extraction Accelerators", internalreward: null, category: "cat3", source: "ATLUS West", link: "https://x.com/Atlus_West/status/2087932899559412182", active: true },
    { code: "PerfectOrder", reward: "4 Spicy Tacos", internalreward: null, category: "cat3", source: "Fortnite Discord", link: "https://x.com/FireMonkey/status/2086838594920972718", active: true },
    { code: "O2Override", reward: "1 Llama Supply Drop & 1 Portable Extractor", internalreward: null, category: "cat3", source: "O2", link: "https://x.com/FireMonkey/status/2088224016565780563", active: true },

    // --- cat4
    { code: "DontBlockMe", reward: "Turns you into a Tetrimino.", internalreward: null, category: "cat4", source: "Fortnite Discord", link: "", active: true },
    { code: "LetsBlockAndRoll", reward: "Turns you into a Tetrimino.", internalreward: null, category: "cat4", source: "Fortnite Discord", link: "", active: true },
    
    // --- cat5
    { code: "Looper1", reward: "Unknown", internalreward: null, category: "cat5", source: "Fortnite Twitter", link: "", active: true },
    { code: "fishstick1", reward: "Unknown", internalreward: null, category: "cat5", source: "Fortnite Twitter", link: "", active: true }
];
