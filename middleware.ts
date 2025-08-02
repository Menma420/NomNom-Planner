import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/webhook(.*)",
  "/api/check-subscription(.*)",
  "/api/generate-mealplan(.*)",
]);

// Define sign-up routes for redirect logic
const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);

// Define meal plan routes that require active subscription
const isMealPlanRoute = createRouteMatcher(["/mealplan(.*)"]);

// Middleware to handle authentication and authorization
export default clerkMiddleware(async (auth,req) => {
  const userAuth = await auth();
  const {userId} = userAuth;
  const {pathname, origin} = req.nextUrl;

    // Allow subscription check API to pass through
    if(pathname === 'api/check-subscription'){
      return NextResponse.next();
    }

  // Redirect unauthenticated users to sign-up for protected routes
  if(!isPublicRoute(req) && !userId){
      return NextResponse.redirect(new URL("/sign-up", origin));
  }

  // Redirect authenticated users away from sign-up page
  if(isSignUpRoute(req) && userId){
      return NextResponse.redirect(new URL("/mealplan", origin));
  }

  // Check subscription status for meal plan access
  if(isMealPlanRoute(req) && userId){
    try{
      // Verify user has active subscription
      const response = await fetch(`${origin}/api/check-subscription?userId=${userId}`);

      const data = await response.json();

      // Redirect to subscribe page if no active subscription
      if(!data.subscriptionActive){
        return NextResponse.redirect(new URL("/subscribe", origin));
      }

    }catch(error: any){
      // Fallback redirect on error
      return NextResponse.redirect(new URL("/subscribe", origin));
    }
}

  return NextResponse.next();
});

// Configure middleware to run on specific routes
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};