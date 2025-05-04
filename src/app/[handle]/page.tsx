"use client";
import Header from "@/app/_components/Header";
import { use, useEffect, useState } from "react";
import { Product } from "@/types/shopify";
import { useCart } from "@/app/context/CartContent";
import Footer from "@/app/_components/Footer";
import Notification from "../_components/Notification";

const unitMap: Record<string, string> = {
  KILOGRAMS: "kg",
};

type ProductDetailsProps = {
  params: Promise<{
    handle: string;
  }>;
};

const query = `
query GetProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    description
    images(first: 1) {
      edges {
        node {
          src
        }
      }
    }
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
          weight
          weightUnit
        }
      }
    }
  }
}
`;

export default function ProductDetails({ params }: ProductDetailsProps) {
  const { cart, addToCart } = useCart();

  const { handle } = use(params);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
            body: JSON.stringify({
              query,
              variables: { handle },
            }),
          }
        );

        const res = await response.json();
        setProduct(res.data.productByHandle);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };

    fetchProducts();
  }, [handle]);

  const productImage = product?.images?.edges[0]?.node?.src;
  const productTitle = product?.title;
  const productDescription = product?.description;
  const variant = product?.variants?.edges[0]?.node;
  const productWeight = variant?.weight;
  const productWeightUnit = variant?.weightUnit;

  const priceAmount = variant?.priceV2?.amount;
  const priceCurrency = variant?.priceV2?.currencyCode;

  const compareAtPriceAmount = variant?.compareAtPriceV2?.amount;
  const compareAtPriceCurrency = variant?.compareAtPriceV2?.currencyCode;

  const formattedPrice = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: priceCurrency || "CAD",
  }).format(Number(priceAmount || 0));

  const formattedCompareAtPrice = compareAtPriceAmount
    ? new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: compareAtPriceCurrency || "CAD",
      }).format(Number(compareAtPriceAmount || 0))
    : null;

  const weightUnitFormatted =
    unitMap[productWeightUnit as keyof typeof unitMap] ||
    productWeightUnit?.toLowerCase();

  const addToBag = () => {
    const merchandiseId = product?.variants?.edges[0]?.node?.id;
    if (merchandiseId) {
      setNotificationMessage("Successfully added item from cart!");
      setShowNotification(true);
      addToCart({ merchandiseId: merchandiseId, quantity: 1 });
    }
  };

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Notification
        message={notificationMessage}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <Header />
      <div className="flex mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-5xl lg:px-6">
        {/* Angle Images */}
        <div className="flex flex-col space-y-2 pr-5">
          {Array.from({ length: 5 }, (_, index) => (
            <img
              key={index}
              src={productImage}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>

        {/* Base Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={productImage}
            alt={productTitle}
            className="w-full h-full object-cover rounded-lg bg-gray-200"
          />
        </div>

        {/* Information Column */}
        <div className="w-full lg:w-1/2 flex flex-col pl-10">
          <h1 className="text-3xl text-black mb-1">{productTitle}</h1>

          <p className="text-gray-700">{productDescription}</p>

          <p className="text-gray-700 mb-2">
            {productWeight}&nbsp;
            {weightUnitFormatted}
          </p>

          <div className="flex font-bold">
            {/* Current Price */}
            <p className="text-lg text-black font-bold mb-10">
              {formattedPrice}
            </p>
            {/* Original Price */}
            <div className="ml-3 text-lg">
              {formattedCompareAtPrice && (
                <div className="flex">
                  <div className="line-through text-gray-500">
                    {formattedCompareAtPrice}
                  </div>
                  <div className="text-green-700">
                    &nbsp;
                    {Math.round(
                      ((Number(compareAtPriceAmount) - Number(priceAmount)) /
                        Number(compareAtPriceAmount)) *
                        100
                    )}
                    % off
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 8 }, (_, index) => (
              <img
                key={index}
                src={productImage}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-20 object-cover rounded"
              />
            ))}
          </div>

          <button
            onClick={addToBag}
            className="p-5 rounded-full bg-black mt-auto cursor-pointer"
          >
            Add to Bag
          </button>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
