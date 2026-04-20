# Velora Wallet API

Base URL: `http://localhost:4000/api`

Authentication:
- Session JWT is stored in an `httpOnly` cookie after login or registration.
- Fetch `GET /auth/csrf-token` first and send the returned value in `X-CSRF-Token` for every state-changing request.

Key endpoints:
- `GET /health`
- `GET /auth/csrf-token`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /dashboard/summary`
- `GET /transactions`
- `POST /transactions/send`
- `POST /transactions/request`
- `POST /transactions/requests/:id/pay`
- `POST /transactions/qr/generate`
- `POST /transactions/qr/process`
- `GET /cards`
- `POST /cards`
- `DELETE /cards/:id`
- `GET /profile`
- `PATCH /profile`
- `GET /settings`
- `PATCH /settings`
- `GET /notifications`
- `PATCH /notifications/read-all`
- `PATCH /notifications/:id/read`
- `GET /users/search?q=avery`

Example payloads:

`POST /auth/register`
```json
{
  "name": "Avery Quinn",
  "username": "avery",
  "email": "avery@example.com",
  "password": "Velora123!"
}
```

`POST /transactions/send`
```json
{
  "recipient": "mila@example.com",
  "amount": 84,
  "category": "food",
  "note": "Dinner split"
}
```

`POST /transactions/request`
```json
{
  "requestFrom": "@jordane",
  "amount": 680,
  "category": "housing",
  "note": "Studio share"
}
```

`POST /transactions/qr/process`
```json
{
  "payload": "{\"recipientId\":\"...\",\"username\":\"avery\"}",
  "amount": 25,
  "category": "other",
  "note": "Quick pay"
}
```

Response shapes:
- Auth routes return `{ user }`
- Dashboard returns `{ balance, cards, recentTransactions, analytics }`
- Transactions list returns `{ transactions, pendingRequests }`
- Notifications returns `{ notifications }`
