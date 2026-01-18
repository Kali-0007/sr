/**
 * analytics.js - Professional Dual-Graph Module
 * Handles: Income Rate Chart, Referral Rate Chart, and Quick Stats
 */

// Global variables for Chart instances
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

    // 1. Update Stats (Conversion & Total)
    updateStatTiles(referralList);

    // 2. Process Data for both Graphs
    const graphData = processDualGraphData(referralList);

    // 3. Draw both Charts
    drawIncomeChart(graphData.labels, graphData.incomeValues);
    drawReferralChart(graphData.labels, graphData.referralCounts);
}

/**
 * CALCULATE TILE STATS
 */
function updateStatTiles(list) {
    let totalOrders = list.length;
    let completedOrders = 0;

    list.forEach(order => {
        const status = (order.status || "").toLowerCase();
        if (status === 'completed' || status === 'paid') {
            completedOrders++;
        }
    });

    const conversionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0";

    const elConv = document.getElementById('analytics-conversion');
    const elOrder = document.getElementById('analytics-orders');

    if (elConv) elConv.innerText = conversionRate + "%";
    if (elOrder) elOrder.innerText = totalOrders;
}

/**
 * PROCESS DATA FOR DUAL TRENDS (Income & Count)
 */
function processDualGraphData(list) {
    const monthlyMap = {};

    list.forEach(order => {
        const d = new Date(order.date);
        const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        if (!monthlyMap[monthLabel]) {
            monthlyMap[monthLabel] = { income: 0, count: 0 };
        }

        // Referral Rate: Count everything
        monthlyMap[monthLabel].count += 1;

        // Income Rate: Count only paid
        const status = (order.status || "").toLowerCase();
        if (status === 'completed' || status === 'paid') {
            const gross = parseFloat(order.gross || 0);
            const net = gross - (gross * 0.05); // 5% TDS Logic
            monthlyMap[monthLabel].income += net;
        }
    });

    return {
        labels: Object.keys(monthlyMap),
        incomeValues: Object.values(monthlyMap).map(v => v.income),
        referralCounts: Object.values(monthlyMap).map(v => v.count)
    };
}

/**
 * CHART 1: INCOME RATE (Line Chart)
 */
function drawIncomeChart(labels, values) {
    const canvas = document.getElementById('incomeChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (incomeChartInstance) incomeChartInstance.destroy();

    incomeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Income (₹)',
                data: values,
                borderColor: '#00c4b4',
                backgroundColor: 'rgba(0, 196, 180, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

/**
 * CHART 2: REFERRAL RATE (Bar Chart)
 */
function drawReferralChart(labels, values) {
    const canvas = document.getElementById('referralChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (referralChartInstance) referralChartInstance.destroy();

    referralChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Referrals',
                data: values,
                backgroundColor: '#d4af37',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', stepSize: 1 } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

/**
 * RESET UI
 */
function resetAnalyticsUI() {
    if (document.getElementById('analytics-conversion')) document.getElementById('analytics-conversion').innerText = "0%";
    if (document.getElementById('analytics-orders')) document.getElementById('analytics-orders').innerText = "0";
}
