import type {FooterQuery, MenuFragment} from 'storefrontapi.generated';

export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: {primaryDomain: {url: string}}}) {
  return (
    <footer className="bg-gray-50 text-gray-700 py-10 px-6 text-center border-t">
      <div className="max-w-6xl mx-auto">
        <h3 className="font-bold text-xl text-gray-900">HustleStack</h3>
        <p className="mt-2">Empowering Entrepreneurs & Businesses</p>
        
        {menu && (
          <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
        )}
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm">
            © {new Date().getFullYear()} HustleStack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: MenuFragment;
  primaryDomainUrl: string;
}) {
  const publicStoreDomain = primaryDomainUrl.replace('https://', '').replace('http://', '');

  return (
    <nav className="mt-6" role="navigation">
      <div className="flex justify-center gap-6 flex-wrap">
        {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-blue-600 transition-colors"
            >
              {item.title}
            </a>
          ) : (
            <a
              key={item.id}
              href={url}
              className="hover:text-blue-600 transition-colors"
            >
              {item.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609435192',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609467960',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
} satisfies MenuFragment;

