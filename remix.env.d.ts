/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type {Storefront} from '@shopify/hydrogen';
import type {HydrogenSession} from '@shopify/hydrogen';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN?: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID?: string;
  }
}

declare module '@shopify/remix-oxygen' {
  /**
   * Declare local additions to the Remix loader context.
   */
  interface AppLoadContext {
    env: Env;
    cart: {
      get(): Promise<CartApiQueryFragment | null>;
      set(cart: CartApiQueryFragment): void;
    };
    storefront: Storefront;
    session: HydrogenSession;
    waitUntil: ExecutionContext['waitUntil'];
  }
}

