"use client"


import { availablePlans } from "@/lib/plans";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast, {Toast, Toaster} from "react-hot-toast"


type SubscribeResponse = {
    url: string; 
}

type SubscribeError = {
    error: string;
};

async function subscribeToPlan(planType: string, userId: string, email: string):
 Promise<SubscribeResponse>{

    const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            planType,
            userId,
            email,
        }),
    })

    if(!response.ok){
        const errorData: SubscribeError = await response.json();

        throw new Error(errorData.error || "Something went wrong");
    }

    const data: SubscribeResponse = await response.json();

    return data;
}

export default function Subscribe() {

    const {user} = useUser();
    const router = useRouter();

    const userId = user?.id;
    const email = user?.emailAddresses[0].emailAddress || "";

    const {mutate, isPending} = useMutation<SubscribeResponse, Error, {planType: string}>({
        mutationFn: async ({planType}) => {
            if(!userId) {
                throw new Error("User not signed in");
            }

            return subscribeToPlan(planType, userId, email);
        },

        onMutate() {
            toast.loading("Processing your subscription...");
        },

        onSuccess: (data) => {
            window.location.href = data.url;
        },

        onError: () => {
            toast.error("Something went wrong");
        }
    });


    function handleSubscribe(planType: string){
        if(!userId){
            router.push("/sign-up");
            return;
        }

        mutate({planType});
    }

    return (
        <>
        <Toaster position="top-center" />
        <div className="flex flex-col items-center justify-center px-6 py-12">
            {/* Title Section */}
            <div className="text-center mt-2">
                <h2 className="text-4xl font-bold">Pricing Plans</h2>
                <p className="text-gray-600 mt-2 text-lg">
                    Start with a weekly plan or upgrade when you're ready.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {availablePlans.map((plan, key) => (
                    <div 
                        key={key} 
                        className={`w-full md:w-[380px] p-8 bg-white shadow-xl rounded-2xl border ${
                            plan.isPopular ? "border-green-500" : "border-gray-300"
                        }`}
                    >
                        {/* Badge for Popular Plan */}
                        {plan.isPopular && (
                            <div className="bg-green-500 text-white text-sm font-semibold py-1 px-4 rounded-full mb-3 inline-block">
                                Most Popular
                            </div>
                        )}

                        {/* Plan Details */}
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <p className="text-gray-600 text-base mt-2">{plan.description}</p>

                        <p className="text-3xl font-bold mt-4">
                            ${plan.amount} <span className="text-lg text-gray-500">/{plan.interval}</span>
                        </p>

                        {/* Features List */}
                        <ul className="mt-6 space-y-3 text-gray-700">
                            {plan.features.map((feature, key) => (
                                <li key={key} className="flex items-center space-x-3 text-base">
                                    <span className="text-green-500 text-lg">✔</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Subscribe Button */}
                        <button 
                            className="w-full mt-6 py-4 px-5 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-lg"
                            onClick={() => handleSubscribe(plan.interval)}
                            disabled={isPending}
                        >
                            {isPending ? "Please wait..." : `Subscribe ${plan.name}`}
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}
