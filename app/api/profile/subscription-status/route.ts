import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { subscribe } from "diagnostics_channel";

export async function GET(){

    try{
        const clerkUser = await currentUser(); //used for server side 

        if(!clerkUser){
            return NextResponse.json({error: "Unauthorized"}, {status: 500});
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: clerkUser.id },
            select: { subscriptionTier: true},
        })

        if(!profile){
            return NextResponse.json({error: "No Profile found"});
        }

        return NextResponse.json({subscription: profile});

    }catch(error: any){
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}