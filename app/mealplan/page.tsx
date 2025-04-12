"use client"

import { Spinner } from "@/components/spinner"
import { dataTagSymbol, useMutation } from "@tanstack/react-query"
import { FormEvent } from "react"

interface MealPlanInput {
  dietType: string
  calories: number
  allergies: string
  cuisines: string
  snacks: string
  days?: number
}

interface DailyMealPlan {
  Breakfast?: string,
  Lunch?: string,
  Dinner?: string,
  Snacks?: string,
}

interface WeeklyMealPlan {
  [day: string]: DailyMealPlan;
}

interface MealPlanResponse {
  mealPlan?: WeeklyMealPlan,
  error?: string;
}


async function generateMealPlan(payload: MealPlanInput){
  const response = await fetch("/api/generate-mealplan", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData: MealPlanResponse = await response.json();
    throw new Error(errorData.error || "Failed to generate meal plan.");
  }

  return response.json();
}


export default function MealPlanDashboard() {

  const {mutate, isPending, data, isSuccess} = useMutation<MealPlanResponse, Error, MealPlanInput>({
    mutationFn: generateMealPlan,
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const payload: MealPlanInput = {
      dietType: formData.get("dietType")?.toString() || "",
      calories: Number(formData.get("calories")) || 2000,
      allergies: formData.get("allergies")?.toString() || "",
      cuisines: formData.get("cuisines")?.toString() || "",
      snacks: formData.get("snacks")?.toString() || "",
      days: 7,
    }

    mutate(payload);
  }

  const daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  
  const getMealPlanForDay = (day: string): DailyMealPlan | undefined => {

    if(!data?.mealPlan){
      return undefined;
    }

    return data?.mealPlan[day];
  }

  return (
    <div className="pt-24 px-8 bg-white min-h-screen text-green-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form Section */}
        <div className="bg-white shadow-md rounded-2xl p-8 border border-green-200">
          <h1 className="text-3xl font-bold mb-6 text-green-700">AI Meal Generator</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="dietType" className="block font-medium mb-1">
                Diet Type
              </label>
              <input
                type="text"
                id="dietType"
                name="dietType"
                required
                placeholder="e.g. Vegan, Keto, Vegetarian..."
                className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label htmlFor="calories" className="block font-medium mb-1">
                Daily Calorie Goal
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                required
                min={500}
                max={15000}
                placeholder="e.g. 2000"
                className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label htmlFor="allergies" className="block font-medium mb-1">
                Allergies
              </label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                required
                placeholder="e.g. nuts, milk, none"
                className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label htmlFor="cuisines" className="block font-medium mb-1">
                Preferred Cuisine
              </label>
              <input
                type="text"
                id="cuisines"
                name="cuisines"
                required
                placeholder="e.g. Italian, Indian, Chinese..."
                className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="snacks"
                name="snacks"
                className="text-green-600 focus:ring-green-500"
              />
              <label htmlFor="snacks" className="text-sm">
                Include Snacks
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition duration-200"
              >
                { isPending? "Generating..." : "Generate Meal Plan"}
              </button>
            </div>
          </form>
        </div>

        {/* Meal Plan Section */}
        <div className="bg-green-50 shadow-inner rounded-2xl p-8 border border-green-200">
          <h1 className="text-3xl font-bold mb-4 text-green-700">Weekly Meal Plan</h1>
          {isPending ? (
            <div className="flex justify-center items-center h-32">
              <div className="h-10 w-10">
                <Spinner />
              </div>
            </div>
          ) : data?.mealPlan && isSuccess ? (
            <div>
              <div>
                {daysOfTheWeek.map((day, key) => {
                  const mealplan = getMealPlanForDay(day)
                  return (
                    <div key={key} className="mb-6">
  <h3 className="text-xl font-semibold text-green-700 mb-2">{day}</h3>
  {mealplan ? (
    <div className="space-y-2 p-4 bg-white border border-green-200 rounded-xl shadow-sm">
      <div>
        <span className="font-medium text-green-800">Breakfast:</span>{" "}
        <span className="text-green-900">{mealplan.Breakfast}</span>
      </div>
      <div>
        <span className="font-medium text-green-800">Lunch:</span>{" "}
        <span className="text-green-900">{mealplan.Lunch}</span>
      </div>
      <div>
        <span className="font-medium text-green-800">Dinner:</span>{" "}
        <span className="text-green-900">{mealplan.Dinner}</span>
      </div>
      {mealplan.Snacks && (
        <div>
          <span className="font-medium text-green-800">Snacks:</span>{" "}
          <span className="text-green-900">{mealplan.Snacks}</span>
        </div>
      )}
    </div>
  ) : (
    <p className="text-sm text-gray-500">No meal plan available.</p>
  )}
</div>

                  )
                })}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Please generate a meal plan.</p>
          )}

        </div>
      </div>
    </div>
  )
}
