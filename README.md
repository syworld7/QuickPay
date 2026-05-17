```md
# QuickPay 💳

QuickPay is a modern payment checkout and transaction dashboard built using React + TypeScript + Vite.

The project focuses on:
- Secure payment processing
- Clean UI/UX
- Transaction analytics
- API integration
- Responsive design

---

# 🌐 Live Demo

👉 https://quickpays.netlify.app/

---

# 🚀 Features

## ✅ Payment Checkout

- Card holder details collection
- Secure card number handling
- Card masking support
- CVV masking
- Currency & amount support
- Billing address & phone input
- Country selection
- Responsive checkout UI

### Security Features

- Luhn Algorithm validation
- HMAC-SHA256 hash generation
- Secure API request handling
- Sensitive data masking

---

## 📊 Dashboard

- Total Transactions
- Successful Payments
- Failed & Pending Payments
- Success Volume Metrics
- Currency Distribution
- Transaction Status Breakdown
- Transaction History Table

---

## 📈 Charts Included

- Doughnut Chart
- Line Chart
- Transaction Analytics
- Currency Distribution

---

# 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React | Frontend UI |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router | Routing |
| Chart.js / Recharts | Charts |
| Axios / Fetch API | API Calls |

---

# 📂 Project Structure

```bash
src/
├── components/
├── pages/
├── routes/
├── services/
├── hooks/
├── utils/
├── types/
└── constants/

```

---

# 🔗 API Integration

### Initiate Payment

```http
POST /initiate-payment

```

### Fetch Transactions

```http
GET /transactions?page=1&limit=100

```

---

# 🔐 Hash Generation

The payment request uses a secure `HMAC-SHA256` hash.

Steps:

1. Extract first 6 and last 4 digits
2. Reverse values
3. Reverse email
4. Build message
5. Convert to uppercase
6. Encrypt using `AXI2026`

---

# 🧾 Routes


| Route        | Description           |
| ------------ | --------------------- |
| `/`          | Checkout Page         |
| `/dashboard` | Transaction Dashboard |
| `*`          | 404 Page              |


---

# 🚀 Getting Started

Follow these steps to run the project locally on your machine.

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/syworld7/quickpay.git

```

---

## 2️⃣ Navigate to Project Folder

```bash
cd quickpay

```

---

## 3️⃣ Install Dependencies

Using pnpm:

```bash
pnpm install

```

OR using npm:

```bash
npm install

```

---

## 4️⃣ Start Development Server

Using pnpm:

```bash
pnpm dev

```

OR using npm:

```bash
npm run dev

```

---

## 5️⃣ Open in Browser

Visit:

```text
http://localhost:5173

```

---

# 🏗️ Build for Production

Using pnpm:

```bash
pnpm build

```

OR using npm:

```bash
npm run build

```

---

# 🔍 Preview Production Build

Using pnpm:

```bash
pnpm preview

```

OR using npm:

```bash
npm run preview

```

---

# 🌍 Deployment

The project is deployed on **Netlify**.

Live URL:  
👉 [https://quickpays.netlify.app/](https://quickpays.netlify.app/)

---

# ✨ Highlights

- Fully Responsive
- Clean Modern UI
- Secure Payment Flow
- API Integration
- Dashboard Analytics
- TypeScript Support
- Production Ready Structure

---

# 👨‍💻 Author

GitHub: [https://github.com/syworld7](https://github.com/syworld7)



