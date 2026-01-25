/**
 * analytics.js - Complete Professional Dashboard Analytics
 */

// 1. Helper Function to get CSS Variables
const getStyleColor = (variable) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || '#888';
};

// Global instances
let incomeChartInstance = null;
let referralChartInstance = null;

/**
 * MAIN ENTRY POINT
 */
function renderLiveAnalytics(referralList) {
    if (!referralList || referralList.length === 0) {
        console.warn("Analytics: No data available.");
        resetAnalyticsUI();
        return;
    }
    updateStatTiles(referralList);
    const graphData = processDualGraphData(referralList);
    drawIncomeChart(graphData.labels, graphData.incomeValues);
    drawReferralChart(graphData.labels, graphData.referralCounts);
}

/**
 * STATS CALCULATION
 */
function updateStatTiles(list) {
    let totalOrders = list.length;
    let completedOrders = 0;
    let totalNetEarnings = 0;

    list.forEach(order => {
        const status = (order.status || "").toLowerCase();
        if (status === 'completed' || status === 'paid') {
            completedOrders++;
            const gross = parseFloat(order.gross || 0);
            totalNetEarnings += (gross * 0.95);
        }
    });

    const conversionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0";
    const avgEarning = completedOrders > 0 ? (totalNetEarnings / completedOrders).toFixed(0) : "0";

    const elConv = document.getElementById('analytics-conversion');
    const elOrder = document.getElementById('analytics-orders');
    const elAvg = document.getElementById('analytics-avg');

    if (elConv) elConv.innerText = conversionRate + "%";
    if (elOrder) elOrder.innerText = totalOrders;
    if (elAvg) elAvg.innerText = "₹" + parseInt(avgEarning).toLocaleString('en-IN');
}

/**
 * DATA PROCESSING
 */
function processDualGraphData(list) {
    const monthlyMap = {};
    list.forEach(order => {
        const d = new Date(order.date);
        const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyMap[monthLabel]) monthlyMap[monthLabel] = { income: 0, count: 0 };
        monthlyMap[monthLabel].count += 1;
        const status = (order.status || "").toLowerCase();
        if (status === 'completed' || status === 'paid') {
            monthlyMap[monthLabel].income += (parseFloat(order.gross || 0) * 0.95);
        }
    });
    const sortedLabels = Object.keys(monthlyMap);
    return {
        labels: sortedLabels,
        incomeValues: sortedLabels.map(l => monthlyMap[l].income),
        referralCounts: sortedLabels.map(l => monthlyMap[l].count)
    };
}

/**
 * GRAPH 1: Income Trend
 */
function drawIncomeChart(labels, values) {
    const canvas = document.getElementById('incomeChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (incomeChartInstance) incomeChartInstance.destroy();

    const textColor = getStyleColor('--text-gray');
    const gridColor = getStyleColor('--glass-border') || 'rgba(0,0,0,0.1)';
    const bgColor = getStyleColor('--bg-deep');

    incomeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Income (₹)',
                data: values,
                borderColor: '#00c4b4',
                backgroundColor: 'rgba(0, 196, 180, 0.1)',
                borderWidth: 2.5,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#00c4b4',
                pointBorderColor: bgColor,
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } }
            }
        }
    });
}

/**
 * GRAPH 2: Referral Growth
 */
function drawReferralChart(labels, values) {
    const canvas = document.getElementById('referralChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (referralChartInstance) referralChartInstance.destroy();

    const textColor = getStyleColor('--text-gray');
   const gridColor = getStyleColor('--glass-border') || 'rgba(0,0,0,0.1)';
    const barColor = getStyleColor('--earnings-color');

    referralChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Leads',
                data: values,
                backgroundColor: barColor,
                borderRadius: 4,
                barPercentage: 0.5,
                maxBarThickness: 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 }, stepSize: 1 } },
                x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } }
            }
        }
    });
}

/**
 * RESET UI
 */
function resetAnalyticsUI() {
    ['analytics-conversion', 'analytics-orders', 'analytics-avg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = id.includes('avg') ? "₹0" : (id.includes('conv') ? "0%" : "0");
    });
}
