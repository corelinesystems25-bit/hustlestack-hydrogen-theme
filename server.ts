import {createRequestHandler} from '@remix-run/node';
import {createStorefrontClient} from '@shopify/hydrogen';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext) {
    try {
      const {storefront} = createStorefrontClient({
        cache: await caches.open('hydrogen'),
        waitUntil: executionContext.waitUntil.bind(executionContext),
        i18n: {language: 'EN', country: 'US'},
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: {
          requestGroupId: request.headers.get('request-id'),
          buyerIp: request.headers.get('oxygen-buyer-ip'),
        },
      });

      const handleRequest = createRequestHandler({
        build: await import('./build/index.js'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session: {},
          storefront,
          env,
          waitUntil: executionContext.waitUntil.bind(executionContext),
        }),
      });

      return await handleRequest(request);
    } catch (error) {
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

interface Env {
  SESSION_SECRET: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_ID?: string;
}

