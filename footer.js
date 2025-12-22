document.write(`
<footer>
  <div class="footer-container">
    <div class="footer-col">
      <h4 style="font-size: 22px;">TaxEasePro</h4>
      <p>Helping businesses and individuals navigate the complex world of taxes for over two decades.</p>
    </div>
    
    <div class="footer-col">
      <h4>Income Tax</h4>
      <a href="index.html#services">ITR Filing</a>
      <a href="index.html#services">Business ITR</a>
      <a href="index.html#contact">Notice Reply</a>
      <a href="calculator.html">Tax Calculator</a>
    </div>

    <div class="footer-col">
      <h4>GST Services</h4>
      <a href="index.html#services">GST Registration</a>
      <a href="index.html#services">Monthly Returns</a>
      <a href="index.html#services">GST Revocation</a>
    </div>

    <div class="footer-col">
      <h4>Registration</h4>
      <a href="index.html#registration">MSME Registration</a>
      <a href="index.html#registration">Private Limited</a>
      <a href="index.html#registration">Digital Signature</a>
    </div>

    <div class="footer-col">
      <h4>Get in Touch</h4>
      <a href="https://wa.me/919876543210" target="_blank" style="color: #25D366; font-weight: bold;">Chat on WhatsApp</a>
      <a href="mailto:taxeasepro@zohomail.in">taxeasepro@zohomail.in</a>
      <button onclick="openModal()" style="background:none; border:1px solid #00d4ff; color:#00d4ff; padding:10px; width:100%; border-radius:5px; cursor:pointer; font-weight:bold; margin-top:10px;">Request Call Back</button>
    </div>
  </div>
</footer>

<div id="callbackModal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; justify-content:center; align-items:center;">
  <div class="callback-box" style="background:#111; padding:30px; border-radius:15px; width:90%; max-width:400px; border:1px solid #00d4ff; position:relative;">
    <span onclick="closeModal()" style="position:absolute; right:15px; top:10px; color:#fff; cursor:pointer; font-size:24px;">&times;</span>
    <h3 style="color:#00d4ff; margin-top:0;">Callback Request</h3>
    <form action="https://formspree.io/f/xqezdlrb" method="POST" id="leadForm">
      <input type="text" name="name" placeholder="Full Name" required style="width:100%; padding:12px; margin-bottom:15px; background:#222; border:1px solid #333; color:white;">
      <input type="tel" name="phone" placeholder="10 Digits Mobile Number" pattern="[0-9]{10}" required style="width:100%; padding:12px; margin-bottom:15px; background:#222; border:1px solid #333; color:white;">
      <textarea name="reason" placeholder="Message" rows="3" required style="width:100%; padding:12px; margin-bottom:15px; background:#222; border:1px solid #333; color:white;"></textarea>
      <button type="submit" style="background:#00d4ff; color:#000; border:none; padding:12px; width:100%; border-radius:5px; font-weight:bold; cursor:pointer;">Submit Now</button>
    </form>
  </div>
</div>

<script>
  function openModal() { document.getElementById('callbackModal').style.display = 'flex'; }
  function closeModal() { document.getElementById('callbackModal').style.display = 'none'; }
  const f = document.getElementById('leadForm');
  if(f){ f.onsubmit = async (e) => { e.preventDefault(); await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { 'Accept': 'application/json' } }); alert("Success!"); f.reset(); closeModal(); }; }
</script>
`);
