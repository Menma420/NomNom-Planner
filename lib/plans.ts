// TypeScript interface for subscription plan structure
export interface Plan {
    name: string;
    amount: number;
    currency: string;
    interval: string;
    isPopular?: boolean;
    description: string;
    features: string[];
}

// Available subscription plans with pricing and features
export const availablePlans:Plan[] = [
    {
        name: "Weekly Plan",
        amount: 9.99,
        currency: "USD",
        interval: "week",
        description: "Great to start before commiting",
        features: [
            "Unlimited AI Meal Plans",
            "AI Nutrition insights",
            "Cancel anytime",
        ],
    },
    {
        name: "Monthly Plan",
        amount: 39.99,
        currency: "USD",
        interval: "month",
        isPopular: true, // Highlighted as popular choice
        description: "Perfect for ongoing, month-to-month meal planning and features",
        features: [
            "Unlimited AI Meal Plans",
            "Priority AI support",
            "Cancel anytime",
        ],
    },
    {
        name: "Yearly Plan",
        amount: 299.99,
        currency: "USD",
        interval: "year",
        description: "Best value for those commited to improving their diet long-term",
        features: [
            "Unlimited AI Meal Plans",
            "All premium features",
            "Cancel anytime",
        ],
    },
]

// Map plan intervals to Stripe price IDs for checkout
const priceIDMap: Record<string,string> = {
    week:process.env.STRIPE_PRICE_WEEKLY!,
    month:process.env.STRIPE_PRICE_MONTHLY!,
    year:process.env.STRIPE_PRICE_YEARLY!,
}

// Helper function to get Stripe price ID from plan type
export const getPriceIDFromType = (planType: string) => {
    return priceIDMap[planType]
}