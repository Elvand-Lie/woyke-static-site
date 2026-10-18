import "server-only";
import { randomUUID } from "node:crypto";
import { getServerEnvironment } from "@/lib/env/server";

export type ProviderMessage = { to: string; template: string; variables: Record<string, string> };
export type ProviderResult = { provider: string; messageId: string; mode: "mock" | "live" };

export async function sendEmail(message: ProviderMessage): Promise<ProviderResult> {
  const environment = getServerEnvironment(); const provider = environment.EMAIL_PROVIDER;
  if (provider === "mock") return { provider, messageId: `mock-email-${randomUUID()}`, mode: "mock" };
  if (provider !== "klaviyo" || !environment.KLAVIYO_PRIVATE_API_KEY) throw new Error(`EMAIL_PROVIDER_UNAVAILABLE:${provider}`);
  const uniqueId = randomUUID();
  const response = await fetch("https://a.klaviyo.com/api/events", {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${environment.KLAVIYO_PRIVATE_API_KEY}`,
      accept: "application/vnd.api+json",
      "content-type": "application/vnd.api+json",
      revision: "2026-04-15",
    },
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          properties: message.variables,
          time: new Date().toISOString(),
          unique_id: uniqueId,
          metric: { data: { type: "metric", attributes: { name: message.template } } },
          profile: { data: { type: "profile", attributes: { email: message.to } } },
        },
      },
    }),
  });
  if (!response.ok) throw new Error(`KLAVIYO_EVENT_FAILED:${response.status}`);
  return { provider, messageId: uniqueId, mode: "live" };
}

export async function sendSms(message: ProviderMessage): Promise<ProviderResult> {
  const provider = getServerEnvironment().SMS_PROVIDER;
  if (provider !== "mock") throw new Error(`SMS_PROVIDER_HANDLED_BY_SUPABASE:${provider}`);
  void message;
  return { provider, messageId: `mock-sms-${randomUUID()}`, mode: "mock" };
}

export async function captureAnalytics(event: string, properties: Record<string, string>) {
  const environment = getServerEnvironment(); const provider = environment.ANALYTICS_PROVIDER;
  if (provider === "mock" || provider === "disabled") return { provider, accepted: provider === "mock" };
  if (provider !== "posthog" || !environment.POSTHOG_KEY || !environment.POSTHOG_HOST) throw new Error(`ANALYTICS_PROVIDER_UNAVAILABLE:${provider}`);
  const response = await fetch(`${environment.POSTHOG_HOST.replace(/\/$/, "")}/capture/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ api_key: environment.POSTHOG_KEY, event, properties: { ...properties, distinct_id: "woyke-server" }, timestamp: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error(`POSTHOG_CAPTURE_FAILED:${response.status}`);
  return { provider, accepted: true };
}