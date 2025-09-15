import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  HeaderQuery,
  MenuFragment,
} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: boolean;
  publicStoreDomain: string;
};

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart, publicStoreDomain}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="bg-white flex justify-between items-center py-6 px-6 shadow-sm border-b">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <h1 className="font-bold text-2xl text-gray-900">HustleStack</h1>
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      <div className="flex gap-6 font-medium">
        <NavLink
          className="hover:text-blue-600 transition-colors"
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className="hover:text-blue-600 transition-colors"
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/collections"
        >
          Collections
        </NavLink>
        <NavLink
          className="hover:text-blue-600 transition-colors"
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/blogs"
        >
          Blog
        </NavLink>
        <NavLink
          className="hover:text-blue-600 transition-colors"
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/policies"
        >
          Policies
        </NavLink>
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className="hover:text-blue-600 transition-colors"
              end={item.url.includes('myshopify.com')}
              key={item.id}
              onClick={closeAside}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-4" role="navigation">
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function SearchToggle() {
  return (
    <a href="#search-aside" className="hover:text-blue-600 transition-colors">
      Search
    </a>
  );
}

function CartToggle({cart}: {cart: HeaderProps['cart']}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <a
      href="#cart-aside"
      className="relative inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Cart
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </a>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
} satisfies MenuFragment;

