// ============ CHART FUNCTIONS ============

let currentChartDays = 30;

function getWeightData(days) {
    const data = Storage.getData();
    const entries = data.entries;
    const sortedDates = Object.keys(entries).sort();

    let weights = [];
    const today = new Date();
    const cutoffDate = days > 0 ? new Date(today.getTime() - days * 24 * 60 * 60 * 1000) : null;

    for (const dateStr of sortedDates) {
        const entry = entries[dateStr];
        const entryDate = Storage.parseDate(dateStr);

        if (entry.weight && (!cutoffDate || entryDate >= cutoffDate)) {
            weights.push({
                date: entryDate,
                dateStr: dateStr,
                weight: entry.weight
            });
        }
    }

    return weights;
}

function calculateMovingAverage(weights, windowSize = 7) {
    return weights.map((point, index) => {
        const start = Math.max(0, index - windowSize + 1);
        const subset = weights.slice(start, index + 1);
        const avg = subset.reduce((sum, p) => sum + p.weight, 0) / subset.length;
        return {
            date: point.date,
            weight: avg
        };
    });
}

function drawChart(days = currentChartDays) {
    currentChartDays = days;
    const canvas = document.getElementById('weightChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    // Set canvas size for high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 250 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '250px';
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 250;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get data
    const weights = getWeightData(days);

    if (weights.length < 2) {
        ctx.fillStyle = '#64748b';
        ctx.font = '14px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Noch nicht genug Daten', width / 2, height / 2);
        ctx.fillText('(mindestens 2 Gewichtseinträge nötig)', width / 2, height / 2 + 20);
        updateChartStats(weights);
        return;
    }

    // Calculate ranges
    const allWeights = weights.map(w => w.weight);
    const minWeight = Math.min(...allWeights, Storage.GOAL_WEIGHT) - 1;
    const maxWeight = Math.max(...allWeights, Storage.START_WEIGHT) + 1;
    const weightRange = maxWeight - minWeight;

    const minDate = weights[0].date;
    const maxDate = weights[weights.length - 1].date;
    const dateRange = maxDate - minDate || 1;

    // Helper functions
    const xScale = (date) => padding.left + ((date - minDate) / dateRange) * chartWidth;
    const yScale = (weight) => padding.top + ((maxWeight - weight) / weightRange) * chartHeight;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal grid lines (weight)
    const yGridCount = 5;
    for (let i = 0; i <= yGridCount; i++) {
        const y = padding.top + (i / yGridCount) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // Y-axis labels
        const weight = maxWeight - (i / yGridCount) * weightRange;
        ctx.fillStyle = '#64748b';
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(weight.toFixed(1), padding.left - 8, y + 4);
    }

    // Goal line
    const goalY = yScale(Storage.GOAL_WEIGHT);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, goalY);
    ctx.lineTo(width - padding.right, goalY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw 7-day moving average
    const movingAvg = calculateMovingAverage(weights);
    if (movingAvg.length > 1) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        movingAvg.forEach((point, i) => {
            const x = xScale(point.date);
            const y = yScale(point.weight);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    // Draw weight line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    weights.forEach((point, i) => {
        const x = xScale(point.date);
        const y = yScale(point.weight);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw data points
    weights.forEach(point => {
        const x = xScale(point.date);
        const y = yScale(point.weight);

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // X-axis date labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'center';

    const labelCount = Math.min(weights.length, 6);
    const step = Math.floor(weights.length / labelCount);

    for (let i = 0; i < weights.length; i += step) {
        const point = weights[i];
        const x = xScale(point.date);
        const dateLabel = point.dateStr.slice(5); // MM-DD
        ctx.fillText(dateLabel, x, height - 10);
    }

    // Always show last date
    if (weights.length > 0) {
        const lastPoint = weights[weights.length - 1];
        const x = xScale(lastPoint.date);
        const dateLabel = lastPoint.dateStr.slice(5);
        ctx.fillText(dateLabel, x, height - 10);
    }

    // Update stats
    updateChartStats(weights);
}

function updateChartStats(weights) {
    if (weights.length === 0) {
        document.getElementById('chartHighest').textContent = '--';
        document.getElementById('chartLowest').textContent = '--';
        document.getElementById('chartAverage').textContent = '--';
        document.getElementById('chartChange').textContent = '--';
        document.getElementById('projectionTitle').textContent = 'Keine Daten';
        document.getElementById('projectionText').textContent = 'Trage dein Gewicht ein, um eine Prognose zu sehen.';
        return;
    }

    const allWeights = weights.map(w => w.weight);
    const highest = Math.max(...allWeights);
    const lowest = Math.min(...allWeights);
    const average = allWeights.reduce((a, b) => a + b, 0) / allWeights.length;
    const change = weights.length > 1 ? allWeights[allWeights.length - 1] - allWeights[0] : 0;

    document.getElementById('chartHighest').textContent = highest.toFixed(1) + ' kg';
    document.getElementById('chartLowest').textContent = lowest.toFixed(1) + ' kg';
    document.getElementById('chartAverage').textContent = average.toFixed(1) + ' kg';
    document.getElementById('chartChange').textContent = (change > 0 ? '+' : '') + change.toFixed(1) + ' kg';

    const changeBox = document.getElementById('chartChangeBox');
    changeBox.classList.remove('positive', 'negative');
    if (change < 0) changeBox.classList.add('positive');
    else if (change > 0) changeBox.classList.add('negative');

    // Calculate projection
    if (weights.length >= 7) {
        const firstWeek = weights.slice(0, 7);
        const lastWeek = weights.slice(-7);
        const firstAvg = firstWeek.reduce((s, p) => s + p.weight, 0) / firstWeek.length;
        const lastAvg = lastWeek.reduce((s, p) => s + p.weight, 0) / lastWeek.length;

        const daysDiff = (weights[weights.length - 1].date - weights[0].date) / (1000 * 60 * 60 * 24);
        const weeklyChange = daysDiff > 0 ? ((lastAvg - firstAvg) / daysDiff) * 7 : 0;

        document.getElementById('weeklyLoss').textContent = (weeklyChange > 0 ? '+' : '') + weeklyChange.toFixed(2) + ' kg';

        const currentWeight = allWeights[allWeights.length - 1];
        if (weeklyChange < 0 && currentWeight > Storage.GOAL_WEIGHT) {
            const kgToLose = currentWeight - Storage.GOAL_WEIGHT;
            const weeksNeeded = kgToLose / Math.abs(weeklyChange);
            const daysNeeded = Math.ceil(weeksNeeded * 7);
            const goalDate = new Date();
            goalDate.setDate(goalDate.getDate() + daysNeeded);

            document.getElementById('daysToGoal').textContent = daysNeeded;
            document.getElementById('projectionTitle').textContent = '🎯 Ziel erreichbar!';
            document.getElementById('projectionText').textContent =
                `Bei aktuellem Tempo erreichst du ${Storage.GOAL_WEIGHT} kg am ${goalDate.toLocaleDateString('de-DE')}.`;
        } else if (currentWeight <= Storage.GOAL_WEIGHT) {
            document.getElementById('daysToGoal').textContent = '✓';
            document.getElementById('projectionTitle').textContent = '🏆 Ziel erreicht!';
            document.getElementById('projectionText').textContent = 'Du hast dein Zielgewicht erreicht!';
        } else {
            document.getElementById('daysToGoal').textContent = '∞';
            document.getElementById('projectionTitle').textContent = '📈 Trend anpassen';
            document.getElementById('projectionText').textContent =
                'Aktuell kein Abwärtstrend. Fokus auf Kaloriendefizit und Training!';
        }
    } else {
        document.getElementById('weeklyLoss').textContent = '--';
        document.getElementById('daysToGoal').textContent = '--';
        document.getElementById('projectionTitle').textContent = 'Mehr Daten benötigt';
        document.getElementById('projectionText').textContent =
            'Mindestens 7 Gewichtseinträge für eine Prognose nötig.';
    }
}

function initChartTab() {
    // Time filter buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            drawChart(parseInt(btn.dataset.days));
        });
    });

    // Redraw on window resize
    window.addEventListener('resize', () => {
        if (document.getElementById('charts').classList.contains('active')) {
            drawChart(currentChartDays);
        }
    });
}

// Export for use in other modules
window.Charts = {
    drawChart,
    updateChartStats,
    initChartTab,
    getWeightData,
    calculateMovingAverage
};
