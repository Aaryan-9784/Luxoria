/**
 * Luxoria — Official Receipt Generator
 *
 * Single source of truth for the branded PDF receipt.
 * Used by BookingSuccessPage and UserInvoices.
 *
 * @param {Object} data
 * @param {string} data.bookingRef       — booking reference ID  e.g. "LUX-C0D31F"
 * @param {string} data.dateIssued       — formatted date string e.g. "05 Jul 2026"
 * @param {string} data.tripStart        — formatted start date
 * @param {string} data.tripEnd          — formatted end date
 * @param {number|string} data.totalDays — trip duration in days
 * @param {string} data.pickupLocation   — pickup city / location
 * @param {string} data.guestName        — billed-to full name
 * @param {string} data.guestEmail       — billed-to email
 * @param {string} data.vehicleName      — vehicle display name  e.g. "296 GTB"
 * @param {string} data.vehicleBrand     — vehicle brand name  e.g. "Ferrari"
 * @param {string} data.vehicleTransmission — e.g. "Automatic"
 * @param {number} data.amountUsd        — total amount in USD (number)
 * @param {number} data.amountInr        — pre-converted INR amount (number)
 */
export function openLuxoriaReceipt(data) {
  const {
    bookingRef,
    dateIssued,
    tripStart,
    tripEnd,
    totalDays,
    pickupLocation,
    guestName,
    guestEmail,
    vehicleName,
    vehicleBrand = '',
    vehicleTransmission = 'Automatic',
    amountUsd,
    amountInr,
  } = data;

  const usdFormatted = `$${Number(amountUsd).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  const inrFormatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amountInr);
  const ref          = (bookingRef || '').toUpperCase();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Luxoria Receipt \u2014 ${ref}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ─── Page shell — A4 portrait ─── */
    .page {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: #ffffff;
      padding: 52px 60px 44px;
      display: flex;
      flex-direction: column;
    }

    /* ─── HEADER ─── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 20px;
    }
    .brand-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 34px;
      font-weight: 300;
      letter-spacing: 16px;
      color: #1a1a1a;
      text-transform: uppercase;
      line-height: 1;
    }
    .brand-sub {
      font-size: 7px;
      font-weight: 600;
      letter-spacing: 5.5px;
      text-transform: uppercase;
      color: #b8924a;
      margin-top: 8px;
    }
    .receipt-meta { text-align: right; }
    .receipt-label {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 4.5px;
      text-transform: uppercase;
      color: #aaaaaa;
    }
    .receipt-ref {
      font-size: 14px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: 0.5px;
      margin-top: 5px;
    }
    .receipt-date {
      font-size: 11px;
      font-weight: 400;
      color: #555555;
      margin-top: 3px;
    }
    .confirmed-line {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #16a34a;
      margin-top: 9px;
    }

    /* ─── GOLD RULE ─── */
    .gold-rule {
      height: 1.5px;
      background: linear-gradient(90deg, #b8924a 0%, #d4af6a 40%, #b8924a 100%);
    }

    /* ─── BILLED TO / VEHICLE ─── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid #e4e4e4;
    }
    .info-cell {
      padding: 20px 0 22px;
    }
    .info-cell:last-child {
      padding-left: 44px;
      border-left: 1px solid #e4e4e4;
    }
    .cell-label {
      font-size: 6.5px;
      font-weight: 700;
      letter-spacing: 3.5px;
      text-transform: uppercase;
      color: #b8924a;
      margin-bottom: 9px;
    }
    .cell-brand {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #b8924a;
      margin-bottom: 3px;
    }
    .cell-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.15;
    }
    .cell-detail {
      font-size: 10.5px;
      font-weight: 400;
      color: #777777;
      margin-top: 3px;
      line-height: 1.55;
    }

    /* ─── BOOKING DETAILS ─── */
    .section-title {
      font-size: 6.5px;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #aaaaaa;
      margin-top: 22px;
      margin-bottom: 6px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table tr {
      border-bottom: 1px solid #efefef;
    }
    .details-table tr:first-child {
      border-top: 1px solid #efefef;
    }
    .details-table td {
      padding: 10px 0;
      font-size: 11.5px;
    }
    .details-table .col-label {
      color: #888888;
      font-weight: 400;
      width: 44%;
    }
    .details-table .col-value {
      color: #1a1a1a;
      font-weight: 700;
      text-align: right;
    }

    /* ─── TOTAL AMOUNT BLOCK ─── */
    .amount-section {
      margin-top: 26px;
      background: #f5f4f1;
      border-radius: 5px;
      padding: 22px 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .amount-label-text {
      font-size: 6.5px;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #aaaaaa;
      margin-bottom: 9px;
    }
    .amount-usd {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 50px;
      font-weight: 300;
      color: #2e2e2e;
      line-height: 1;
      letter-spacing: -1px;
    }
    .amount-inr {
      font-size: 11px;
      font-weight: 500;
      color: #b8924a;
      margin-top: 6px;
    }
    .amount-right { text-align: right; }
    .captured-label {
      font-size: 7.5px;
      font-weight: 700;
      letter-spacing: 3.5px;
      text-transform: uppercase;
      color: #16a34a;
      margin-bottom: 7px;
    }
    .payment-via {
      font-size: 11px;
      font-weight: 400;
      color: #888888;
    }
    .razorpay-blue {
      color: #3b6de3;
      font-weight: 600;
    }

    /* ─── NOTE BOX ─── */
    .note-box {
      margin-top: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 14px 18px;
      font-size: 10.5px;
      font-weight: 400;
      color: #666666;
      line-height: 1.65;
    }
    .note-box strong { color: #1a1a1a; font-weight: 700; }
    .note-box a { color: #1a1a1a; font-weight: 700; text-decoration: none; }

    /* ─── PUSH FOOTER TO BOTTOM ─── */
    .spacer { flex: 1; min-height: 32px; }

    /* ─── FOOTER ─── */
    .footer-rule {
      height: 1px;
      background: #e0e0e0;
      margin-bottom: 14px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-brand {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 7px;
      text-transform: uppercase;
      color: #999999;
    }
    .footer-tagline {
      font-size: 8px;
      color: #bbbbbb;
      margin-top: 3px;
      letter-spacing: 0.3px;
    }
    .footer-page {
      font-size: 8.5px;
      color: #cccccc;
      letter-spacing: 0.5px;
      text-align: center;
    }
    .footer-right { text-align: right; }
    .footer-right p {
      font-size: 8.5px;
      color: #bbbbbb;
      line-height: 1.7;
    }
    .footer-right a {
      color: #bbbbbb;
      text-decoration: none;
    }

    @media print {
      @page { margin: 0; size: A4 portrait; }
      body  { margin: 0; }
      .page { width: 100%; min-height: 100vh; padding: 44px 56px 40px; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="brand-name">L U X O R I A</div>
      <div class="brand-sub">L U X U R Y &nbsp; V E H I C L E &nbsp; C O N C I E R G E</div>
    </div>
    <div class="receipt-meta">
      <div class="receipt-label">P A Y M E N T &nbsp; R E C E I P T</div>
      <div class="receipt-ref">REF &nbsp; ${ref}</div>
      <div class="receipt-date">DATE &nbsp; ${dateIssued}</div>
      <div class="confirmed-line">&#10003; &nbsp; C O N F I R M E D</div>
    </div>
  </div>

  <!-- GOLD DIVIDER -->
  <div class="gold-rule"></div>

  <!-- BILLED TO / VEHICLE -->
  <div class="info-grid">
    <div class="info-cell">
      <div class="cell-label">B I L L E D &nbsp; T O</div>
      <div class="cell-name">${guestName || 'Guest'}</div>
      <div class="cell-detail">${guestEmail || ''}</div>
      <div class="cell-detail">${pickupLocation || ''}</div>
    </div>
    <div class="info-cell">
      <div class="cell-label">V E H I C L E</div>
      ${vehicleBrand ? `<div class="cell-brand">${vehicleBrand}</div>` : ''}
      <div class="cell-name">${vehicleName || 'Luxury Vehicle'}</div>
      <div class="cell-detail">${vehicleTransmission}</div>
    </div>
  </div>

  <!-- BOOKING DETAILS -->
  <div class="section-title">B O O K I N G &nbsp; D E T A I L S</div>
  <table class="details-table">
    <tbody>
      <tr>
        <td class="col-label">Booking Reference</td>
        <td class="col-value">${ref}</td>
      </tr>
      <tr>
        <td class="col-label">Trip Period</td>
        <td class="col-value">${tripStart} &#x2192; ${tripEnd}</td>
      </tr>
      <tr>
        <td class="col-label">Duration</td>
        <td class="col-value">${totalDays} day${totalDays !== 1 ? 's' : ''}</td>
      </tr>
      <tr>
        <td class="col-label">Pickup Location</td>
        <td class="col-value">${pickupLocation}</td>
      </tr>
      <tr>
        <td class="col-label">Payment Method</td>
        <td class="col-value">Razorpay &#x2014; Online</td>
      </tr>
      <tr>
        <td class="col-label">Confirmed On</td>
        <td class="col-value">${dateIssued}</td>
      </tr>
    </tbody>
  </table>

  <!-- TOTAL AMOUNT -->
  <div class="amount-section">
    <div>
      <div class="amount-label-text">T O T A L &nbsp; A M O U N T &nbsp; P A I D</div>
      <div class="amount-usd">${usdFormatted}</div>
      <div class="amount-inr">&#x2248; &#x20B9;${inrFormatted}</div>
    </div>
    <div class="amount-right">
      <div class="captured-label">&#10003; &nbsp; P A Y M E N T &nbsp; C A P T U R E D</div>
      <div class="payment-via">Processed via <span class="razorpay-blue">Razorpay</span></div>
    </div>
  </div>

  <!-- NOTE -->
  <div class="note-box">
    <strong>Important:</strong> This is your official payment receipt for booking
    <strong>${ref}</strong>. Please retain this document for your records.
    For any queries, contact us at <a href="mailto:support@luxoria.in">support@luxoria.in</a>
  </div>

  <div class="spacer"></div>

  <!-- FOOTER -->
  <div class="footer-rule"></div>
  <div class="footer">
    <div>
      <div class="footer-brand">L U X O R I A</div>
      <div class="footer-tagline">Luxury Vehicle Concierge &nbsp;&#183;&nbsp; luxoria.in</div>
    </div>
    <div class="footer-page">Page 1 of 1</div>
    <div class="footer-right">
      <p>This is an official payment receipt.</p>
      <p><a href="mailto:support@luxoria.in">For support: support@luxoria.in</a></p>
    </div>
  </div>

</div>
<script>
  window.onload = function () {
    window.print();
    window.onafterprint = function () { window.close(); };
  };
</script>
</body>
</html>`;

  const win = window.open('', `Luxoria_Receipt_${ref}`, 'width=920,height=1060');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
