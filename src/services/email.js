require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const Mailjet = require("node-mailjet");

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_APIKEY_PUBLIC,
  apiSecret: process.env.MAILJET_APIKEY_PRIVATE,
});

const orderConfirmation = require("../emailTemplates/orderConfirmation");

const to = {
  email: "ttosi519@gmail.com",
  name: "Tony",
};

const from = {
  email: "orders@desertdiceco.com",
  name: "Desert Dice COmpany",
};

const html = orderConfirmation({
  firstName: to.name,
  orderNumber: "#FDC000001",
});

const email = {
  send() {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            ...from,
          },
          To: [
            {
              ...to,
            },
          ],
          Subject: "Order Confirmation #FDC000001",
          HTMLPart: orderConfirmation({
            firstName: to.name,
            orderNumber: "#FDC000001",
          }),
        },
      ],
    });
    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

module.exports = email;
