// display strings
const codeCategories = {
    cat1: "Sprites",
    cat2: "Loading Screens & Locker Items",
    cat3: "Consumable Resources",
    cat4: "Fun Effects",
    cat5: "Miscellaneous"
};

// category ordering
const CATEGORY_ORDER = ["cat1", "cat2", "cat3", "cat4", "cat5"];

// code data sheet
const baseCodes = [
    // --- cat1
    { code: "Born2Play", reward: "Cheat Master Adventure Sprite", internalreward: "adventure_cheat", category: "cat1", active: true },
    { code: "8BitBlast", reward: "Cheat Master 8-Bit Sprite", internalreward: "8bit_cheat", category: "cat1", active: true },
    { code: "GottaGoFast", reward: "Cheat Master Sonic Sprite", internalreward: "sonic_cheat", category: "cat1", active: true },
    { code: "IWannaFlyHigh", reward: "Cheat Master Tails Sprite", internalreward: "tails_cheat", category: "cat1", active: true },
    { code: "Play4All", reward: "Cheat Master Jonesy Sprite", internalreward: "jonesy_cheat", category: "cat1", active: true },

    // --- cat2
    { code: "BeMoreAlien", reward: "Override Ready Loading Screen", internalreward: null, category: "cat2", active: true },
    { code: "ReachYourImpossible", reward: "Block Party Loading Screen", internalreward: null, category: "cat2", active: true },

    // --- cat3
    { code: "OverrideXP", reward: "40,000 XP", internalreward: null, category: "cat3", active: true },
    { code: "Magilume", reward: "2,000 Sprite Dust", internalreward: null, category: "cat3", active: true },
    { code: "Chispambo", reward: "2,000 Sprite Dust", internalreward: null, category: "cat3", active: true },
    { code: "Abgestaubt", reward: "2,000 Sprite Dust", internalreward: null, category: "cat3", active: true },
    { code: "PerlimPinPin", reward: "2,000 Sprite Dust", internalreward: null, category: "cat3", active: true },
    { code: "SurviveTheNight", reward: "2 Cheat Code Locators", internalreward: null, category: "cat3", active: true },
    { code: "FindItChat", reward: "2 Cheat Code Locators", internalreward: null, category: "cat3", active: true },
    { code: "TakeYourHeart", reward: "2 Extraction Accelerators", internalreward: null, category: "cat3", active: true },
    { code: "PerfectOrder", reward: "4 Spicy Tacos", internalreward: null, category: "cat3", active: true },
    { code: "O2Override", reward: "1 Llama Supply Drop & 1 Portable Extractor", internalreward: null, category: "cat3", active: true },

    // --- cat4
    { code: "DontBlockMe", reward: "Turns you into a Tetrimino.", internalreward: null, category: "cat4", active: true },
    { code: "LetsBlockAndRoll", reward: "Turns you into a Tetrimino.", internalreward: null, category: "cat4", active: true }
    
    // --- cat5
    //{ code: "Looper1", reward: "Unknown", internalreward: null, category: "cat5", active: false },
    //{ code: "fishstick1", reward: "Unknown", internalreward: null, category: "cat5", active: false }
];
