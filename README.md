# 🍽️ NomNom Planner – AI-Powered Meal Planning SaaS

**NomNom Planner** is an intelligent, full-stack SaaS application that helps users generate customized meal plans based on dietary preferences, health goals, and lifestyle choices. Designed with scalability and performance in mind, it combines modern frontend tech with powerful AI capabilities, seamless user authentication, and Stripe-powered billing.

Built with **Next.js 14+**, **React**, **TypeScript**, and **Tailwind CSS**, the platform delivers a polished, responsive, and user-friendly experience from login to AI meal planning.

---

## ✨ Core Features

- 🔐 **Clerk Authentication** – Secure login, sign-up, and profile management
- 💳 **Stripe Subscriptions** – Weekly/Monthly/Annual billing with real-time subscription status
- 🧠 **AI-Powered Meal Planning** – Personalized meal plans using OpenAI (extendable)
- 🎨 **Modern UI** – Built with Tailwind CSS for a clean and responsive design
- ⚡ **Next.js App Router** – High-performance routing with server-side rendering
- 🧭 **Fully Type-Safe** – End-to-end TypeScript ensures reliability
- 📡 **React Query** – Instant client-side state and data synchronization
- 📈 **Dynamic Plan Management** – Upgrade, downgrade, and unsubscribe flows
- 🔧 **Secure API Routes** – Role-based access and API logic behind Clerk-authenticated routes

---

## 🧠 Modular AI Tools

NomNom Planner uses a **modular AI tool design**, meaning you can easily plug in and expand capabilities. Examples include:

- **🍱 Meal Plan Generator**  
  Takes dietary preferences, caloric goals, and meals per day to generate a full plan.

- **🛒 Grocery List Generator** *(in progress)*  
  Converts a week's meal plan into a smart, categorized shopping list.

- **📆 Weekly Planner Export** *(in progress)*  
  Export AI-generated plans into printable PDFs or calendar format.

- **🧩 Easily Extendable**  
  Add new AI tools by:
  - Creating an API handler (`/api/ai/[tool]`)
  - Designing a frontend input form
  - Connecting it with OpenAI or your custom logic
  - Restricting access to subscribers if needed

---

## 🔧 Tech Stack

| Layer | Tech |
|------|------|
| Frontend | Next.js (App Router), React, TypeScript Tailwind CSS |
| Backend | API Routes (Edge & Serverless support) |
| Auth | [Clerk.dev](https://clerk.dev) |
| Payments | [Stripe](https://stripe.com) + Webhooks |
| AI | OpenAI API (modular, pluggable) |
| ORM | Prisma |
| Database | PostgreSQL via [Neon Console](https://neon.tech) |
| State Management | React Query |
| Deployment | Vercel |

---

## 📦 Installation

```bash
git clone https://github.com/Menma420/NomNom-Planner.git
cd NomNom-Planner
npm install
```

---

## 🛠️ Environment Variables

Create a `.env.local` and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_neon_postgres_connection
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Development

```bash
npm run dev
```

Open `http://localhost:3000` to explore the app locally.

---

## ✅ Completed Functionality

- ✅ User Registration/Login via Clerk
- ✅ Profile Page w/ Subscription Status
- ✅ Upgrade / Downgrade / Cancel Plans
- ✅ Stripe Webhook for Syncing Subscriptions
- ✅ AI Tool: Meal Plan Generator (OpenAI)
- ✅ Loading/Toaster Components
- ✅ Protected Routes (based on plan access)

---

## 🔜 In Progress / Planned

- 🚧 Admin Dashboard
- 🚧 Grocery List AI Tool
- 🚧 PDF/Calendar Exporter
- 🚧 Usage Analytics & Tokens
- 🚧 Public Tool Marketplace

---

## 🧠 Add Your Own AI Tool

Want to expand the platform?

1. Create a new route in `/api/ai/tool-name.ts`
2. Add a form or UI in `/components/tools/`
3. Use `fetch('/api/ai/tool-name', { method: "POST", body })`
4. Return data and display it in your component
5. Lock access via subscription tier if needed

---

## 📫 Feedback & Contact

If you enjoyed this or want to contribute, reach out:

- [Uttkarsh Malviya](https://www.linkedin.com/in/uttkarsh-malviya-373231130/)
- [Menma420](https://github.com/Menma420)

---

## 🌟 Show Your Support

Leave a ⭐ on GitHub if you find NomNom Planner useful or inspiring!

---
