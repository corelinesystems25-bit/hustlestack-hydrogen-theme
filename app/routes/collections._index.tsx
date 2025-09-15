import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Collections | HustleStack'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(COLLECTIONS_QUERY);

  return defer({collections});
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          Collections
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={collections}>
            {({collections}) => (
              <CollectionsGrid collections={collections} />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function CollectionsGrid({
  collections,
}: {
  collections: CollectionFragment[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-up"
      key={collection.id}
      prefetch="intent"
      to={`/collections/${collection.handle}`}
      style={{animationDelay: `${index * 0.1}s`}}
    >
      {collection.image && (
        <div className="relative overflow-hidden aspect-square">
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            data={collection.image}
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-xl font-bold">{collection.title}</h3>
            {collection.description && (
              <p className="text-sm mt-1 line-clamp-2">{collection.description}</p>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="text-gray-600 line-clamp-3">{collection.description}</p>
        )}
        <div className="mt-4 text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
          Explore Collection →
        </div>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    description
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;

