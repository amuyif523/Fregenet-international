type RequiredEnvName = 'DATABASE_URL' | 'JWT_SECRET' | 'ADMIN_PASSWORD';

type AuthEnv = {
  jwtSecret?: string;
  adminPassword?: string;
};

type StripeEnv = {
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  siteUrl?: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function missingVars(names: readonly string[]): string[] {
  return names.filter((name) => !readEnv(name));
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function requireEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function validateCriticalEnvOnStartup(): void {
  const alwaysRequired: RequiredEnvName[] = ['DATABASE_URL'];
  const productionRequired: RequiredEnvName[] = ['JWT_SECRET', 'ADMIN_PASSWORD'];

  const missingAlways = missingVars(alwaysRequired);
  if (missingAlways.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missingAlways.join(', ')}`);
  }

  if (isProduction()) {
    const missingProd = missingVars(productionRequired);
    if (missingProd.length > 0) {
      throw new Error(`Missing required production environment variable(s): ${missingProd.join(', ')}`);
    }
  }
}

export function getAuthEnv(): AuthEnv {
  return {
    jwtSecret: readEnv('JWT_SECRET'),
    adminPassword: readEnv('ADMIN_PASSWORD'),
  };
}

export function getStripeEnv(): StripeEnv {
  return {
    stripeSecretKey: readEnv('STRIPE_SECRET_KEY'),
    stripeWebhookSecret: readEnv('STRIPE_WEBHOOK_SECRET'),
    siteUrl: readEnv('NEXT_PUBLIC_SITE_URL'),
  };
}
