import Stripe from "stripe";

// Initialize Stripe client with secret key for server-side operations
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)