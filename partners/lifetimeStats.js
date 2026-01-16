// lifetimeStats.js - Handles the main Gross Earnings card animation
console.log("LifetimeStats.js loaded!");

function updateLifetimeGross(totalGross) {
    const earningsDisplay = document.getElementById('lifetimeEarnings');
    
    if (!earningsDisplay) {
        console.error("Lifetime Earnings element nahi mila!");
        return;
    }

    const finalValue = parseFloat(totalGross) || 0;

    // Animation: 0 se lekar Asli Gross Income tak
    animateLifetimeValue(earningsDisplay, 0, finalValue, 1500);
}

function animateLifetimeValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Number ko formatted tarike se dikhane ke liye (₹1,25,000)
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.innerHTML = `₹${currentVal.toLocaleString('en-IN')}`;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
