// ============ GAMIFICATION SYSTEM ============

// Level titles and XP requirements
const LEVELS = [
    { level: 1, title: 'Anfänger', xpNeeded: 0 },
    { level: 2, title: 'Rookie', xpNeeded: 100 },
    { level: 3, title: 'Aufsteiger', xpNeeded: 250 },
    { level: 4, title: 'Kämpfer', xpNeeded: 500 },
    { level: 5, title: 'Athlet', xpNeeded: 800 },
    { level: 6, title: 'Krieger', xpNeeded: 1200 },
    { level: 7, title: 'Champion', xpNeeded: 1700 },
    { level: 8, title: 'Elite', xpNeeded: 2300 },
    { level: 9, title: 'Meister', xpNeeded: 3000 },
    { level: 10, title: 'Legende', xpNeeded: 4000 },
    { level: 11, title: 'Unstoppable', xpNeeded: 5500 },
    { level: 12, title: 'Titan', xpNeeded: 7500 },
    { level: 13, title: 'Gott-Modus', xpNeeded: 10000 }
];

// Medal definitions
const MEDALS = [
    // Streak Medals
    { id: 'streak_7', icon: '🔥', name: '7-Tage-Feuer', desc: '7 Tage Streak', xp: 50, check: (stats) => stats.bestStreak >= 7 },
    { id: 'streak_14', icon: '💪', name: '2-Wochen-Warrior', desc: '14 Tage Streak', xp: 100, check: (stats) => stats.bestStreak >= 14 },
    { id: 'streak_30', icon: '⚡', name: 'Monats-Monster', desc: '30 Tage Streak', xp: 200, check: (stats) => stats.bestStreak >= 30 },
    { id: 'streak_60', icon: '🏆', name: 'Unaufhaltsam', desc: '60 Tage Streak', xp: 400, check: (stats) => stats.bestStreak >= 60 },
    { id: 'streak_100', icon: '👑', name: 'Hundert-Tage-König', desc: '100 Tage Streak', xp: 750, check: (stats) => stats.bestStreak >= 100 },

    // Training Medals
    { id: 'train_10', icon: '🎯', name: 'Erster Meilenstein', desc: '10 Trainings', xp: 30, check: (stats) => stats.totalTrainings >= 10 },
    { id: 'train_25', icon: '💎', name: 'Diamant-Disziplin', desc: '25 Trainings', xp: 60, check: (stats) => stats.totalTrainings >= 25 },
    { id: 'train_50', icon: '🌟', name: 'Halb-Hundert', desc: '50 Trainings', xp: 120, check: (stats) => stats.totalTrainings >= 50 },
    { id: 'train_100', icon: '💯', name: 'Centurion', desc: '100 Trainings', xp: 250, check: (stats) => stats.totalTrainings >= 100 },
    { id: 'train_200', icon: '🦁', name: 'Löwenherz', desc: '200 Trainings', xp: 500, check: (stats) => stats.totalTrainings >= 200 },

    // Weight Loss Medals
    { id: 'weight_5', icon: '📉', name: 'Erste Erfolge', desc: '5 kg verloren', xp: 100, check: (stats) => stats.weightLost >= 5 },
    { id: 'weight_10', icon: '🎉', name: 'Zweistellig', desc: '10 kg verloren', xp: 250, check: (stats) => stats.weightLost >= 10 },
    { id: 'weight_15', icon: '🚀', name: 'Transformation', desc: '15 kg verloren', xp: 500, check: (stats) => stats.weightLost >= 15 },
    { id: 'weight_goal', icon: '🏁', name: 'Ziel erreicht!', desc: 'Unter 90 kg', xp: 1000, check: (stats) => stats.currentWeight && stats.currentWeight < 90 },

    // Protein Medals
    { id: 'protein_7', icon: '🥩', name: 'Protein-Pro', desc: '7 Tage Protein-Ziel erreicht', xp: 75, check: (stats) => stats.proteinStreak >= 7 },
    { id: 'protein_30', icon: '🍗', name: 'Protein-Meister', desc: '30 Tage Protein-Ziel erreicht', xp: 200, check: (stats) => stats.proteinStreak >= 30 },

    // IF Medals
    { id: 'if_14', icon: '⏰', name: 'IF-Anfänger', desc: '14 Tage IF eingehalten', xp: 50, check: (stats) => stats.ifStreak >= 14 },
    { id: 'if_30', icon: '🕐', name: 'IF-Profi', desc: '30 Tage IF eingehalten', xp: 100, check: (stats) => stats.ifStreak >= 30 },
    { id: 'if_60', icon: '⌛', name: 'IF-Meister', desc: '60 Tage IF eingehalten', xp: 200, check: (stats) => stats.ifStreak >= 60 },

    // Perfect Week Medals
    { id: 'perfect_1', icon: '✨', name: 'Perfekte Woche', desc: '1 perfekte Woche', xp: 100, check: (stats) => stats.perfectWeeks >= 1 },
    { id: 'perfect_4', icon: '🌈', name: 'Perfekter Monat', desc: '4 perfekte Wochen', xp: 300, check: (stats) => stats.perfectWeeks >= 4 },
    { id: 'perfect_12', icon: '💫', name: 'Perfektes Quartal', desc: '12 perfekte Wochen', xp: 750, check: (stats) => stats.perfectWeeks >= 12 },

    // Special Medals
    { id: 'early_bird', icon: '🌅', name: 'Früher Vogel', desc: 'Ersten Eintrag gemacht', xp: 10, check: (stats) => stats.totalEntries >= 1 },
    { id: 'consistency', icon: '📊', name: 'Daten-Nerd', desc: '30 Tage geloggt', xp: 75, check: (stats) => stats.totalEntries >= 30 },
    { id: 'quarter_q1', icon: '🎯', name: 'Q1 Sieger', desc: 'Q1 Ziel erreicht', xp: 300, check: (stats) => stats.q1Reached },
    { id: 'quarter_q2', icon: '☀️', name: 'Q2 Sieger', desc: 'Q2 Ziel erreicht', xp: 300, check: (stats) => stats.q2Reached },
    { id: 'quarter_q3', icon: '🍂', name: 'Q3 Sieger', desc: 'Q3 Ziel erreicht', xp: 300, check: (stats) => stats.q3Reached },
    { id: 'quarter_q4', icon: '❄️', name: 'Q4 Sieger', desc: 'Q4 Ziel erreicht', xp: 500, check: (stats) => stats.q4Reached },

    // === NEW MEDALS ===

    // Consistency / Logging
    { id: 'log_7', icon: '🗓️', name: 'Woche geschafft', desc: '7 Tage am Stück geloggt', xp: 25, check: (stats) => stats.logStreak >= 7 },
    { id: 'log_60', icon: '📆', name: '2 Monate dabei', desc: '60 Tage geloggt', xp: 150, check: (stats) => stats.totalEntries >= 60 },
    { id: 'log_90', icon: '🗓️', name: 'Quartal-Logger', desc: '90 Tage geloggt', xp: 250, check: (stats) => stats.totalEntries >= 90 },
    { id: 'log_365', icon: '📅', name: 'Jahres-Veteran', desc: '365 Tage geloggt', xp: 1000, check: (stats) => stats.totalEntries >= 365 },

    // BMI Milestones
    { id: 'bmi_under30', icon: '📊', name: 'Adipositas ade', desc: 'BMI unter 30', xp: 300, check: (stats) => stats.currentBMI && stats.currentBMI < 30 },
    { id: 'bmi_under25', icon: '🎯', name: 'Übergewicht-Exit', desc: 'BMI unter 25', xp: 500, check: (stats) => stats.currentBMI && stats.currentBMI < 25 },
    { id: 'bmi_normal', icon: '✨', name: 'Normalgewicht', desc: 'BMI im Normalbereich (18.5-25)', xp: 750, check: (stats) => stats.currentBMI && stats.currentBMI >= 18.5 && stats.currentBMI < 25 },

    // Workout Variety
    { id: 'allrounder', icon: '🔄', name: 'Allrounder', desc: 'Alle 3 B-Workouts in einer Woche', xp: 50, check: (stats) => stats.weeklyAllBWorkouts },
    { id: 'runner_20', icon: '🏃', name: 'Läufer-Herz', desc: '20 Tag-A Trainings', xp: 100, check: (stats) => stats.totalADays >= 20 },
    { id: 'push_15', icon: '💪', name: 'Push-Master', desc: '15 B1-Workouts', xp: 75, check: (stats) => stats.totalB1Days >= 15 },
    { id: 'pull_15', icon: '🏋️', name: 'Pull-Master', desc: '15 B2-Workouts', xp: 75, check: (stats) => stats.totalB2Days >= 15 },
    { id: 'legs_15', icon: '🦵', name: 'Leg-Master', desc: '15 B3-Workouts', xp: 75, check: (stats) => stats.totalB3Days >= 15 },

    // Calorie Discipline
    { id: 'cal_7', icon: '🎯', name: 'Kalorien-Rookie', desc: '7 Tage im Zielbereich', xp: 50, check: (stats) => stats.calorieStreak >= 7 },
    { id: 'cal_30', icon: '🎯', name: 'Kalorien-Pro', desc: '30 Tage im Zielbereich', xp: 150, check: (stats) => stats.calorieStreak >= 30 },

    // Perfect Days
    { id: 'perfect_day_1', icon: '⭐', name: 'Perfekter Tag', desc: 'Training + Protein + IF + Kalorien', xp: 30, check: (stats) => stats.perfectDays >= 1 },
    { id: 'perfect_day_5', icon: '🌟', name: '5 Perfekte Tage', desc: '5x alles geschafft', xp: 100, check: (stats) => stats.perfectDays >= 5 },
    { id: 'perfect_day_20', icon: '💎', name: '20 Perfekte Tage', desc: '20x alles geschafft', xp: 300, check: (stats) => stats.perfectDays >= 20 },
    { id: 'perfect_day_50', icon: '👑', name: '50 Perfekte Tage', desc: '50x alles geschafft', xp: 500, check: (stats) => stats.perfectDays >= 50 },

    // Level Achievements
    { id: 'level_5', icon: '🎮', name: 'Level 5', desc: 'Level 5 erreicht', xp: 50, check: (stats) => stats.currentLevel >= 5 },
    { id: 'level_10', icon: '🎮', name: 'Level 10', desc: 'Level 10 erreicht', xp: 150, check: (stats) => stats.currentLevel >= 10 },
    { id: 'level_max', icon: '👑', name: 'Max Level', desc: 'Level 13 erreicht', xp: 500, check: (stats) => stats.currentLevel >= 13 },

    // Speed Achievements
    { id: 'speed_1kg', icon: '⚡', name: 'Schnellstart', desc: '1kg in einer Woche verloren', xp: 75, check: (stats) => stats.weeklyWeightLoss >= 1 },
    { id: 'speed_3kg', icon: '🚀', name: 'Turbo-Monat', desc: '3kg in einem Monat verloren', xp: 200, check: (stats) => stats.monthlyWeightLoss >= 3 },

    // Special
    { id: 'comeback', icon: '🦸', name: 'Comeback-Kid', desc: 'Nach 3+ Tagen Pause zurück', xp: 50, check: (stats) => stats.hadComeback },
    { id: 'no_cheat', icon: '🧘', name: 'Cheat-Verzicht', desc: 'Monat ohne Cheat Day', xp: 200, check: (stats) => stats.monthWithoutCheat },
    { id: 'sunday_warrior', icon: '🌅', name: 'Sonntagskrieger', desc: 'Training am Sonntag', xp: 25, check: (stats) => stats.sundayTraining },
    { id: 'weight_20', icon: '🏆', name: 'Mega-Transformation', desc: '20 kg verloren', xp: 750, check: (stats) => stats.weightLost >= 20 }
];

// Daily Challenges with dynamic goals
const DAILY_CHALLENGES = [
    { id: 'train_today', icon: '💪', name: 'Training absolvieren', desc: 'Schließe dein heutiges Training ab', xp: 20, check: (todayEntry) => todayEntry?.training },
    { id: 'protein_dynamic', icon: '🥩', name: 'Protein-Ziel', getDesc: () => `Erreiche ${Settings.getDynamicProteinGoal()}g Protein`, xp: 15, check: (todayEntry) => todayEntry?.protein >= Settings.getDynamicProteinGoal() },
    { id: 'if_today', icon: '⏰', name: 'IF einhalten', desc: 'Halte das 12-20 Uhr Fenster ein', xp: 10, check: (todayEntry) => todayEntry?.if },
    { id: 'calorie_dynamic', icon: '🎯', name: 'Kalorien-Zone', getDesc: () => { const g = Settings.calculateScientificGoals(Storage.getLatestWeight()); return g ? `Bleib bei ~${g.calorieGoal} kcal` : 'Kalorien im Defizit'; }, xp: 15, check: (todayEntry) => { const g = Settings.calculateScientificGoals(Storage.getLatestWeight()); return g && todayEntry?.calories >= (g.calorieGoal - 200) && todayEntry?.calories <= (g.calorieGoal + 200); } },
    { id: 'log_weight', icon: '⚖️', name: 'Wiegen', desc: 'Trage dein Gewicht ein', xp: 5, check: (todayEntry) => todayEntry?.weight }
];

// Weekly Challenges
const WEEKLY_CHALLENGES = [
    { id: 'perfect_week', icon: '🏆', name: 'Perfekte Woche', desc: '6/6 Trainings diese Woche', xp: 150, target: 6, getProgress: (stats) => stats.weekTrainings },
    { id: 'protein_week', icon: '🥩', name: 'Protein-Woche', desc: '5 Tage Protein-Ziel erreicht', xp: 100, target: 5, getProgress: (stats) => stats.weekProteinDays },
    { id: 'if_week', icon: '⏰', name: 'IF-Woche', desc: '6 Tage IF eingehalten', xp: 75, target: 6, getProgress: (stats) => stats.weekIFDays },
    { id: 'weight_down', icon: '📉', name: 'Abwärtstrend', desc: 'Gewicht diese Woche reduzieren', xp: 100, target: 1, getProgress: (stats) => stats.weekWeightDown ? 1 : 0 }
];

// XP rewards
const XP_REWARDS = {
    training: 25,
    proteinGoal: 10,
    ifDone: 5,
    calorieZone: 10,
    logWeight: 3,
    logEntry: 2
};

// ============ GAMIFICATION FUNCTIONS ============

function getGamificationData() {
    const data = Storage.getData();
    if (!data.gamification) {
        data.gamification = {
            xp: 0,
            unlockedMedals: {},
            completedDailyChallenges: {},
            completedWeeklyChallenges: {},
            bestStreak: 0,
            perfectWeeks: 0
        };
        Storage.saveData(data);
    }
    return data.gamification;
}

function saveGamificationData(gamData) {
    const data = Storage.getData();
    data.gamification = gamData;
    Storage.saveData(data);
}

function addXP(amount, reason) {
    const gamData = getGamificationData();
    const oldLevel = getCurrentLevel(gamData.xp);
    gamData.xp += amount;
    const newLevel = getCurrentLevel(gamData.xp);
    saveGamificationData(gamData);

    if (newLevel.level > oldLevel.level) {
        showReward('🎉', `Level ${newLevel.level} erreicht!`, `${newLevel.title}`, amount);
    }

    updateXPDisplay();
    return gamData.xp;
}

function getCurrentLevel(xp) {
    let currentLevel = LEVELS[0];
    for (const level of LEVELS) {
        if (xp >= level.xpNeeded) {
            currentLevel = level;
        } else {
            break;
        }
    }
    return currentLevel;
}

function getNextLevel(xp) {
    for (const level of LEVELS) {
        if (xp < level.xpNeeded) {
            return level;
        }
    }
    return null;
}

function calculateStats() {
    const data = Storage.getData();
    const entries = data.entries;
    const sortedDates = Object.keys(entries).sort();
    const settings = Settings.getUserSettings();
    const heightM = settings.height / 100;
    const gamData = getGamificationData();

    let stats = {
        totalTrainings: 0,
        totalEntries: sortedDates.length,
        weightLost: 0,
        currentWeight: null,
        bestStreak: 0,
        currentStreak: Storage.calculateStreak(),
        proteinStreak: 0,
        ifStreak: 0,
        perfectWeeks: gamData.perfectWeeks || 0,
        weekTrainings: 0,
        weekProteinDays: 0,
        weekIFDays: 0,
        weekWeightDown: false,
        q1Reached: false,
        q2Reached: false,
        q3Reached: false,
        q4Reached: false,

        // New stats
        logStreak: 0,
        currentBMI: null,
        totalADays: 0,
        totalB1Days: 0,
        totalB2Days: 0,
        totalB3Days: 0,
        weeklyAllBWorkouts: false,
        calorieStreak: 0,
        perfectDays: 0,
        currentLevel: 1,
        weeklyWeightLoss: 0,
        monthlyWeightLoss: 0,
        hadComeback: gamData.hadComeback || false,
        monthWithoutCheat: false,
        sundayTraining: gamData.sundayTraining || false
    };

    let currentProteinStreak = 0;
    let currentIFStreak = 0;
    let currentLogStreak = 0;
    let currentCalorieStreak = 0;
    let lastEntryDate = null;
    let weekStart = Storage.getWeekStart(new Date());
    let monthStart = Storage.getMonthStart(new Date());
    let firstWeekWeight = null;
    let lastWeekWeight = null;
    let firstMonthWeight = null;
    let lastMonthWeight = null;
    let weekB1 = false, weekB2 = false, weekB3 = false;
    let monthCheatDays = 0;
    let gapDays = 0;

    for (const dateStr of sortedDates) {
        const entry = entries[dateStr];
        const entryDate = Storage.parseDate(dateStr);
        const dayOfWeek = entryDate.getDay();

        // Logging streak
        if (lastEntryDate) {
            const daysDiff = Math.floor((entryDate - lastEntryDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
                currentLogStreak++;
            } else if (daysDiff > 1) {
                gapDays = daysDiff - 1;
                if (gapDays >= 3 && !stats.hadComeback) {
                    stats.hadComeback = true;
                    gamData.hadComeback = true;
                }
                currentLogStreak = 1;
            }
        } else {
            currentLogStreak = 1;
        }
        stats.logStreak = Math.max(stats.logStreak, currentLogStreak);
        lastEntryDate = entryDate;

        // Training counts
        if (entry.training) {
            stats.totalTrainings++;

            if (dayOfWeek === 0) {
                stats.sundayTraining = true;
                gamData.sundayTraining = true;
            }

            const workoutType = Storage.getWorkoutTypeForDate(entryDate);
            if (workoutType === 'A') stats.totalADays++;
            else if (workoutType === 'B1') stats.totalB1Days++;
            else if (workoutType === 'B2') stats.totalB2Days++;
            else if (workoutType === 'B3') stats.totalB3Days++;
        }

        if (entry.weight) stats.currentWeight = entry.weight;
        if (entry.cheat) monthCheatDays++;

        // Calorie goal check
        const calorieGoal = Settings.calculateScientificGoals(stats.currentWeight || 100)?.calorieGoal || 2100;
        const calorieInRange = entry.calories && entry.calories >= (calorieGoal - 200) && entry.calories <= (calorieGoal + 200);
        if (calorieInRange) {
            currentCalorieStreak++;
            stats.calorieStreak = Math.max(stats.calorieStreak, currentCalorieStreak);
        } else if (entry.calories) {
            currentCalorieStreak = 0;
        }

        // Protein streak
        if (entry.protein >= Settings.getDynamicProteinGoal()) {
            currentProteinStreak++;
            stats.proteinStreak = Math.max(stats.proteinStreak, currentProteinStreak);
        } else {
            currentProteinStreak = 0;
        }

        // IF streak
        if (entry.if) {
            currentIFStreak++;
            stats.ifStreak = Math.max(stats.ifStreak, currentIFStreak);
        } else {
            currentIFStreak = 0;
        }

        // Perfect day check
        const proteinOk = entry.protein >= Settings.getDynamicProteinGoal();
        const isPerfectDay = entry.training && proteinOk && entry.if && calorieInRange;
        if (isPerfectDay) stats.perfectDays++;

        // This week stats
        if (entryDate >= weekStart) {
            if (entry.training) {
                stats.weekTrainings++;
                const workoutType = Storage.getWorkoutTypeForDate(entryDate);
                if (workoutType === 'B1') weekB1 = true;
                if (workoutType === 'B2') weekB2 = true;
                if (workoutType === 'B3') weekB3 = true;
            }
            if (proteinOk) stats.weekProteinDays++;
            if (entry.if) stats.weekIFDays++;
            if (entry.weight) {
                if (!firstWeekWeight) firstWeekWeight = entry.weight;
                lastWeekWeight = entry.weight;
            }
        }

        // This month stats
        if (entryDate >= monthStart) {
            if (entry.weight) {
                if (!firstMonthWeight) firstMonthWeight = entry.weight;
                lastMonthWeight = entry.weight;
            }
        }
    }

    stats.weeklyAllBWorkouts = weekB1 && weekB2 && weekB3;

    if (stats.currentWeight) {
        stats.weightLost = Storage.START_WEIGHT - stats.currentWeight;
        stats.currentBMI = stats.currentWeight / (heightM * heightM);
    }

    if (firstWeekWeight && lastWeekWeight) {
        stats.weeklyWeightLoss = firstWeekWeight - lastWeekWeight;
        if (lastWeekWeight < firstWeekWeight) {
            stats.weekWeightDown = true;
        }
    }

    if (firstMonthWeight && lastMonthWeight) {
        stats.monthlyWeightLoss = firstMonthWeight - lastMonthWeight;
    }

    stats.monthWithoutCheat = monthCheatDays === 0 && sortedDates.some(d => Storage.parseDate(d) >= monthStart);

    stats.bestStreak = Math.max(gamData.bestStreak || 0, stats.currentStreak);
    if (stats.currentStreak > (gamData.bestStreak || 0)) {
        gamData.bestStreak = stats.currentStreak;
    }

    stats.currentLevel = getCurrentLevel(gamData.xp || 0).level;

    const today = new Date();
    if (stats.currentWeight) {
        if (today >= new Date('2026-03-31') && stats.currentWeight <= 99.5) stats.q1Reached = true;
        if (today >= new Date('2026-06-30') && stats.currentWeight <= 95.5) stats.q2Reached = true;
        if (today >= new Date('2026-09-30') && stats.currentWeight <= 92.5) stats.q3Reached = true;
        if (today >= new Date('2026-12-23') && stats.currentWeight <= 89.9) stats.q4Reached = true;
    }

    saveGamificationData(gamData);

    return stats;
}

function checkAndUnlockMedals() {
    const stats = calculateStats();
    const gamData = getGamificationData();
    let newMedals = [];

    for (const medal of MEDALS) {
        if (!gamData.unlockedMedals[medal.id] && medal.check(stats)) {
            gamData.unlockedMedals[medal.id] = {
                unlockedAt: new Date().toISOString(),
                xpAwarded: medal.xp
            };
            gamData.xp += medal.xp;
            newMedals.push(medal);
        }
    }

    saveGamificationData(gamData);

    if (newMedals.length > 0) {
        showMedalUnlock(newMedals[0]);
    }

    return newMedals;
}

function showMedalUnlock(medal) {
    showReward(medal.icon, 'Neue Medaille!', medal.name, medal.xp);
}

function showReward(icon, title, subtitle, xp) {
    document.getElementById('rewardIcon').textContent = icon;
    document.getElementById('rewardTitle').textContent = title;
    document.getElementById('rewardXP').textContent = subtitle + (xp ? ` +${xp} XP` : '');
    document.getElementById('rewardOverlay').classList.add('show');
    document.getElementById('rewardModal').classList.add('show');
}

function closeRewardModal() {
    document.getElementById('rewardOverlay').classList.remove('show');
    document.getElementById('rewardModal').classList.remove('show');
    updateXPDisplay();
    updateAchievements();
}

function updateXPDisplay() {
    const gamData = getGamificationData();
    const currentLevel = getCurrentLevel(gamData.xp);
    const nextLevel = getNextLevel(gamData.xp);

    document.getElementById('levelIcon').textContent = currentLevel.level;
    document.getElementById('levelTitle').textContent = currentLevel.title;
    document.getElementById('totalXP').textContent = `${gamData.xp} XP gesamt`;

    if (nextLevel) {
        const xpInLevel = gamData.xp - currentLevel.xpNeeded;
        const xpForLevel = nextLevel.xpNeeded - currentLevel.xpNeeded;
        const progress = (xpInLevel / xpForLevel) * 100;
        document.getElementById('xpFill').style.width = `${progress}%`;
        document.getElementById('xpText').textContent = `${xpInLevel} / ${xpForLevel} XP zum Level ${nextLevel.level}`;
    } else {
        document.getElementById('xpFill').style.width = '100%';
        document.getElementById('xpText').textContent = 'MAX LEVEL erreicht!';
    }
}

function updateAchievements() {
    const gamData = getGamificationData();
    const stats = calculateStats();
    const data = Storage.getData();
    const todayEntry = data.entries[Storage.formatDate(new Date())] || {};

    // Update Daily Challenges
    const dailyContainer = document.getElementById('dailyChallenges');
    const today = Storage.formatDate(new Date());

    dailyContainer.innerHTML = DAILY_CHALLENGES.map(challenge => {
        const completed = challenge.check(todayEntry);
        const alreadyClaimed = gamData.completedDailyChallenges[today]?.[challenge.id];

        return `
            <div class="challenge-card ${completed ? 'completed' : 'active'}">
                <div class="challenge-header">
                    <div class="challenge-title">
                        <span class="icon">${challenge.icon}</span>
                        <span>${challenge.name}</span>
                    </div>
                    <span class="challenge-reward">${alreadyClaimed ? '✓' : `+${challenge.xp} XP`}</span>
                </div>
                <div class="challenge-status">${challenge.getDesc ? challenge.getDesc() : challenge.desc}</div>
                <div class="challenge-progress">
                    <div class="challenge-progress-bar">
                        <div class="challenge-progress-fill" style="width: ${completed ? 100 : 0}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Update Weekly Challenge
    const weeklyContainer = document.getElementById('weeklyChallenges');
    const weekNum = Storage.getWeekNumber(new Date());
    const weeklyChallenge = WEEKLY_CHALLENGES[weekNum % WEEKLY_CHALLENGES.length];
    const weeklyProgress = weeklyChallenge.getProgress(stats);
    const weeklyCompleted = weeklyProgress >= weeklyChallenge.target;
    const weeklyKey = `${new Date().getFullYear()}-W${weekNum}`;
    const weeklyClaimed = gamData.completedWeeklyChallenges[weeklyKey]?.[weeklyChallenge.id];

    weeklyContainer.innerHTML = `
        <div class="challenge-card weekly-challenge ${weeklyCompleted ? 'completed' : 'active'}">
            <div class="challenge-header">
                <div class="challenge-title">
                    <span class="icon">${weeklyChallenge.icon}</span>
                    <span>${weeklyChallenge.name}</span>
                </div>
                <span class="challenge-reward">${weeklyClaimed ? '✓' : `+${weeklyChallenge.xp} XP`}</span>
            </div>
            <div class="challenge-status">${weeklyChallenge.desc}</div>
            <div class="challenge-progress">
                <div class="challenge-progress-bar">
                    <div class="challenge-progress-fill" style="width: ${Math.min(100, (weeklyProgress / weeklyChallenge.target) * 100)}%"></div>
                </div>
                <div class="challenge-status">${weeklyProgress} / ${weeklyChallenge.target}</div>
            </div>
        </div>
    `;

    // Update Medals Grid
    const medalsContainer = document.getElementById('medalsGrid');
    medalsContainer.innerHTML = MEDALS.map(medal => {
        const unlocked = gamData.unlockedMedals[medal.id];
        const unlockedDate = unlocked ? new Date(unlocked.unlockedAt).toLocaleDateString('de-DE') : '';

        return `
            <div class="medal-item ${unlocked ? 'unlocked' : 'locked'}">
                <div class="medal-icon">${medal.icon}</div>
                <div class="medal-name">${medal.name}</div>
                <div class="medal-desc">${medal.desc}</div>
                ${unlocked ? `<div class="medal-date">${unlockedDate}</div>` : ''}
            </div>
        `;
    }).join('');

    // Update total stats
    document.getElementById('totalTrainings').textContent = stats.totalTrainings;
    document.getElementById('totalMedals').textContent = Object.keys(gamData.unlockedMedals).length;
    document.getElementById('bestStreak').textContent = stats.bestStreak;
}

function processDailyXP(entry, isNewEntry) {
    if (!isNewEntry) return;

    const gamData = getGamificationData();
    const today = Storage.formatDate(new Date());
    let xpEarned = 0;

    if (!gamData.completedDailyChallenges[today]) {
        gamData.completedDailyChallenges[today] = {};
    }

    for (const challenge of DAILY_CHALLENGES) {
        if (!gamData.completedDailyChallenges[today][challenge.id] && challenge.check(entry)) {
            gamData.completedDailyChallenges[today][challenge.id] = true;
            xpEarned += challenge.xp;
        }
    }

    const weekNum = Storage.getWeekNumber(new Date());
    const weeklyKey = `${new Date().getFullYear()}-W${weekNum}`;
    const weeklyChallenge = WEEKLY_CHALLENGES[weekNum % WEEKLY_CHALLENGES.length];
    const stats = calculateStats();

    if (!gamData.completedWeeklyChallenges[weeklyKey]) {
        gamData.completedWeeklyChallenges[weeklyKey] = {};
    }

    if (!gamData.completedWeeklyChallenges[weeklyKey][weeklyChallenge.id]) {
        const progress = weeklyChallenge.getProgress(stats);
        if (progress >= weeklyChallenge.target) {
            gamData.completedWeeklyChallenges[weeklyKey][weeklyChallenge.id] = true;
            xpEarned += weeklyChallenge.xp;

            if (weeklyChallenge.id === 'perfect_week') {
                gamData.perfectWeeks = (gamData.perfectWeeks || 0) + 1;
            }
        }
    }

    if (xpEarned > 0) {
        gamData.xp += xpEarned;
        saveGamificationData(gamData);
    }

    checkAndUnlockMedals();

    updateXPDisplay();
    updateAchievements();
}

// Export for use in other modules
window.Gamification = {
    LEVELS,
    MEDALS,
    DAILY_CHALLENGES,
    WEEKLY_CHALLENGES,
    XP_REWARDS,
    getGamificationData,
    saveGamificationData,
    addXP,
    getCurrentLevel,
    getNextLevel,
    calculateStats,
    checkAndUnlockMedals,
    showMedalUnlock,
    showReward,
    closeRewardModal,
    updateXPDisplay,
    updateAchievements,
    processDailyXP
};

// Make closeRewardModal available globally for onclick
window.closeRewardModal = closeRewardModal;
