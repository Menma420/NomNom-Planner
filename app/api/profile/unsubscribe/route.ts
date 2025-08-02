import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import {stripe} from "@/lib/stripe";
import { getPriceIDFromType } from "@/lib/plans";

// API endpoint to cancel user subscription
export async function POST(request: NextRequest){ 

    try{
        // Get authenticated user from Clerk (server-side)
        const clerkUser = await currentUser();

        if(!clerkUser){
            return NextResponse.json({error: "Unauthorized"}, {status: 500});
        }

        // Find user profile in database
        const profile = await prisma.profile.findUnique({
            where: { userId: clerkUser.id },
        })

        if(!profile){
            return NextResponse.json({error: "New plan is required."});
        }

        // Check if user has an active subscription
        if(!profile.stripeSubscriptionId){
            return NextResponse.json({error: "No active subscription plan found."});
        }

        const subscriptionId = profile.stripeSubscriptionId;

        // Cancel subscription in Stripe (keeps active until end of billing period)
        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        })

        // Update user profile to reflect canceled subscription
        await prisma.profile.update({
            where: {userId: clerkUser.id},
            data: {
                subscriptionTier:null,
                stripeSubscriptionId: null,
                subscriptionActive: false,
            }
        })

        return NextResponse.json({subscription: canceledSubscription});

    }catch(error: any){
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}