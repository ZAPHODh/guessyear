import { type SubscriptionPlan } from "@/types";

export const freePlan: SubscriptionPlan = {
    name: "Free",
    description:
        "limited visualization of sumting, but you can create unlimited projects",
    stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "unlimited visualization of sumting, unlimited projects, and more",
    stripePriceId: process.env.STRIPE_PRO_PLAN_ID as string,
};