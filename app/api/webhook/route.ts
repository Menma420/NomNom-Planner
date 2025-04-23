import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma"; // or wherever your prisma client is
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest){
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    console.log("⚡️ Incoming webhook payload:", body);  // <- Add this
    console.log("🧾 Signature header:", signature);       // <- And this

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event: Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(body, signature || "", webhookSecret );
        console.log("Event type:", event.type);

    }catch(error: any){
        return NextResponse.json({error: error.message}, {status: 400});
    }

    try{
        console.log("Received Stripe event:", event.type);


        switch(event.type){
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session)
                break
            }
    
            case "invoice.payment_failed": {
                const session = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentFailed(session)
                break
            }
    
            case "customer.subscription.deleted": {
                const session = event.data.object as Stripe.Subscription;
                await handleCustomerSubscriptionDeleted(session)
                break
            }
    
            default: 
                console.log("Unhandled event type: " + event.type); 
        }
    }catch(error: any){
        return NextResponse.json({error: error.message}, {status: 400});
    } 

    return NextResponse.json("ERRORRRRRRRRRRRRRRRRRRR");
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session){

    console.log("CHECKOUT SESSION COMPLETED:");

    const userId = session.metadata?.clerkUserId;

    if(!userId){
        console.log("No userId");
        return;
    }

    const subscriptionId = session.subscription as string;

    if(!subscriptionId){
        console.log("No sub Id");
        return;
    }

    try{
        console.log("Webhook triggered: checkout.session.completed");
        console.log("Metadata:", session.metadata);

        await prisma.profile.update({
            where: {userId},
            data: {
                stripeSubscriptionId: subscriptionId,
                subscriptionActive: true,
                subscriptionTier: session.metadata?.planType || null,
            }
        })
        console.log(`Subscription activated for user: ${userId}`);
    }catch(error: any){
        console.log(error.message);
        console.error("Update failed", error);
    }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice){
    const subId = invoice.subscription as string;

    if(!subId){
        return;
    }

    let userId: string | undefined ;

    try{
        const profile = await prisma.profile.findUnique({
            where: {
                stripeSubscriptionId: subId
            }, select: {
                userId: true
            }
        });

        if(!profile?.userId){
            console.log("NO user profile");
            return;
        }

        userId = profile.userId;

    }catch(error: any){
        console.log(error.message);
    }

    try{
        await prisma.profile.update({
            where: {userId: userId},
            data: {subscriptionActive: false},
        })
    }catch(error: any){
        console.log(error.message);
    }
}

async function handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription){
    const subId = subscription.id

    if(!subId){
        return;
    }

    let userId: string | undefined ;

    try{
        const profile = await prisma.profile.findUnique({
            where: {
                stripeSubscriptionId: subId
            }, select: {
                userId: true
            }
        });

        if(!profile?.userId){
            console.log("NO user profile");
            return;
        }

        userId = profile.userId;

    }catch(error: any){
        console.log(error.message);
    }

    try{
        await prisma.profile.update({
            where: {userId: userId},
            data: {
                subscriptionActive: false,
                stripeSubscriptionId: null,
                subscriptionTier: null,
            },
        })
    }catch(error: any){
        console.log(error.message);
    }
}