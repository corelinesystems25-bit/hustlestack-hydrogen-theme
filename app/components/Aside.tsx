/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  return (
    <div aria-modal className="overlay animate-fade-in" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside className="animate-slide-down">
        <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h3 className="font-heading text-xl font-semibold">{heading}</h3>
          <CloseAside />
        </header>
        <main className="bg-white">{children}</main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a 
      className="close text-white hover:text-gray-200" 
      href="#" 
      onChange={() => history.go(-1)}
    >
      &times;
    </a>
  );
}

