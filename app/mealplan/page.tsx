"use client"

import { FormEvent } from "react"

interface MealPlanInput {
  dietType: string
  calories: number
  allergies: string
  cuisines: string
  snacks: string
  days?: number
}

export default function MealPlanDashboard() {
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

    console.log(payload)
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
                className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition duration-200"
              >
                Generate Meal Plan
              </button>
            </div>
          </form>
        </div>

        {/* Meal Plan Section */}
        <div className="bg-green-50 shadow-inner rounded-2xl p-8 border border-green-200">
          <h1 className="text-3xl font-bold mb-4 text-green-700">Weekly Meal Plan</h1>
          <p className="text-green-700 italic">
            Your personalized meal plan will appear here after submission.
          </p>
        </div>
      </div>
    </div>
  )
}
