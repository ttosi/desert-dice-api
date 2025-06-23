# Desert Dice API

Backend RESTful API powering [Desert Dice Company](https://desertdiceco.com) — a small-batch resin dice maker crafting high-quality, handcrafted dice, cases, and accessories for tabletop gamers.

Built with:

- Node.js + Express
- SQLite3 (with raw SQL for full control)
- Stripe for payments
- Simple, secure architecture optimized for fast deployments and minimal server overhead

---

## 📦 Project Structure

```
desert-dice-api/
├── src/
│   ├── database/     # Database service and data
│   ├── templates/    # HTML templates used for customer email notifications
│   ├── routes/       # Modular Express routes
│   ├── services/     # Utility modules
├── public/images/    # Exposed static product images
├── .env
├── app.js
└── package.json
```

---

## 🌐 Key Endpoints

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/api/products`     | Fetch all products             |
| GET    | `/api/products/:id` | Fetch product by ID            |
| POST   | `/api/customers`    | Add/update customer + address  |
| POST   | `/api/orders`       | Submit an order                |
| POST   | `/api/checkout`     | Create Stripe checkout session |
| PATCH  | `/api/products`     | Update product data            |

---

## 🔐 Environment Variables

File: `.env.[dev|staging|dev]`

| Key                      | Description                         |
| ------------------------ | ----------------------------------- |
| `NODE_ENV`               | `dev`, `staging`, or `prod`         |
| `PORT`                   | Port to run the API (default: 3000) |
| `CORS_ORIGIN`            | CORS allowed origin(s)              |
| `DATABASE_PATH`          | Relative path to SQLite database    |
| `MAILJET_APIKEY_PUBLIC`  | Mailjet public API key              |
| `MAILJET_APIKEY_PRIVATE` | Mailjet private API key             |
| `STRIPE_PUB_KEY`         | Stripe public API key               |
| `STRIPE_SECRET_KEY`      | Stripe secret API key               |

---

## 📸 Static Assets

Product images are served from `/images/...`. Ensure images are stored in `public/images`.

---

## 🔧 Development Notes

- All queries are written in raw SQL for transparency and precision
- No ORM — intentionally kept simple for direct database control
- The frontend (Vue 3 app) [Desert Dice UI](https://github.com/ttosi/desert-dice-ui) consumes this API

---
