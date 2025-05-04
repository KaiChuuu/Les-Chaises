"use client";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContent";

export default function Header() {
  const { cart } = useCart();

  const router = useRouter();
  const selectionClick = () => {
    router.push("/");
  };
  const classicsClick = () => {
    router.push("/classics/");
  };
  const dealsClick = () => {
    router.push("/deals/");
  };
  const checkoutClick = () => {
    router.push("/checkout/");
  };

  return (
    <div>
      <nav className="bg-white border-b border-gray-300 text-black">
        <div className="mx-auto max-w-8xl px-2 pt-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 h-16 items-center">
            {/* Left - Logo */}
            <div>
              <h1
                onClick={selectionClick}
                className="text-2xl sm:text-4xl tracking-wide font-bold cursor-pointer"
              >
                LES CHAISES
              </h1>
            </div>

            {/* Center - Nav */}
            <div className="flex justify-center space-x-6 tracking-wider">
              <button
                onClick={selectionClick}
                className="text-md font-bold hover:underline cursor-pointer"
              >
                2025 SELECTION
              </button>
              <button
                onClick={classicsClick}
                className="text-md font-medium hover:underline cursor-pointer"
              >
                CLASSICS
              </button>
              <button
                onClick={dealsClick}
                className="text-md font-medium hover:underline cursor-pointer"
              >
                DEALS
              </button>
            </div>

            {/* Right - Cart */}
            <div className="flex justify-end">
              <button
                className="relative cursor-pointer"
                onClick={checkoutClick}
              >
                <LiaShoppingBagSolid size={30} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm px-2 py-0.5 rounded-full min-w-[1.5rem] text-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
