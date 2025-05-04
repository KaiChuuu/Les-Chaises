"use client";
import Header from "@/app/_components/Header";
import { useEffect, useState } from "react";
import { ProductVariant } from "@/types/shopify";
import { cartCreate } from "@/utils/shopify";
import { useCart } from "@/app/context/CartContent";
import { IoMdClose } from "react-icons/io";
import { MdArrowRightAlt } from "react-icons/md";
import CustomDropdown from "@/app/_components/CustomDropdown";
import Footer from "@/app/_components/Footer";
import Notification from "../_components/Notification";

const dropdownOptions = Array.from({ length: 15 }, (_, i) => i + 1);

const query = `
query GetProductsByVariants($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on ProductVariant {
      id
      title
      product {
        id
        title
        description
        handle
        images(first: 1) {
          edges {
            node {
              src
            }
          }
        }
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
  }
}
`;

export default function Checkout() {
  const { cart, removeFromCart, updateCart } = useCart();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [products, setProducts] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  // Query by $ids
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
              query: query,
              variables: { ids: cart.map((item) => item.merchandiseId) },
            }),
          }
        );

        const res = await response.json();

        setProducts(res.data.nodes);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, [query, cart]);

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.merchandiseId);
    if (!product) return sum;

    const price = parseFloat(product.price.amount);
    const subtotal = price * item.quantity;

    return sum + subtotal;
  }, 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  const handleCheckout = async () => {
    try {
      if (cart.length == 0) {
        setNotificationMessage("No items in cart! Please add an item first!");
        setShowNotification(true);
        return;
      }
      const checkoutUrl = await cartCreate(cart);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const updateItemCount = (newQuantity: number, productId: string) => {
    setNotificationMessage("Successfully updated item quantity!");
    setShowNotification(true);
    updateCart({
      merchandiseId: productId,
      quantity: newQuantity,
    });
  };

  const removeItem = (productId: string) => {
    setNotificationMessage("Successfully removed item from cart!");
    setShowNotification(true);
    removeFromCart(productId);
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

      <div className="flex w-full mx-auto max-w-2xl px-4 pt-16 pb-4 sm:px-6 sm:pt-24 lg:max-w-[80rem] lg:px-6 gap-15">
        {/* BAG DISPLAY SECTION */}
        <div className="w-2/3">
          <h2 className="text-4xl tracking-wide font-bold tracking-tight text-gray-900">
            YOUR BAG
          </h2>
          <div className="flex mt-6 text-md items-baseline">
            <p className="text-gray-700">
              TOTAL ({totalItems}
              &nbsp;items)&nbsp;
            </p>
            <p className="font-bold text-black">
              {formatCurrency(total, "CAD")}
            </p>
          </div>
          <p className="text-gray-700 mt-3">
            Items in your bag are not reserved — check out now to make them
            yours.
          </p>

          <div className="mt-8 flex flex-col gap-10">
            {cart.map((item, index) => {
              const productVariant = products.find(
                (prod) => prod.id === item.merchandiseId
              );

              if (!productVariant) return null;

              return (
                <div
                  key={index}
                  className={
                    "w-full border-black flex justify-between items-start border"
                  }
                >
                  <div className="lg:w-1/3 h-60">
                    <img
                      src={productVariant.product.images.edges[0].node.src}
                      alt={productVariant.title}
                      className="w-full h-full object-cover bg-gray-200"
                    />
                  </div>
                  <div className="lg:w-2/3 pl-7 pt-5 text-gray-900 flex flex-col h-60">
                    <div className="flex">
                      <p>{productVariant.product.title.toUpperCase()}</p>
                      <p className="ml-auto pr-7">
                        {formatCurrency(
                          parseFloat(productVariant.price.amount),
                          "CAD"
                        )}
                      </p>
                    </div>
                    <p>{productVariant.product.description}</p>
                    <div className="mt-auto pb-5">
                      <CustomDropdown
                        options={dropdownOptions}
                        onSelect={(quantity) =>
                          updateItemCount(quantity, productVariant.id)
                        }
                        initial={
                          cart.find(
                            (item) => item.merchandiseId === productVariant.id
                          )?.quantity ?? 0
                        }
                      />
                    </div>
                  </div>
                  <div className="text-black pr-4 pt-4 cursor-pointer">
                    <IoMdClose
                      onClick={() => removeItem(productVariant.id)}
                      size={24}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORDER SUMMARY SECTION */}
        <div className="w-1/3">
          <h2 className="text-2xl tracking-wide font-bold tracking-tight text-gray-900">
            ORDER SUMMARY
          </h2>

          <div className="flex mt-5 text-gray-700">
            <div>{totalItems} items</div>
            <div className="ml-auto">{formatCurrency(total, "CAD")}</div>
          </div>
          <div className="flex mt-1 text-gray-700">
            <div>Sales Tax</div>
            <div className="ml-auto">{formatCurrency(0, "CAD")}</div>
          </div>
          <div className="flex mt-1 text-gray-700">
            <div>Delivery</div>
            <div className="ml-auto">{formatCurrency(0, "CAD")}</div>
          </div>

          <div className="flex mt-5 text-gray-900 font-bold">
            <div>Total</div>
            <div className="ml-auto">{formatCurrency(total, "CAD")}</div>
          </div>

          <button
            onClick={handleCheckout}
            className="flex items-center mt-7 w-full bg-black font-bold text-left p-3 cursor-pointer"
          >
            <div>CHECKOUT</div>
            <MdArrowRightAlt className="ml-auto" size={35} />
          </button>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
