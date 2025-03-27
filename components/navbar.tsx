"use client"


import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

export default function NavBar() {
    const {isLoaded, isSignedIn, user} = useUser();

    if(!isLoaded) return <p>Loading...</p> 

   return (
    <nav>
        <div>
            <Link href="/">
            <Image src="/logo.png" height={50} width={50} alt="logo"/>
            </Link>
        </div>

        <div>
            <SignedIn>
                <Link href="/mealplan">MealPlan</Link>
                {user?.imageUrl ? (
                    <Link href="/profile" >
                        <Image 
                            src={user.imageUrl} 
                            alt="Profile Picture" 
                            width={40} 
                            height={40}
                        /> </Link>
                        ) : (
                        <div></div>
                        ) }
            </SignedIn>

            <SignedOut>

            </SignedOut>
        </div>
    </nav>
   );
}