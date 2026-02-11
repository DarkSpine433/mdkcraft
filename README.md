# MDK Tech - Production-Ready IT Services Platform

Welcome to the **MDK Tech** official repository. This project is a highly customized, production-ready ecommerce and service management platform built on top of Payload CMS and Next.js.

It is designed for IT service providers who want to offer web development projects with interactive configuration, recurring maintenance subscriptions, and a professional client dashboard.

## 🚀 Key Features

- **Interactive Project Configurator**: A multi-step form at `/kontakt` that allows clients to "build" their website, selecting project types, page counts, design levels, and additional features with live price calculation.
- **Service Subscriptions**: Recurring billing integration via **Stripe** for hosting, maintenance, and support packages.
- **Client Dashboard**: A dedicated area for logged-in users to track their projects' progress, manage active services, and communicate via the support ticket system.
- **Support Ticket System**: In-platform communication between clients and admins, replacing messy email chains.
- **Cloudflare Turnstile**: Modern, user-friendly bot protection integrated into all public forms (Newsletter, Contact, Register).
- **MDK Tech "Dark Mode" Aesthetic**: A premium, high-tech design with neon accents and fluid animations.
- **Analytics & Tracking**: Built-in collections for tracking page views, user sessions, and conversion funnels.
- **Newsletter System**: Integrated subscription management with double opt-in support.

## 🛠️ Technical Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3.0
- **Database**: MongoDB (via Mongoose)
- **Styling**: Tailwind CSS & Framer Motion
- **Payments**: Stripe
- **Security**: Cloudflare Turnstile

## 📦 New Collections & Globals

### Collections
- **Projects**: Track client work status (Planning, Design, Dev, Testing, Completed) and progress percentage.
- **Subscription Plans**: Manage recurring service levels (e.g., Basic vs Pro Hosting).
- **Subscription Addons**: Individual service items like SSL certificates or support hours.
- **Configurator Options**: Manage the labels and prices used in the interactive `/kontakt` form.
- **Tickets**: Support system messages and priority management.
- **FAQ**: Knowledge base for self-service client support.

### Globals
- **Site Settings**: Centralized configuration for Turnstile keys and contact info.

## ⚙️ Setup & Configuration

1. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in the required keys:
   - `DATABASE_URL`: Your MongoDB connection string.
   - `PAYLOAD_SECRET`: A random string for Payload security.
   - `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOKS_SIGNING_SECRET`: For payments.
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` & `TURNSTILE_SECRET_KEY`: For bot protection.

2. **Installation**:
   ```bash
   pnpm install
   ```

3. **Development**:
   ```bash
   pnpm dev
   ```

4. **Stripe Webhooks**:
   To test subscriptions locally, use the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhooks
   ```

## 📈 Sales Funnel Flow

1. **Lead**: Client uses the `/kontakt` configurator.
2. **Inquiry**: Submission is saved in `Contact Inquiries`.
3. **Offer**: Admin reviews and contacts the client.
4. **Project**: Admin creates a `Project` and assigns it to the `User`.
5. **Subscription**: Client subscribes to a maintenance plan via their dashboard.

## 📄 License

MIT © MDK Tech
