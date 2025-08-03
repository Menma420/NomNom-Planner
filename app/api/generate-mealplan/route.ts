import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { parse } from "path";
import { CacheService, CACHE_TTL, PerformanceMonitor } from "@/lib/redis";

// Initialize OpenAI client with OpenRouter API
const openAI = new OpenAI({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
})

// Initialize cache service and performance monitor
const cacheService = new CacheService();
const performanceMonitor = new PerformanceMonitor();

// API endpoint to generate personalized meal plans using AI
export async function POST(request: NextRequest){
    const startTime = Date.now();
    
    try{

        // Extract user preferences from request body
        const {dietType, calories, allergies, cuisines,snacks, days } = await request.json();

        // Create cache key based on user preferences
        const cacheKey = `mealplan:${dietType}:${calories}:${allergies}:${cuisines}:${snacks}:${days}`;

        // Check cache first
        const cachedMealPlan = await cacheService.get(cacheKey);
        if (cachedMealPlan) {
            return NextResponse.json({
                mealPlan: cachedMealPlan,
                cached: true,
                responseTime: Date.now() - startTime
            });
        }

        // Construct detailed prompt for AI nutritionist
        const prompt = `
      You are a professional nutritionist. Create a ${days}-day meal plan for an individual following a ${dietType} diet aiming for ${calories} calories per day.
      
      Allergies or restrictions: ${allergies || "none"}.
      Preferred cuisine: ${cuisines || "no preference"}.
      Snacks included: ${snacks ? "yes" : "no"}.
      
      For each day, provide:
        - Breakfast
        - Lunch
        - Dinner
        ${snacks ? "- Snacks" : ""}
      
      Use simple ingredients and provide brief instructions. Include approximate calorie counts for each meal.
      
      Structure the response as a JSON object where each day is a key, and each meal (breakfast, lunch, dinner, snacks) is a sub-key. Example:
      
      {
        "Monday": {
          "Breakfast": "Oatmeal with fruits - 350 calories",
          "Lunch": "Grilled chicken salad - 500 calories",
          "Dinner": "Steamed vegetables with quinoa - 600 calories",
          "Snacks": "Greek yogurt - 150 calories"
        },
        "Tuesday": {
          "Breakfast": "Smoothie bowl - 300 calories",
          "Lunch": "Turkey sandwich - 450 calories",
          "Dinner": "Baked salmon with asparagus - 700 calories",
          "Snacks": "Almonds - 200 calories"
        }
        // ...and so on for each day
      }

      Return just the json with no extra commentaries and no backticks.
    `;

    // Call OpenAI API to generate meal plan
    const response = await openAI.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7, // Controls creativity vs consistency
        max_tokens: 1500,
    })

    const aiContent = response.choices[0].message.content?.trim();

    let parsedMealPlan: {[day: string]: DailyMealPlan};

    // Parse and validate AI response
    try{
        if (!aiContent) {
            return NextResponse.json(
              { error: "AI did not return a valid response" },
              { status: 500 }
            );
          }
          
          parsedMealPlan = JSON.parse(aiContent);
          
    }catch(parseError){
        console.log("Error parsing AI response" + parseError);
        return NextResponse.json({error: "Failed to parse mealplan. PLease try again."}, {status: 500});
    }

    // Validate parsed meal plan structure
    if(typeof parsedMealPlan !== "object" || parsedMealPlan === null){
        return NextResponse.json({error: "Failed to parse mealplan. PLease try again."}, {status: 500});
    }

    // Cache the generated meal plan for 1 hour
    await cacheService.set(cacheKey, parsedMealPlan, CACHE_TTL.LONG);

    return NextResponse.json({
        mealPlan: parsedMealPlan,
        cached: false,
        responseTime: Date.now() - startTime
    });

    }catch(error: any){
        // console.log(error);
        return NextResponse.json({error: "Internal Server error"}, {status: 500});
    }
}


// TypeScript interface for daily meal structure
interface DailyMealPlan {
    Breakfast?: string,
    Lunch?: string,
    Dinner?: string,
    Snacks?: string,
}