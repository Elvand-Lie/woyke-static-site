import "server-only";
import { z } from "zod";

const databaseUrlSchema = z
  .string()
  .url()
  .refine(
    (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
  )
  .refine((value) => Boolean(new URL(value).password));

const supabaseServerEnvironmentSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
});

const serverEnvironmentSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  DATABASE_URL: databaseUrlSchema,
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .refine((value) => value === "" || value.startsWith("whsec_")),
  SMS_PROVIDER: z.string().min(1),
  EMAIL_PROVIDER: z.string().min(1),
  ANALYTICS_PROVIDER: z.string().min(1),
  KLAVIYO_PRIVATE_API_KEY: z.string().min(1).optional(),
  POSTHOG_KEY: z.string().min(1).optional(),
  POSTHOG_HOST: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
});

function rawServerEnvironment() {
  return {
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    SMS_PROVIDER: process.env.SMS_PROVIDER,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    ANALYTICS_PROVIDER: process.env.ANALYTICS_PROVIDER,
    KLAVIYO_PRIVATE_API_KEY: process.env.KLAVIYO_PRIVATE_API_KEY,
    POSTHOG_KEY: process.env.POSTHOG_KEY,
    POSTHOG_HOST: process.env.POSTHOG_HOST,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  };
}

export function getServerEnvironment() {
  return serverEnvironmentSchema.parse(rawServerEnvironment());
}

export function getSupabaseServerEnvironment() {
  return supabaseServerEnvironmentSchema.parse(rawServerEnvironment());
}

export function getServerEnvironmentStatus() {
  const environment = rawServerEnvironment();
  return {
    database: databaseUrlSchema.safeParse(environment.DATABASE_URL).success,
    supabase: z.string().min(1).safeParse(environment.SUPABASE_SECRET_KEY).success,
    stripe: z
      .string()
      .startsWith("sk_")
      .safeParse(environment.STRIPE_SECRET_KEY).success,
    stripeWebhook: z
      .string()
      .startsWith("whsec_")
      .safeParse(environment.STRIPE_WEBHOOK_SECRET).success,
    providers: {
      sms: environment.SMS_PROVIDER ?? "unconfigured",
      email: environment.EMAIL_PROVIDER ?? "unconfigured",
      analytics: environment.ANALYTICS_PROVIDER ?? "unconfigured",
    },
  };
}
