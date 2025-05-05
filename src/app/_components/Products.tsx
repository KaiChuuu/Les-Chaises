"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Edge } from "@/types/shopify";
import Image from "next/image";
interface ProductsProps {
  query: string;
}

export default function Products({ query }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": `${process.env.NEXT_PUBLIC_SHOPIFY_STORE_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ query }),
          }
        );

        const res = await response.json();
        setProducts(res.data.products.edges.map((edge: Edge) => edge.node));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, [query]);

  useEffect(() => {
    const updateProductsPerPage = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        setProductsPerPage(12); // xl
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setProductsPerPage(8); // sm
      } else {
        setProductsPerPage(4); // anything smaller
      }
    };

    updateProductsPerPage();

    window.addEventListener("resize", updateProductsPerPage);
    return () => window.removeEventListener("resize", updateProductsPerPage);
  }, []);

  // Pagination Size
  const startIndex = (currentProductPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const totalPages = Math.ceil(products.length / productsPerPage);

  // Pagination Buttons
  const prevPage = () => {
    if (currentProductPage > 1) {
      setCurrentProductPage((page) => page - 1);
    }
  };
  const nextPage = () => {
    if (currentProductPage < totalPages) {
      setCurrentProductPage((page) => page + 1);
    }
  };
  const updatePage = (index: number) => {
    setCurrentProductPage(index);
  };

  // Product Router Navigation
  const router = useRouter();
  const productClick = (itemHandle: string) => {
    router.push(`/${itemHandle}`);
  };

  // Access Current Price from Product Interface
  const getPrice = (product: Product) => {
    const price = product.variants?.edges[0]?.node?.priceV2?.amount;
    const currency = product.variants?.edges[0]?.node?.priceV2?.currencyCode;

    return price
      ? new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(
          Number(price)
        )
      : "N/A";
  };

  // Access Original Price from Product Interface
  const getOriginalPrice = (product: Product) => {
    const compareAtPrice = Number(
      product.variants?.edges[0]?.node?.compareAtPriceV2?.amount
    );
    const currency =
      product.variants?.edges[0]?.node?.compareAtPriceV2?.currencyCode;

    if (compareAtPrice) {
      const price = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency,
      }).format(compareAtPrice);

      const discount = Math.round(
        ((compareAtPrice -
          Number(product.variants.edges[0].node.priceV2.amount)) /
          compareAtPrice) *
          100
      );

      return (
        <div className="flex">
          <p className="line-through text-gray-500">{price}</p>
          <p className="text-green-700">&nbsp;{discount}% off</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-[95rem] lg:px-6">
      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {currentProducts.map((product, index) => (
          <div
            key={index}
            onClick={() => productClick(product.handle)}
            className="group relative border border-transparent cursor-pointer hover:border-black"
          >
            <Image
              src={product.images?.edges[0]?.node?.src}
              alt={product.title}
              width={1216}
              height={1680}
              className="aspect-square w-full bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div className="my-2 ml-2 flex justify-between">
              <div>
                <div className="flex font-bold">
                  {/* Current Price */}
                  <p className="text-md text-gray-900">{getPrice(product)}</p>

                  {/* Original Price */}
                  <div className="ml-3 text-md">
                    {getOriginalPrice(product)}
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="text-md text-gray-700">
                  <span aria-hidden="true" className="absolute inset-0"></span>
                  {product.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6 text-gray-500">
        <button
          className="flex border border-black items-center justify-center py-1 px-3 cursor-pointer hover:text-gray-400 hover:border-gray-400 transition"
          onClick={prevPage}
          disabled={currentProductPage === 1}
        >
          PREV
        </button>

        <div className="hidden sm:flex">
          {Array.from({ length: totalPages }, (_, index) => (
            <div
              className={`flex border border-black items-center justify-center ml-3 px-4 py-2 ${
                index + 1 === currentProductPage
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:text-gray-400 hover:border-gray-400 transition cursor-pointer"
              }`}
              key={index}
              onClick={() => updatePage(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <button
          className="flex border border-black items-center justify-center ml-3 py-1 px-3 cursor-pointer hover:text-gray-400 hover:border-gray-400 transition"
          onClick={nextPage}
          disabled={currentProductPage === totalPages}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
