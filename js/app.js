// ============ UI UPDATE FUNCTIONS ============

const UI = {
    updateDashboard: function() {
        const data = Storage.getData();
        const latestWeight = Storage.getLatestWeight();
        const weeklyStats = Storage.getWeeklyAverage();
        const streak = Storage.calculateStreak();
        const todayWorkout = Storage.getTodayWorkout();

        // Progress
        if (latestWeight) {
            const targetWeight = Settings.getTargetWeight();
            document.getElementById('currentWeight').textContent = `${latestWeight} kg`;
            const lost = (Storage.START_WEIGHT - latestWeight).toFixed(1);
            const toGo = (latestWeight - targetWeight).toFixed(1);
            const progress = ((Storage.START_WEIGHT - latestWeight) / (Storage.START_WEIGHT - targetWeight)) * 100;

            document.getElementById('weightLost').textContent = lost;
            document.getElementById('weightToGo').textContent = toGo;
            document.getElementById('progressFill').style.width = `${Math.min(100, Math.max(0, progress))}%`;
            
            // Update goal displays
            const goalElement = document.querySelector('.subtitle');
            if (goalElement && goalElement.textContent.includes('Ziel:')) {
                goalElement.textContent = `Ziel: ${targetWeight} kg bis 23. Dezember 2026`;
            }
            
            // Update goal in progress card
            const goalDisplay = document.getElementById('goalDisplay');
            if (goalDisplay) {
                goalDisplay.textContent = `Ziel: ${targetWeight} kg`;
            }
        }

        // Days left and current date display
        const today = new Date();
        const daysLeft = Math.ceil((Storage.GOAL_DATE - today) / (1000 * 60 * 60 * 24));
        document.getElementById('daysLeft').textContent = daysLeft;

        // Show current date in header
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('currentDate').textContent =
            `Heute: ${today.toLocaleDateString('de-DE', dateOptions)}`;

        // Weekly average
        document.getElementById('weeklyAvg').textContent = weeklyStats.weight ? `${weeklyStats.weight}` : '--';
        document.getElementById('avgCalories').textContent = weeklyStats.calories || '--';
        document.getElementById('avgProtein').textContent = weeklyStats.protein ? `${weeklyStats.protein}g` : '--';
        document.getElementById('trainingDays').textContent = `${weeklyStats.trainingDays}/7`;

        // Streak
        document.getElementById('streakCount').textContent = streak;

        // Today's workout
        const workout = Storage.WORKOUTS[todayWorkout];
        const badge = document.getElementById('todayBadge');
        badge.textContent = workout.name;
        badge.className = `training-badge ${workout.badge}`;
        document.getElementById('todayWorkout').innerHTML = `<p>${workout.details}</p>`;

        // Never miss twice alert
        const alertBanner = document.getElementById('alertBanner');
        if (Storage.checkNeverMissTwice()) {
            alertBanner.classList.add('show');
        } else {
            alertBanner.classList.remove('show');
        }

        // Quarter goals
        UI.updateQuarterGoals(latestWeight);

        // Scientific goals
        Settings.updateScientificGoals();
    },

    updateQuarterGoals: function(currentWeight) {
        const container = document.getElementById('quarterGoals');
        const today = new Date();
        
        // Get dynamic quarter goals based on current target weight
        const quarterGoals = Settings.updateQuarterGoals();

        container.innerHTML = quarterGoals.map((q, idx) => {
            let status = 'future';
            let icon = '⏳';

            if (today > q.date) {
                status = currentWeight && currentWeight <= q.target ? 'achieved' : 'future';
                icon = currentWeight && currentWeight <= q.target ? '✅' : '❌';
            } else if (today <= q.date && (idx === 0 || today > quarterGoals[idx - 1]?.date)) {
                status = 'current';
                icon = '🎯';
            }

            return `
                <div class="quarter-item ${status}">
                    <span>${icon} ${q.label}</span>
                    <span>${q.target.toFixed(1)} kg</span>
                </div>
            `;
        }).join('');
    },

    updateQuarterGoalsDisplay: function(quarterGoals) {
        // This function can be called from settings.js to update the display
        const currentWeight = Storage.getLatestWeight();
        this.updateQuarterGoals(currentWeight);
    },

    updateHistory: function() {
        const data = Storage.getData();
        const entries = data.entries;
        const container = document.getElementById('historyList');

        const sortedDates = Object.keys(entries).sort().reverse().slice(0, 14);

        if (sortedDates.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 20px;">Noch keine Einträge</p>';
            return;
        }

        container.innerHTML = sortedDates.map(dateStr => {
            const entry = entries[dateStr];
            const date = Storage.parseDate(dateStr);

            return `
                <div class="history-item">
                    <div class="history-date">
                        <strong>${Storage.getDayName(date)}</strong><br>
                        ${dateStr.slice(5)}
                    </div>
                    <div class="history-data">
                        ${entry.weight ? `<span class="history-tag">${entry.weight} kg</span>` : ''}
                        ${entry.training ? '<span class="history-tag success">✅ Training</span>' : '<span class="history-tag warning">❌ Kein Training</span>'}
                        ${entry.calories ? `<span class="history-tag">${entry.calories} kcal</span>` : ''}
                        ${entry.protein ? `<span class="history-tag">${entry.protein}g Protein</span>` : ''}
                        ${entry.if ? '<span class="history-tag success">IF ✓</span>' : ''}
                        ${entry.cheat ? '<span class="history-tag" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b;">🍕 Cheat</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Monthly stats
        const monthly = Storage.getMonthlyStats();
        document.getElementById('monthStart').textContent = monthly.start ? `${monthly.start} kg` : '--';
        document.getElementById('monthCurrent').textContent = monthly.current ? `${monthly.current} kg` : '--';
        document.getElementById('monthChange').textContent = monthly.change ? `${monthly.change} kg` : '--';
        document.getElementById('monthChange').className = `value ${parseFloat(monthly.change) < 0 ? 'trend-down' : 'trend-up'}`;
        document.getElementById('monthTrainings').textContent = monthly.trainings;
    }
};

// Make UI globally available
window.UI = UI;

// ============ FORM HANDLING ============

function initForm() {
    const dateInput = document.getElementById('entryDate');
    dateInput.value = Storage.formatDate(new Date());

    loadEntryForDate(dateInput.value);

    dateInput.addEventListener('change', (e) => {
        loadEntryForDate(e.target.value);
    });
}

function loadEntryForDate(dateStr) {
    const data = Storage.getData();
    const entry = data.entries[dateStr] || {};

    document.getElementById('entryCalories').value = entry.calories || '';
    document.getElementById('entryProtein').value = entry.protein || '';
    document.getElementById('trainingDone').checked = entry.training || false;
    document.getElementById('ifDone').checked = entry.if || false;
    document.getElementById('cheatDay').checked = entry.cheat || false;

    updateQuickStats(entry);
}

function updateQuickStats(entry) {
    const proteinEl = document.getElementById('proteinStatus');
    const calorieEl = document.getElementById('calorieStatus');

    if (entry.protein) {
        const proteinOk = entry.protein >= Settings.getDynamicProteinGoal();
        proteinEl.textContent = `${entry.protein}g`;
        proteinEl.style.color = proteinOk ? 'var(--success)' : 'var(--warning)';
    } else {
        proteinEl.textContent = '--';
        proteinEl.style.color = '';
    }

    if (entry.calories) {
        const inRange = entry.calories >= 2100 && entry.calories <= 2400;
        calorieEl.textContent = entry.calories;
        calorieEl.style.color = inRange ? 'var(--success)' : 'var(--warning)';
    } else {
        calorieEl.textContent = '--';
        calorieEl.style.color = '';
    }
}

// ============ MIDNIGHT REFRESH ============

function scheduleMiddnightRefresh() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 1, 0);

    const msUntilMidnight = midnight - now;

    setTimeout(() => {
        UI.updateDashboard();
        UI.updateHistory();
        initForm();
        scheduleMiddnightRefresh();
    }, msUntilMidnight);
}

// ============ EVENT LISTENERS ============

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');

            if (tab.dataset.tab === 'history') {
                UI.updateHistory();
            }
            if (tab.dataset.tab === 'achievements') {
                Gamification.updateAchievements();
            }
            if (tab.dataset.tab === 'charts') {
                Charts.drawChart();
            }
        });
    });

    // Form submission
    document.getElementById('dailyForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const dateStr = document.getElementById('entryDate').value;
        const data = Storage.getData();

        const wasTrainingBefore = data.entries[dateStr]?.training;
        const isTrainingNow = document.getElementById('trainingDone').checked;

        // Preserve existing weight data
        const existingWeight = data.entries[dateStr]?.weight || null;

        const entry = {
            weight: existingWeight,
            calories: parseInt(document.getElementById('entryCalories').value) || null,
            protein: parseInt(document.getElementById('entryProtein').value) || null,
            training: isTrainingNow,
            if: document.getElementById('ifDone').checked,
            cheat: document.getElementById('cheatDay').checked
        };

        data.entries[dateStr] = entry;

        // Advance B rotation if this is a new B-day training
        if (!wasTrainingBefore && isTrainingNow) {
            const todayWorkout = Storage.getTodayWorkout();
            if (todayWorkout.startsWith('B')) {
                Storage.advanceBRotation();
            }
        }

        Storage.saveData(data);

        // Process gamification
        Gamification.processDailyXP(entry, true);

        updateQuickStats(entry);
        UI.updateDashboard();
        Gamification.updateXPDisplay();

        // Visual feedback
        const btn = e.target.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = '✅ Gespeichert!';
        btn.style.background = 'var(--success)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });

    // Weight form submission
    document.getElementById('weightForm').addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Weight form submitted'); // Debug

        const dateStr = document.getElementById('weightDate').value;
        const weight = parseFloat(document.getElementById('weightValue').value);
        
        console.log('Date:', dateStr, 'Weight:', weight); // Debug

        if (!dateStr || !weight) {
            console.error('Missing date or weight');
            return;
        }

        const data = Storage.getData();
        console.log('Current data:', data); // Debug

        if (!data.entries[dateStr]) {
            data.entries[dateStr] = {};
        }
        data.entries[dateStr].weight = weight;

        Storage.saveData(data);
        console.log('Data saved'); // Debug

        // Update displays
        UI.updateDashboard();
        Charts.drawChart();

        // Add XP for logging weight
        Gamification.addXP(Gamification.XP_REWARDS.logWeight, 'Gewicht eingetragen');

        // Visual feedback
        const btn = e.target.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = '✅ Gespeichert!';
        btn.style.background = 'var(--success)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);

        // Clear weight input
        document.getElementById('weightValue').value = '';
    });

    // Initialize weight form date
    document.getElementById('weightDate').value = Storage.formatDate(new Date());

    // Initialize storage (async for Electron file storage)
    Storage.initStorage().then(() => {
        // Initialize everything after storage is ready
        initForm();
        Settings.initSettings();
        UI.updateDashboard();
        Gamification.updateXPDisplay();
        Gamification.updateAchievements();
        Charts.initChartTab();
        scheduleMiddnightRefresh();

        // Show storage info in Electron
        if (Storage.isElectronApp()) {
            console.log('🖥️ Läuft als Desktop-App mit Datei-Speicherung');
        } else {
            console.log('🌐 Läuft im Browser mit localStorage');
        }
    });
});
