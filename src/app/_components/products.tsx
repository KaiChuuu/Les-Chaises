"use client";
import Pagination from "./pagination";

import { useState, useEffect } from "react";

const query = `
  {
    products(first: 50) {
      edges {
        node {
          id
          title
          description
          variants(first: 1) {
            edges {
              node {
                priceV2 {
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

const fakeData = {
  data: {
    products: {
      edges: [
        {
          node: {
            id: "gid://shopify/Product/8633263259876",
            title: "Ocean Blue Shirt",
            description:
              "Ocean blue cotton shirt with a narrow collar and buttons down the front and long sleeves. Comfortable fit and tiled kalidoscope patterns.",
            variants: {
              edges: [
                {
                  node: {
                    priceV2: {
                      amount: "50.0",
                      currencyCode: "CAD",
                    },
                  },
                },
              ],
            },
            images: {
              edges: [
                {
                  node: {
                    src: "https://cdn.shopify.com/s/files/1/0733/3353/9044/files/young-man-in-bright-fashion_925x_f8364977-be40-45d7-905e-f119b54faa24.jpg?v=1745617574",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: "gid://shopify/Product/8633263292644",
            title: "Classic Varsity Top",
            description:
              "Womens casual varsity top, This grey and black buttoned top is a sport-inspired piece complete with an embroidered letter.",
            variants: {
              edges: [
                {
                  node: {
                    priceV2: {
                      amount: "60.0",
                      currencyCode: "CAD",
                    },
                  },
                },
              ],
            },
            images: {
              edges: [
                {
                  node: {
                    src: "https://cdn.shopify.com/s/files/1/0733/3353/9044/files/casual-fashion-woman_925x_dcbe0007-a7c5-4c35-97c1-c9f470b2ddbf.jpg?v=1745617577",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: "gid://shopify/Product/8633263325412",
            title: "Yellow Wool Jumper",
            description:
              "Knitted jumper in a soft wool blend with low dropped shoulders and wide sleeves and think cuffs. Perfect for keeping warm during Fall.",
            variants: {
              edges: [
                {
                  node: {
                    priceV2: {
                      amount: "80.0",
                      currencyCode: "CAD",
                    },
                  },
                },
              ],
            },
            images: {
              edges: [
                {
                  node: {
                    src: "https://cdn.shopify.com/s/files/1/0733/3353/9044/files/autumn-photographer-taking-picture_925x_e5fa3b1c-5463-4aca-bf91-e37dca647341.jpg?v=1745617579",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: "gid://shopify/Product/8633263358180",
            title: "Floral White Top",
            description: "Stylish sleeveless white top with a floral pattern.",
            variants: {
              edges: [
                {
                  node: {
                    priceV2: {
                      amount: "75.0",
                      currencyCode: "CAD",
                    },
                  },
                },
              ],
            },
            images: {
              edges: [
                {
                  node: {
                    src: "https://cdn.shopify.com/s/files/1/0733/3353/9044/files/city-woman-fashion_925x_2x_54b2477e-b165-46bc-8355-8cb5a6bd9df2.jpg?v=1745617581",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: "gid://shopify/Product/8633263390948",
            title: "Striped Silk Blouse",
            description:
              "Ultra-stylish black and red striped silk blouse with buckle collar and matching button pants.",
            variants: {
              edges: [
                {
                  node: {
                    priceV2: {
                      amount: "50.0",
                      currencyCode: "CAD",
                    },
                  },
                },
              ],
            },
            images: {
              edges: [
                {
                  node: {
                    src: "https://cdn.shopify.com/s/files/1/0733/3353/9044/files/striped-blouse-fashion_925x_5a77f28f-6ad9-4019-b065-d25493fc2163.jpg?v=1745617583",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentProductPage, setCurrentProductPage] = useState(0);
  const [productsPerPage] = useState(3);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "X-Shopify-Storefront-Access-Token": `${process.env.NEXT_PUBLIC_SHOPIFY_STORE_ACCESS_TOKEN}`,
  //           },
  //           body: JSON.stringify({ query }),
  //         }
  //       );

  //       const data = await response.json();

  //       setProducts(data.products.edges);
  //       setLoading(false);
  //     } catch (err) {
  //       console.log("Error fetching products", err);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  useEffect(() => {
    setLoading(false);
    setProducts(fakeData.data.products.edges.map((edge) => edge.node));
  }, []);

  const startIndex = currentProductPage * productsPerPage;
  const endIndex = (currentProductPage + 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextPage = () => {
    if (currentProductPage > 1) {
      setCurrentProductPage((page) => page - 1);
    }
  };
  const prevPage = () => {
    if (currentProductPage < totalPages) {
      setCurrentProductPage((page) => page + 1);
    }
  };

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="m-6">
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {currentProducts.map((product, index) => (
          <div key={index} className="group relative">
            <img
              src={product.images?.edges[0]?.node?.src}
              alt="Front of men&#039;s Basic Tee in black."
              className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href="#">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    ></span>
                    {product.title}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Black</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {product.variants?.edges[0]?.node?.priceV2?.amount
                  ? new Intl.NumberFormat("en-CA", {
                      style: "currency",
                      currency:
                        product.variants.edges[0].node.priceV2.currencyCode,
                    }).format(product.variants.edges[0].node.priceV2.amount)
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentProductPage}
          onNext={nextPage}
          onPrev={prevPage}
          totalItems={products.length}
          totalPages={totalPages}
          itemsPerPage={productsPerPage}
        />
      </div>
    </div>
  );
}
