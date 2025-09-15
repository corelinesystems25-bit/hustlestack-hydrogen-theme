import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
  publicStoreDomain: string;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <CartAside cart={cart} />
      <MobileMenuAside menu={header.menu} shop={header.shop} />
      <SearchAside />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} publicStoreDomain={publicStoreDomain} />
      <main className="flex-1">{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} shop={header.shop} />}
        </Await>
      </Suspense>
    </div>
  );
}

function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function MobileMenuAside({
  menu,
  shop,
}: {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu
        menu={menu}
        viewport="mobile"
        primaryDomainUrl={shop.primaryDomain.url}
      />
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <div>
          <input
            name="q"
            placeholder="Search products..."
            type="search"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          &nbsp;
          <button
            type="submit"
            className="mt-2 w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Search
          </button>
        </div>
        <div>&nbsp;</div>
      </div>
    </Aside>
  );
}

