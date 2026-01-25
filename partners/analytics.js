/**
 * analytics.js - Complete Professional Dashboard Analytics
 * Handles: 3 Stats (Success, Avg, Total) + 2 Graphs (Income, Referral)
 */
const getStyleColor = (variable) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};
// Global instances taaki graphs refresh hote waqt purana data clean ho jaye
let incomeChartInstance = null;
let referralChartInstance = null;

/**
 * MAIN ENTRY POINT: Call this when data arrives from backend
 */
function renderLiveAnalytics(referralList) {
    if (!referralList || referralList.length === 0) {
        console.warn("Analytics: No data available.");
        resetAnalyticsUI();
        return;
    }

    // 1. Update 3 Stats: Conversion, Avg Earning, Total Orders
    updateStatTiles(referralList);

    // 2. Process Data for Dual Graphs
    const graphData = processDualGraphData(referralList);

    // 3. Draw both Charts
    drawIncomeChart(graphData.labels, graphData.incomeValues);
    drawReferralChart(graphData.labels, graphData.referralCounts);
}

/**
 * LOGIC: Stats Calculation (3 Metrics)
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
            // Calculation: Gross - 5% TDS
            const net = gross * 0.95;
            totalNetEarnings += net;
        }
    });

    const conversionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0";
    const avgEarning = completedOrders > 0 ? (totalNetEarnings / completedOrders).toFixed(0) : "0";

    // UI Updates (Make sure these IDs exist in your HTML)
    const elConv = document.getElementById('analytics-conversion');
    const elOrder = document.getElementById('analytics-orders');
    const elAvg = document.getElementById('analytics-avg');

    if (elConv) elConv.innerText = conversionRate + "%";
    if (elOrder) elOrder.innerText = totalOrders;
    if (elAvg) elAvg.innerText = "₹" + parseInt(avgEarning).toLocaleString('en-IN');
}

/**
 * LOGIC: Monthly Data Aggregation
 */
function processDualGraphData(list) {
    const monthlyMap = {};

    list.forEach(order => {
        const d = new Date(order.date);
        const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        if (!monthlyMap[monthLabel]) {
            monthlyMap[monthLabel] = { income: 0, count: 0 };
        }

        // Referral Rate: Count every referral
        monthlyMap[monthLabel].count += 1;

        // Income Rate: Only successful earnings
        const status = (order.status || "").toLowerCase();
        if (status === 'completed' || status === 'paid') {
            const gross = parseFloat(order.gross || 0);
            monthlyMap[monthLabel].income += (gross * 0.95);
        }
    });

    // Sort labels chronologically if needed
    const sortedLabels = Object.keys(monthlyMap);

    return {
        labels: sortedLabels,
        incomeValues: sortedLabels.map(l => monthlyMap[l].income),
        referralCounts: sortedLabels.map(l => monthlyMap[l].count)
    };
}

/**
 * GRAPH 1: Income Trend (Line Chart)
 */
function drawIncomeChart(labels, values) {
    const canvas = document.getElementById('incomeChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (incomeChartInstance) incomeChartInstance.destroy();

    // Theme variables nikalne ke liye helper function
const getThemeColor = (variable) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

function drawIncomeChart(labels, values) {
    const canvas = document.getElementById('incomeChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (incomeChartInstance) incomeChartInstance.destroy();

    // Theme ke hisaab se dynamic colors
    const textColor = getThemeColor('--text-gray');
    const gridColor = getThemeColor('--glass-border');
    const bgColor = getThemeColor('--bg-deep');

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
                pointBorderColor: bgColor, // Point border background ke saath match karegi
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: gridColor }, 
                    ticks: { color: textColor, font: { size: 10 } } 
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { color: textColor, font: { size: 10 } } 
                }
            }
        }
    });
}

/**
 * GRAPH 2: Referral Growth (Bar Chart)
 */
function drawReferralChart(labels, values) {
    const canvas = document.getElementById('referralChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (referralChartInstance) referralChartInstance.destroy();

    const textColor = getThemeColor('--text-gray');
    const gridColor = getThemeColor('--glass-border');
    // Bar ka color humne CSS variable --earnings-color se link kar diya hai
    const barColor = getThemeColor('--earnings-color');

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
                y: { 
                    beginAtZero: true, 
                    grid: { color: gridColor }, 
                    ticks: { color: textColor, font: { size: 10 }, stepSize: 1 } 
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { color: textColor, font: { size: 10 } } 
                }
            }
        }
    });
}

/**
 * RESET UI: If no data
 */
function resetAnalyticsUI() {
    ['analytics-conversion', 'analytics-orders', 'analytics-avg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = id.includes('avg') ? "₹0" : (id.includes('conv') ? "0%" : "0");
    });
}
