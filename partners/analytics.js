/**
 * analytics.js - Professional Dual-Graph Module (Fixed Layout)
 */

let incomeChartInstance = null;
let referralChartInstance = null;

function renderLiveAnalytics(referralList) {
    if (!referralList || referralList.length === 0) {
        resetAnalyticsUI();
        return;
    }

    updateStatTiles(referralList);
    const graphData = processDualGraphData(referralList);

    drawIncomeChart(graphData.labels, graphData.incomeValues);
    drawReferralChart(graphData.labels, graphData.referralCounts);
}

function updateStatTiles(list) {
    let totalOrders = list.length;
    let completedOrders = list.filter(o => (o.status || "").toLowerCase() === 'completed' || (o.status || "").toLowerCase() === 'paid').length;
    
    const conversionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0";

    const elConv = document.getElementById('analytics-conversion');
    const elOrder = document.getElementById('analytics-orders');

    if (elConv) elConv.innerText = conversionRate + "%";
    if (elOrder) elOrder.innerText = totalOrders;
}

function processDualGraphData(list) {
    const monthlyMap = {};
    list.forEach(order => {
        const d = new Date(order.date);
        const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyMap[monthLabel]) monthlyMap[monthLabel] = { income: 0, count: 0 };
        
        monthlyMap[monthLabel].count += 1;
        const status = (order.status || "").toLowerCase();
        if (status === 'completed' || status === 'paid') {
            const gross = parseFloat(order.gross || 0);
            monthlyMap[monthLabel].income += (gross * 0.95); // 5% TDS deduct
        }
    });

    return {
        labels: Object.keys(monthlyMap),
        incomeValues: Object.values(monthlyMap).map(v => v.income),
        referralCounts: Object.values(monthlyMap).map(v => v.count)
    };
}

/**
 * FIXED INCOME CHART (Line)
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
                label: 'Income',
                data: values,
                borderColor: '#00c4b4',
                backgroundColor: 'rgba(0, 196, 180, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#00c4b4',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
            }
        }
    });
}

/**
 * FIXED REFERRAL CHART (Bar)
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
                label: 'Referrals',
                data: values,
                backgroundColor: '#d4af37',
                borderRadius: 4,
                // Isse bars zyada mote nahi honge agar data kam ho
                barPercentage: 0.4,
                maxBarThickness: 30 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false }, 
                    ticks: { color: '#64748b', font: { size: 10 }, stepSize: 1 } 
                },
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
            }
        }
    });
}

function resetAnalyticsUI() {
    if (document.getElementById('analytics-conversion')) document.getElementById('analytics-conversion').innerText = "0%";
    if (document.getElementById('analytics-orders')) document.getElementById('analytics-orders').innerText = "0";
}
