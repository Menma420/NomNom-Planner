"use client";

import { Spinner } from "@/components/spinner";
import { useUser } from "@clerk/nextjs";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { availablePlans } from "@/lib/plans";
import { useState } from "react";
import { useRouter } from "next/navigation";

async function fetchSubscriptionStatus() {
  const response = await fetch("/api/profile/subscription-status");
  return response.json();
}

async function updatePlan(newplan: string) {
  const response = await fetch("/api/profile/change-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newplan }),
  });
  return response.json();
}

async function unSubscribe() {
    const response = await fetch("/api/profile/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
}

export default function Profile() {

  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: updatedPlan,
    mutate: updatePlanMutation,
    isPending: isUpdatePlanPending,
  } = useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      toast.success("subscription plan updated successfully!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update the plan.");
    },
  });


  const {
    data: canceledPlan,
    mutate: unsubscribeMutation,
    isPending: isUnsubscribePending,
  } = useMutation({
    mutationFn: unSubscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["subscription"]});
      router.push("/subscribe");
    },
    onError: () => {
      toast.error("Error unsubscribing.");
    },
  });

  const currentPlan = availablePlans.find(
    (plan) => plan.interval === subscription?.subscription.subscriptionTier
  );

  function handleUpdatePlan() {
    if (selectedPlan) {
      updatePlanMutation(selectedPlan);
      setSelectedPlan("");
    }
  }

  function handleUnsubscribe(){
    if(confirm("Are you sure you want to unsubscribe? You will lose access to premium features.")){
        unsubscribeMutation();
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <Spinner />
        <span className="text-green-700 font-medium">Loading...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 md:px-12 bg-white min-h-screen text-green-900">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Profile Card */}
        <div className="bg-green-50 rounded-2xl border border-green-200 shadow p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {user.imageUrl && (
            <Image
              src={user.imageUrl}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full border border-green-300"
            />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">
              {user.firstName ?? "First"} {user.lastName ?? "Last"}
            </h1>
            <p className="text-sm text-green-700">
              {user.primaryEmailAddress?.emailAddress ?? "Email not available"}
            </p>
          </div>
        </div>
  
        {/* Subscription Details */}
        <div className="bg-green-100 rounded-2xl border border-green-300 shadow p-6 md:p-10">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Subscription Details</h2>
          {isLoading ? (
            <div className="flex items-center space-x-2 text-green-700">
              <Spinner />
              <span>Loading subscription details...</span>
            </div>
          ) : isError ? (
            <p className="text-red-600">{error.message}</p>
          ) : subscription ? (
            currentPlan ? (
              <div className="space-y-2">
                <p>
                  <strong>Plan:</strong> {currentPlan.name}
                </p>
                <p>
                  <strong>Amount:</strong> {currentPlan.amount} {currentPlan.currency}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600 font-semibold">ACTIVE</span>
                </p>
              </div>
            ) : (
              <p className="text-yellow-700">Current Plan not found.</p>
            )
          ) : (
            <p className="text-gray-700">You are not subscribed to any plan.</p>
          )}
        </div>
  
        {/* Change Plan */}
        <div className="bg-green-50 rounded-2xl border border-green-200 shadow p-6 md:p-10">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Change Subscription Plan</h3>
  
          {currentPlan && (
            <>
              <select
                className="w-full border border-green-300 rounded-xl px-4 py-2 text-green-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                defaultValue={currentPlan.interval}
                disabled={isUpdatePlanPending}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedPlan(event.target.value)
                }
              >
                <option value="" disabled>
                  Select a new plan
                </option>
                {availablePlans.map((plan, key) => (
                  <option key={key} value={plan.interval}>
                    {plan.name} – {plan.amount} {plan.currency}
                  </option>
                ))}
              </select>
  
              <button
                onClick={handleUpdatePlan}
                disabled={
                  isUpdatePlanPending ||
                  !selectedPlan ||
                  selectedPlan === currentPlan.interval
                }
                className="mt-4 px-6 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
  
              {isUpdatePlanPending && (
                <div className="flex items-center gap-2 mt-3 text-green-700">
                  <Spinner />
                  <span>Updating Plan...</span>
                </div>
              )}
            </>
          )}
        </div>
  
        {/* Unsubscribe Section */}
        <div className="bg-green-100 rounded-2xl border border-green-300 shadow p-6 md:p-10">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Unsubscribe</h3>
          <p className="text-sm text-green-700 mb-4">
            If you'd like to cancel your current subscription, you can do so below.
          </p>
          <button
            onClick={handleUnsubscribe}
            disabled={isUnsubscribePending}
            className="px-6 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {isUnsubscribePending ? "Unsubscribing..." : "Unsubscribe"}
          </button>
        </div>
      </div>
    </div>
  );  
}
