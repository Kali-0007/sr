document.write(`
<style>
  footer { background: #0a0a0a; color: #fff; padding: 60px 20px 20px; font-family: 'Poppins', sans-serif; }
  .footer-container { max-width: 1200px; margin: auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1.2fr; gap: 30px; }
  
  @media (max-width: 900px) { .footer-container { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 500px) { .footer-container { grid-template-columns: 1fr; } }

  .footer-col h4 { color: #00d4ff; margin-bottom: 20px; font-size: 16px; }
  .footer-col a, .footer-col p { color: #bbb; text-decoration: none; display: block; margin-bottom: 10px; font-size: 14px; transition: 0.3s; line-height: 1.6; }
  .footer-col a:hover { color: #fff; padding-left: 5px; }
  
  .social-icons i { font-size: 22px; color: #bbb; transition: 0.3s; cursor: pointer; margin-right: 15px; }
  .social-icons i:hover { color: #00d4ff; transform: scale(1.1); }

  .modal-overlay { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; justify-content:center; align-items:center; }
  .callback-box { background:#111; padding:30px; border-radius:15px; width:90%; max-width:400px; border:1px solid #00d4ff; position:relative; }
  .callback-box input, .callback-box textarea { width:100%; padding:12px; margin-bottom:15px; background:#222; border:1px solid #333; color:white; border-radius:5px; border-left: 3px solid #00d4ff; outline:none; }
  .callback-btn { background:#00d4ff; color:#000; border:none; padding:12px; width:100%; border-radius:5px; font-weight:bold; cursor:pointer; }
</style>

<footer>
  <div class="footer-container">
    <div class="footer-col">
      <h4 style="font-size: 22px;">TaxEasePro</h4>
      <p>Helping businesses and individuals navigate the complex world of taxes for over two decades.</p>
      <div class="social-icons">
          <a href="YOUR_LINKEDIN_URL" target="_blank"><i class="fab fa-linkedin"></i></a>
          <a href="YOUR_INSTAGRAM_URL" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
    
    <div class="footer-col">
      <h4>Income Tax</h4>
      <a href="#" onclick="handleEliteAction('ITR Filing')">ITR Filing</a>
      <a href="#" onclick="handleEliteAction('Business ITR')">Business ITR</a>
      <a href="#" onclick="handleEliteAction('Tax Notice')">Notice Reply</a>
      <a href="calculator.html#calculator">Tax Calculator</a>
    </div>

    <div class="footer-col">
      <h4>GST Services</h4>
      <a href="#" onclick="handleEliteAction('GST Registration')">GST Registration</a>
      <a href="#" onclick="handleEliteAction('GST Returns')">Monthly Returns</a>
      <a href="#" onclick="handleEliteAction('GST Revocation')">GST Revocation</a>
    </div>

    <div class="footer-col">
      <h4>Registration</h4>
      <a href="#" onclick="handleEliteAction('MSME')">MSME Registration</a>
      <a href="#" onclick="handleEliteAction('Company')">Private Limited</a>
      <a href="#" onclick="handleEliteAction('DSC')">Digital Signature</a>
    </div>

    <div class="footer-col">
      <h4>Get in Touch</h4>
      <a href="https://wa.me/919876543210?text=Hi%20TaxEasePro,%20I%20need%20expert%20consultation." target="_blank" style="color: #25D366; font-weight: bold;">
        <i class="fab fa-whatsapp"></i> Chat on WhatsApp
      </a>
      <a href="taxeasepro@zohomail.in"><i class="fas fa-envelope"></i> taxeasepro@zohomail.in</a>
      
      <button onclick="openModal()" style="background:none; border:1px solid #00d4ff; color:#00d4ff; padding:10px; width:100%; border-radius:5px; cursor:pointer; font-weight:bold; margin-top:10px;">
         Request Call Back
      </button>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #222; color: #555; font-size: 12px;">
      © 2025 TaxEasePro. All rights reserved.
  </div>
</footer>

<div id="callbackModal" class="modal-overlay">
  <div class="callback-box">
    <span onclick="closeModal()" style="position:absolute; right:15px; top:10px; color:#fff; cursor:pointer; font-size:20px;">&times;</span>
    <h3 style="color:#00d4ff; margin-top:0;">Callback Request</h3>
    <form action="https://formspree.io/f/xqezdlrb" method="POST" id="leadForm">
      <input type="text" name="name" placeholder="Full Name" required>
      <input type="tel" name="phone" placeholder="Mobile Number" required>
      <textarea name="reason" placeholder="Message? (e.g. GST/ITR)" rows="3" required></textarea>
      <button type="submit" class="callback-btn">Submit Now</button>
    </form>
  </div>
</div>

<script>
  function openModal() { document.getElementById('callbackModal').style.display = 'flex'; }
  function closeModal() { document.getElementById('callbackModal').style.display = 'none'; }

  const form = document.getElementById('leadForm');
  if(form){
    form.onsubmit = async (e) => {
      e.preventDefault();
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        alert("Success! Our expert will call you shortly.");
        form.reset();
        closeModal();
      }
    };
  }
</script>
`);
