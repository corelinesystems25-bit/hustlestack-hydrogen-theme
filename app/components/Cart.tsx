import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

export function CartMain({layout, cart}: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({
  layout,
  cart,
}: {
  layout: CartMainProps['layout'];
  cart: CartApiQueryFragment | null;
}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details">
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul className="space-y-4">
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="cart-line bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {image && (
        <div className="rounded-lg overflow-hidden">
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
            className="object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              window.location.href = lineItemUrl;
            }
          }}
          className="hover:text-primary-600 transition-colors"
        >
          <p className="font-semibold text-gray-900">
            {product.title}
          </p>
        </Link>
        <CartLinePrice line={line} as="span" />
        <ul className="text-sm text-gray-600 mt-1">
          {selectedOptions.map((option) => (
            <li key={option.name}>
              {option.name}: {option.value}
            </li>
          ))}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-6">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block text-center"
      >
        Continue to Checkout →
      </a>
    </div>
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
      <dl className="cart-subtotal">
        <dt className="text-gray-600">Subtotal</dt>
        <dd className="font-semibold">
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {children}
    </div>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button 
        type="submit"
        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantiy">
      <div className="flex items-center gap-3 mt-3">
        <span className="text-sm text-gray-600">Qty: {quantity}</span>
        <div className="flex items-center gap-2">
          <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
            <button
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              name="decrease-quantity"
              value={prevQuantity}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>−</span>
            </button>
          </CartLineUpdateButton>
          
          <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
            <button
              aria-label="Increase quantity"
              name="increase-quantity"
              value={nextQuantity}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <span>+</span>
            </button>
          </CartLineUpdateButton>
        </div>
        <CartLineRemoveButton lineIds={[lineId]} />
      </div>
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className="text-lg font-semibold text-gray-900 mt-1">
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden} className="text-center py-8">
      <div className="text-gray-500 mb-4">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p className="text-lg">Your cart is empty</p>
        <p className="text-sm mt-2">Looks like you haven't added anything yet</p>
      </div>
      <Link
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/collections';
          }
        }}
        className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
      >
        Continue Shopping →
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="mt-4">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length} className="mb-4">
        <div>
          <dt className="text-sm text-gray-600">Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {codes?.join(', ')}
              </code>
              <button className="text-red-600 hover:text-red-700 text-sm ml-2">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input 
            type="text" 
            name="discountCode" 
            placeholder="Discount code" 
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

