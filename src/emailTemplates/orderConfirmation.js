function orderConfirmation({ firstName, orderNumber }) {
  return `
   <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Georgia', serif;
        background-color: #f7f4ef;
        color: #2c1b10;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border: 1px solid #e2d8c5;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      }
      .header {
        background-color: #523c2c;
        color: #fcefdc;
        padding: 20px;
        text-align: center;
        font-family: 'Cinzel', serif;
        font-size: 24px;
      }
      .content {
        padding: 24px;
      }
      .section {
        margin-bottom: 24px;
      }
      .label {
        font-weight: bold;
      }
      .order-items {
        width: 100%;
        border-collapse: collapse;
      }
      .order-items th, .order-items td {
        border-bottom: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .totals td {
        font-weight: bold;
        text-align: right;
        padding-top: 10px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        padding: 16px;
      }
      a {
        color: #3d1f00;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Your Quest Begins! 🧭<br/>
        Order #${orderNumber}
      </div>
      <div class="content">
        <div class="section">
          <p>Greetings ${firstName}!</p>
          <p>
            Thank you for choosing <strong>Desert Dice Co.</strong>! Your handcrafted treasures are being prepared in the forge and will soon be on their way.
          </p>
        </div>

        <div class="section">
          <p>
            You’ll receive another raven 🕊️ when your items ship. Until then, may your rolls be true and your enemies be few.
          </p>
          <p>
            Need help? Just reply to this message or <a href="mailto:support@desertdiceco.com">email our support team</a>.
          </p>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Desert Dice Co. • Handcrafted in the Southwest
      </div>
    </div>
  </body>
</html>
  `;
}

module.exports = orderConfirmation;
