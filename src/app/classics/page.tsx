import Header from "@/app/_components/Header";
import Products from "@/app/_components/Products";
import Footer from "@/app/_components/Footer";

const query = `
  {
    products(first: 50, query: "tag:classic") {
      edges {
        node {
          id
          title
          handle
          description
          variants(first: 1) {
            edges {
              node {
                id
                priceV2 {
                  amount
                  currencyCode
                }
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                src
              }
            }
          }
        }
      }
    }
  }
`;

export default function Classics() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="w-full mx-auto max-w-2xl px-4 pt-16 pb-4 sm:px-6 sm:pt-24 lg:max-w-[95rem] lg:px-6">
        <h2 className="text-4xl tracking-wide font-bold tracking-tight text-gray-900">
          CLASSIC OFFERINGS
        </h2>
        <p className="text-md text-gray-700 mt-6">
          Mauris sollicitudin tincidunt ligula nec ultricies. Suspendisse
          egestas, dolor non finibus vehicula, arcu massa tempus eros, quis
          imperdiet sem tortor sed neque.
        </p>
      </div>

      <div className="w-full">
        <Products query={query} />
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
