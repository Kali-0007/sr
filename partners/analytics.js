/**
 * analytics.js - Professional Dashboard Analytics Module
 * Handles: Monthly Revenue Graph, Conversion Rate, Total Orders, and Avg Earnings
 * Layout: Designed for 75% width container
 */

// Global variable to handle Chart instance
let revenueChartInstance = null;

/**
 * MAIN ENTRY POINT
 * Is function ko tab call karein jab backend se data (referralList) aa jaye.
 */
function renderLiveAnalytics(referralList) {
    if (!referralList || referralList.length === 0) {
        console.warn("Analytics: No data available.");
        resetAnalyticsUI();
        return;
    }

    // 1. Tiles Update Logic
    updateStatTiles(referralList);

    // 2. Data Processing for Graph
    const graphData = processGraphData(referralList);

    // 3. Render/Update Chart
    drawRevenueChart(graphData);
}

/**
 * CALCULATE TILE STATS (Conversion, Orders, Avg Earnings)
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
            // Dashboard standard: Net = Gross - 5% TDS
            const net = gross - (gross * 0.05);
            totalNetEarnings += net;
        }
    });

    // Calculations
    const conversionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0";
    const avgEarning = completedOrders > 0 ? (totalNetEarnings / completedOrders).toFixed(0) : "0";

    // UI Updates
    const elConv = document.getElementById('analytics-conversion');
    const elOrder = document.getElementById('analytics-orders');
    const elAvg = document.getElementById('analytics-avg');

    if (elConv) elConv.innerText = conversionRate + "%";
    if (elOrder) elOrder.innerText = totalOrders;
    if (elAvg) elAvg.innerText = "₹" + parseInt(avgEarning).toLocaleString('en-IN');
}

/**
 * PROCESS DATA FOR MONTHLY TREND
 */
function processGraphData(list) {
    const monthlyMap = {};

    // Grouping by Month
    list.forEach(order => {
        if ((order.status || "").toLowerCase() === 'completed' || (order.status || "").toLowerCase() === 'paid') {
            const d = new Date(order.date);
            const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
            
            const gross = parseFloat(order.gross || 0);
            const net = gross - (gross * 0.05);
            
            monthlyMap[monthLabel] = (monthlyMap[monthLabel] || 0) + net;
        }
    });

    // Prepare arrays for Chart.js
    const labels = Object.keys(monthlyMap);
    const dataValues = Object.values(monthlyMap);

    return { labels, dataValues };
}

/**
 * DRAW THE CHART (CHART.JS)
 */
function drawRevenueChart({ labels, dataValues }) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    // Destroy existing chart to prevent hover glitches
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    // Create New Chart
    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Earnings (₹)',
                data: dataValues,
                borderColor: '#2ecc71', // Neon Green
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                tension: 0.4, // Curved line
                fill: true,
                pointBackgroundColor: '#2ecc71',
                pointRadius: 4,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1e293b',
                    titleColor: '#fff',
                    bodyColor: '#2ecc71',
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            return ' Net: ₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { 
                        color: '#94a3b8',
                        callback: function(value) { return '₹' + value.toLocaleString('en-IN'); }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

/**
 * RESET UI (Fallback)
 */
function resetAnalyticsUI() {
    const ids = ['analytics-conversion', 'analytics-orders', 'analytics-avg'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = id.includes('avg') ? "₹0" : "0%";
    });
}
