import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload,
  useMatches,
  useLoaderData,
} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@shopify/remix-oxygen';
import {
  ShopifySalesChannel,
  Seo,
  useShopifyCookies,
} from '@shopify/hydrogen';
import favicon from '../public/favicon.ico';
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';
import {Layout} from '~/components/Layout';

export const links = () => {
  return [
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, env} = context;
  
  return defer({
    shop: storefront.query(SHOP_QUERY),
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  useShopifyCookies();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const SHOP_QUERY = `#graphql
  query Shop {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
  }
`;

