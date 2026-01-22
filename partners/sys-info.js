// sys-info.js
async function getDeviceSignature() {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.font = "16px 'Arial'";
        ctx.fillText("TaxEasePro-v1", 2, 2);
        
        // Browser ke GPU aur rendering signals se unique string
        const sig = canvas.toDataURL().substring(50, 150); 
        
        const raw = [
            navigator.hardwareConcurrency, // CPU Cores
            navigator.deviceMemory,        // RAM (if available)
            window.screen.width + "x" + window.screen.height,
            new Date().getTimezoneOffset(),
            sig
        ].join('##');

        // Ise Base64 mein convert karke hash jaisa banate hain
        return btoa(raw).replace(/=/g, '').substring(0, 32);
    } catch (e) {
        return "SIG-" + Math.random().toString(36).substring(2, 10);
    }
}
