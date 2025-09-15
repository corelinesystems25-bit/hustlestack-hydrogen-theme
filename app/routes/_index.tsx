import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'HustleStack | Empowering Entrepreneurs & Businesses'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({
    featuredCollection: collections.nodes[0],
    recommendedProducts,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSection />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <NewsletterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">HustleStack</h1>
        <p className="text-xl mb-8">Empowering Entrepreneurs & Businesses</p>
        <Link
          to="/collections"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;

  const image = collection?.image;
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Collection</h2>
        <Link
          className="block group"
          key={collection.id}
          prefetch="intent"
          to={`/collections/${collection.handle}`}
        >
          {image && (
            <div className="relative overflow-hidden rounded-lg mb-4">
              <Image
                alt={image.altText || collection.title}
                aspectRatio="1/1"
                data={image}
                loading="eager"
                sizes="(min-width: 45em) 50vw, 100vw"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <h3 className="text-xl font-semibold text-center">{collection.title}</h3>
        </Link>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({products}) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.nodes.map((product) => (
                  <Link
                    key={product.id}
                    className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    prefetch="intent"
                    to={`/products/${product.handle}`}
                  >
                    {product.featuredImage && (
                      <Image
                        alt={product.featuredImage.altText || product.title}
                        aspectRatio="1/1"
                        data={product.featuredImage}
                        loading="lazy"
                        sizes="(min-width: 45em) 400px, 100vw"
                        className="rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">{product.title}</h4>
                      <small className="text-gray-600">
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-16 px-6 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl mb-8">Get the latest updates and exclusive offers</p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            required
          />
          <button
            type="submit"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

