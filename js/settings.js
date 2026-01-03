// ============ USER SETTINGS ============

function getUserSettings() {
    const stored = localStorage.getItem(Storage.SETTINGS_KEY);
    if (stored) {
        return { ...Storage.DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    return { ...Storage.DEFAULT_SETTINGS };
}

function saveUserSettings(settings) {
    localStorage.setItem(Storage.SETTINGS_KEY, JSON.stringify(settings));
    // Update all displays
    UI.updateDashboard();
    updateScientificGoals();
    updateSettingsPreview();
}

function getActivityLevel() {
    const settings = getUserSettings();
    return Storage.ACTIVITY_LEVELS[settings.activity] || Storage.ACTIVITY_LEVELS.moderate;
}

function getUserHeightM() {
    return getUserSettings().height / 100;
}

// ============ SCIENTIFIC CALCULATIONS ============

function calculateScientificGoals(weight) {
    if (!weight) return null;

    const settings = getUserSettings();
    const heightM = settings.height / 100;
    const activity = Storage.ACTIVITY_LEVELS[settings.activity] || Storage.ACTIVITY_LEVELS.moderate;

    // BMI Calculation
    const bmi = weight / (heightM * heightM);

    // BMI Category (WHO)
    let category, categoryClass;
    if (bmi < 18.5) {
        category = 'Untergewicht';
        categoryClass = 'underweight';
    } else if (bmi < 25) {
        category = 'Normalgewicht';
        categoryClass = 'normal';
    } else if (bmi < 30) {
        category = 'Übergewicht';
        categoryClass = 'overweight';
    } else if (bmi < 35) {
        category = 'Adipositas Grad I';
        categoryClass = 'obese';
    } else if (bmi < 40) {
        category = 'Adipositas Grad II';
        categoryClass = 'obese';
    } else {
        category = 'Adipositas Grad III';
        categoryClass = 'obese';
    }

    // Protein goal based on activity level
    const proteinGoal = Math.round(weight * activity.proteinFactor);

    // Calories: BMR (Mifflin-St Jeor) + Activity - Deficit
    const genderOffset = settings.gender === 'male' ? 5 : -161;
    const bmr = 10 * weight + 6.25 * settings.height - 5 * settings.age + genderOffset;
    const tdee = bmr * activity.pal;
    const calorieGoal = Math.round(tdee - 500); // 500 kcal deficit

    // Ideal weight at BMI 22
    const idealWeight = Math.round(22 * heightM * heightM * 10) / 10;

    // Next milestone (5kg steps)
    const nextMilestone = Math.floor(weight / 5) * 5;

    // BMI marker position for visualization (BMI 15-40 mapped to 0-100%)
    const bmiPosition = Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));

    return {
        bmi: bmi.toFixed(1),
        category,
        categoryClass,
        proteinGoal,
        calorieGoal,
        idealWeight,
        nextMilestone: nextMilestone < weight ? nextMilestone : weight - 2,
        bmiPosition
    };
}

function updateScientificGoals() {
    const latestWeight = Storage.getLatestWeight();
    const goals = calculateScientificGoals(latestWeight);

    if (!goals) {
        document.getElementById('currentBMI').textContent = '--';
        document.getElementById('bmiCategory').textContent = 'Gewicht eintragen';
        document.getElementById('bmiCategory').className = 'bmi-category';
        document.getElementById('proteinGoal').textContent = '--';
        document.getElementById('calorieGoal').textContent = '--';
        document.getElementById('nextMilestone').textContent = '--';
        document.getElementById('idealWeight').textContent = '--';
        return;
    }

    document.getElementById('currentBMI').textContent = `BMI ${goals.bmi}`;
    document.getElementById('bmiCategory').textContent = goals.category;
    document.getElementById('bmiCategory').className = `bmi-category ${goals.categoryClass}`;
    document.getElementById('proteinGoal').textContent = `${goals.proteinGoal}g`;
    document.getElementById('calorieGoal').textContent = `${goals.calorieGoal} kcal`;
    document.getElementById('nextMilestone').textContent = `${goals.nextMilestone} kg`;
    document.getElementById('idealWeight').textContent = `${goals.idealWeight} kg`;
    document.getElementById('bmiMarker').style.left = `${goals.bmiPosition}%`;
}

function getDynamicProteinGoal() {
    const weight = Storage.getLatestWeight();
    const activity = getActivityLevel();
    return weight ? Math.round(weight * activity.proteinFactor) : 180;
}

// ============ SETTINGS UI ============

function initSettings() {
    const settings = getUserSettings();

    // Height slider
    const heightSlider = document.getElementById('settingHeight');
    const heightValue = document.getElementById('heightValue');
    heightSlider.value = settings.height;
    heightValue.textContent = `${settings.height} cm`;

    heightSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        heightValue.textContent = `${value} cm`;
        const newSettings = getUserSettings();
        newSettings.height = value;
        saveUserSettings(newSettings);
    });

    // Age slider
    const ageSlider = document.getElementById('settingAge');
    const ageValue = document.getElementById('ageValue');
    ageSlider.value = settings.age;
    ageValue.textContent = `${settings.age} Jahre`;

    ageSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        ageValue.textContent = `${value} Jahre`;
        const newSettings = getUserSettings();
        newSettings.age = value;
        saveUserSettings(newSettings);
    });

    // Gender buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
        if (btn.dataset.gender === settings.gender) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.addEventListener('click', () => {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const newSettings = getUserSettings();
            newSettings.gender = btn.dataset.gender;
            saveUserSettings(newSettings);
        });
    });

    // Activity buttons
    document.querySelectorAll('.activity-btn').forEach(btn => {
        if (btn.dataset.activity === settings.activity) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.addEventListener('click', () => {
            document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const newSettings = getUserSettings();
            newSettings.activity = btn.dataset.activity;
            saveUserSettings(newSettings);
        });
    });

    // Initial preview update
    updateSettingsPreview();
}

function updateSettingsPreview() {
    const settings = getUserSettings();
    const weight = Storage.getLatestWeight() || 100;
    const activity = Storage.ACTIVITY_LEVELS[settings.activity];
    const heightM = settings.height / 100;

    // BMI
    const bmi = weight / (heightM * heightM);

    // BMR (Mifflin-St Jeor)
    const genderOffset = settings.gender === 'male' ? 5 : -161;
    const bmr = 10 * weight + 6.25 * settings.height - 5 * settings.age + genderOffset;

    // TDEE
    const tdee = bmr * activity.pal;

    // Protein
    const protein = Math.round(weight * activity.proteinFactor);

    // Ideal weight
    const idealWeight = Math.round(22 * heightM * heightM * 10) / 10;

    const previewContainer = document.getElementById('settingsPreview');
    previewContainer.innerHTML = `
        <div class="preview-item">
            <div class="value">${bmi.toFixed(1)}</div>
            <div class="label">BMI (bei ${weight}kg)</div>
        </div>
        <div class="preview-item">
            <div class="value">${Math.round(bmr)}</div>
            <div class="label">Grundumsatz (kcal)</div>
        </div>
        <div class="preview-item">
            <div class="value">${Math.round(tdee)}</div>
            <div class="label">Tagesbedarf (kcal)</div>
        </div>
        <div class="preview-item">
            <div class="value">${Math.round(tdee - 500)}</div>
            <div class="label">Defizit -500 (kcal)</div>
        </div>
        <div class="preview-item">
            <div class="value">${protein}g</div>
            <div class="label">Protein/Tag</div>
        </div>
        <div class="preview-item">
            <div class="value">${idealWeight}kg</div>
            <div class="label">Idealgewicht</div>
        </div>
    `;
}

// Export for use in other modules
window.Settings = {
    getUserSettings,
    saveUserSettings,
    getActivityLevel,
    getUserHeightM,
    calculateScientificGoals,
    updateScientificGoals,
    getDynamicProteinGoal,
    initSettings,
    updateSettingsPreview
};
