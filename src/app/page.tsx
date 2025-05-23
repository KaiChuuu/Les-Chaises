import Header from "./_components/Header";
import Products from "./_components/Products";
import Footer from "./_components/Footer";

const query = `
  {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          description
          variants(first: 1) {
            edges {
              node {
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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="w-full mx-auto max-w-2xl px-4 pt-16 pb-4 sm:px-6 sm:pt-24 lg:max-w-[95rem] lg:px-6">
        <h2 className="text-4xl tracking-wide font-bold tracking-tight text-gray-900">
          2025 SELECTION
        </h2>
        <p className="text-md text-gray-700 mt-6">
          Nam consectetur lorem vitae enim semper, quis sollicitudin dolor
          malesuada. Etiam sollicitudin est turpis.
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
