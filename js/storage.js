// ============ DATA STORAGE ============

const STORAGE_KEY = 'playbook2026';
const SETTINGS_KEY = 'playbook2026_settings';
const START_WEIGHT = 109;
const GOAL_WEIGHT = 89.9;
const GOAL_DATE = new Date('2026-12-23');
const START_DATE = new Date('2026-01-01');

// Quarter Goals
const QUARTER_GOALS = [
    { label: 'Q1 (31. März)', target: 99.5, date: new Date('2026-03-31') },
    { label: 'Q2 (30. Juni)', target: 95.5, date: new Date('2026-06-30') },
    { label: 'Q3 (30. Sept)', target: 92.5, date: new Date('2026-09-30') },
    { label: 'Q4 (23. Dez)', target: 89.9, date: new Date('2026-12-23') }
];

// Workout definitions
const WORKOUTS = {
    A: {
        name: 'Tag A: Laufen',
        badge: 'day-a',
        details: 'Ausdauertraining - Laufen oder Indoor-Alternative'
    },
    B1: {
        name: 'B1: Push',
        badge: 'day-b',
        details: 'Brust, Schultern, Trizeps + Boxsack Finisher'
    },
    B2: {
        name: 'B2: Pull',
        badge: 'day-b',
        details: 'Rücken, Bizeps + Plank Finisher'
    },
    B3: {
        name: 'B3: Legs + Core',
        badge: 'day-b',
        details: 'Beine, Gesäß, Rumpf + Boxsack Kicks'
    },
    CHEAT: {
        name: 'Cheat Day',
        badge: 'cheat',
        details: 'Ruhetag - Training optional, Ernährung frei'
    }
};

// Activity Levels
const ACTIVITY_LEVELS = {
    sedentary: { key: 'sedentary', label: 'Wenig aktiv', pal: 1.2, proteinFactor: 1.0 },
    moderate: { key: 'moderate', label: 'Moderat aktiv', pal: 1.5, proteinFactor: 1.5 },
    active: { key: 'active', label: 'Sehr aktiv', pal: 1.8, proteinFactor: 1.8 },
    athletic: { key: 'athletic', label: 'Athletisch', pal: 2.2, proteinFactor: 2.2 }
};

// Default User Settings
const DEFAULT_SETTINGS = {
    height: 183,
    age: 26,
    gender: 'male',
    activity: 'moderate'
};

// ============ STORAGE ABSTRACTION ============

// Cache for data (used for synchronous access)
let dataCache = null;
let settingsCache = null;
let isElectron = false;
let storageReady = false;

// Check if running in Electron
function checkElectron() {
    isElectron = !!(window.electronStore && window.electronStore.isElectron);
    return isElectron;
}

// Initialize storage - loads data from file or localStorage
async function initStorage() {
    checkElectron();

    if (isElectron) {
        // Load from electron-store (file-based)
        try {
            dataCache = await window.electronStore.get(STORAGE_KEY);
            settingsCache = await window.electronStore.get(SETTINGS_KEY);

            // Show storage path in console for user info
            const storagePath = await window.electronStore.getPath();
            console.log('📁 Daten gespeichert in:', storagePath);
        } catch (e) {
            console.error('Fehler beim Laden der Daten:', e);
        }
    } else {
        // Load from localStorage (browser)
        const data = localStorage.getItem(STORAGE_KEY);
        const settings = localStorage.getItem(SETTINGS_KEY);
        dataCache = data ? JSON.parse(data) : null;
        settingsCache = settings ? JSON.parse(settings) : null;
    }

    // Initialize with defaults if needed
    if (!dataCache) {
        dataCache = { entries: {}, startWeight: START_WEIGHT, bRotation: 0 };
    }
    if (!settingsCache) {
        settingsCache = { ...DEFAULT_SETTINGS };
    }

    storageReady = true;
    return true;
}

// ============ DATA FUNCTIONS ============

function getData() {
    if (!storageReady) {
        // Fallback to localStorage if not yet initialized
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { entries: {}, startWeight: START_WEIGHT, bRotation: 0 };
    }
    return dataCache || { entries: {}, startWeight: START_WEIGHT, bRotation: 0 };
}

function saveData(data) {
    // Update cache
    dataCache = data;

    if (isElectron) {
        // Save to electron-store (async, but we don't wait)
        window.electronStore.set(STORAGE_KEY, data);
    } else {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
}

// Settings-specific functions (used by settings.js)
function getSettingsData() {
    if (!storageReady) {
        const settings = localStorage.getItem(SETTINGS_KEY);
        return settings ? JSON.parse(settings) : { ...DEFAULT_SETTINGS };
    }
    return settingsCache || { ...DEFAULT_SETTINGS };
}

function saveSettingsData(settings) {
    // Update cache
    settingsCache = settings;

    if (isElectron) {
        window.electronStore.set(SETTINGS_KEY, settings);
    } else {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
}

// ============ HELPER FUNCTIONS ============

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function parseDate(str) {
    return new Date(str + 'T00:00:00');
}

function getDayName(date) {
    return ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][date.getDay()];
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getMonthStart(date) {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ============ WEIGHT FUNCTIONS ============

function getLatestWeight() {
    const data = getData();
    const entries = data.entries;
    const sortedDates = Object.keys(entries).sort().reverse();

    for (const date of sortedDates) {
        if (entries[date].weight) {
            return entries[date].weight;
        }
    }
    return null;
}

// ============ WORKOUT CALCULATION ============

function getTodayWorkout() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 6) {
        return 'CHEAT';
    }

    const data = getData();

    let dayCount = 0;
    const startDate = new Date(START_DATE);
    const currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    for (let d = new Date(startDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 6) {
            dayCount++;
        }
    }

    const isADay = dayCount % 2 === 1;

    if (isADay) {
        return 'A';
    } else {
        const bRotation = data.bRotation || 0;
        const bWorkouts = ['B1', 'B2', 'B3'];
        return bWorkouts[bRotation % 3];
    }
}

function getWorkoutTypeForDate(date) {
    const startDate = new Date('2026-01-01');
    if (date.getDay() === 6) return 'CHEAT';

    let dayCount = 0;
    for (let d = new Date(startDate); d <= date; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 6) dayCount++;
    }

    const isADay = dayCount % 2 === 1;
    if (isADay) return 'A';

    const bWorkouts = ['B1', 'B2', 'B3'];
    const bCount = Math.floor(dayCount / 2);
    return bWorkouts[bCount % 3];
}

function advanceBRotation() {
    const data = getData();
    data.bRotation = ((data.bRotation || 0) + 1) % 3;
    saveData(data);
}

// ============ STREAK CALCULATION ============

function calculateStreak() {
    const data = getData();
    const entries = data.entries;

    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    // Check from today backwards
    while (true) {
        const dateStr = formatDate(checkDate);
        const entry = entries[dateStr];
        const isSaturday = checkDate.getDay() === 6;

        if (isSaturday) {
            // Saturday (Cheat Day) - training is optional
            // Count it if done, but don't break streak if not
            if (entry?.training) {
                streak++;
            }
            // Move to previous day regardless
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
        }

        // Non-Saturday: training required to continue streak
        if (entry?.training) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // No training on non-Saturday = streak ends
            break;
        }
    }

    return streak;
}

// ============ STATS CALCULATION ============

function getWeeklyAverage() {
    const data = getData();
    const entries = data.entries;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let weights = [];
    let calories = [];
    let proteins = [];
    let trainingCount = 0;

    for (let d = new Date(weekAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const entry = entries[dateStr];
        if (entry) {
            if (entry.weight) weights.push(entry.weight);
            if (entry.calories) calories.push(entry.calories);
            if (entry.protein) proteins.push(entry.protein);
            if (entry.training) trainingCount++;
        }
    }

    return {
        weight: weights.length ? (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1) : null,
        calories: calories.length ? Math.round(calories.reduce((a, b) => a + b, 0) / calories.length) : null,
        protein: proteins.length ? Math.round(proteins.reduce((a, b) => a + b, 0) / proteins.length) : null,
        trainingDays: trainingCount
    };
}

function getMonthlyStats() {
    const data = getData();
    const entries = data.entries;
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    let firstWeight = null;
    let lastWeight = null;
    let trainingCount = 0;

    const sortedDates = Object.keys(entries).sort();

    for (const dateStr of sortedDates) {
        const date = parseDate(dateStr);
        if (date >= monthStart && date <= today) {
            const entry = entries[dateStr];
            if (entry.weight) {
                if (!firstWeight) firstWeight = entry.weight;
                lastWeight = entry.weight;
            }
            if (entry.training) trainingCount++;
        }
    }

    return {
        start: firstWeight,
        current: lastWeight,
        change: firstWeight && lastWeight ? (lastWeight - firstWeight).toFixed(1) : null,
        trainings: trainingCount
    };
}

function checkNeverMissTwice() {
    const data = getData();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (yesterday.getDay() === 6) return false;

    const yesterdayStr = formatDate(yesterday);
    const entry = data.entries[yesterdayStr];

    return entry && !entry.training;
}

// Export for use in other modules
window.Storage = {
    STORAGE_KEY,
    SETTINGS_KEY,
    START_WEIGHT,
    GOAL_WEIGHT,
    GOAL_DATE,
    START_DATE,
    QUARTER_GOALS,
    WORKOUTS,
    ACTIVITY_LEVELS,
    DEFAULT_SETTINGS,
    // Storage functions
    initStorage,
    getData,
    saveData,
    getSettingsData,
    saveSettingsData,
    isElectronApp: () => isElectron,
    // Helper functions
    formatDate,
    parseDate,
    getDayName,
    getWeekStart,
    getMonthStart,
    getWeekNumber,
    getLatestWeight,
    getTodayWorkout,
    getWorkoutTypeForDate,
    advanceBRotation,
    calculateStreak,
    getWeeklyAverage,
    getMonthlyStats,
    checkNeverMissTwice
};
