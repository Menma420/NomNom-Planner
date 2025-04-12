import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import {stripe} from "@/lib/stripe";
import { getPriceIDFromType } from "@/lib/plans";

export async function POST(request: NextRequest){ 

    try{
        const clerkUser = await currentUser(); //used for server side 

        if(!clerkUser){
            return NextResponse.json({error: "Unauthorized"}, {status: 500});
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: clerkUser.id },
        })

        if(!profile){
            return NextResponse.json({error: "New plan is required."});
        }

        if(!profile.stripeSubscriptionId){
            return NextResponse.json({error: "No active subscription plan found."});
        }

        const subscriptionId = profile.stripeSubscriptionId;

        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        })

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