import "server-only";
import Stripe from "stripe";
import { getServerEnvironment } from "@/lib/env/server";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  stripeClient ??= new Stripe(getServerEnvironment().STRIPE_SECRET_KEY);
  return stripeClient;
}
