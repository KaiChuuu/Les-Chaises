const mutation = `
mutation cartCreate($input: CartInput) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}
`;

interface ShopifyError {
  message: string;
}

// const customDomainURL = "";

export const cartCreate = async (
  cart: { merchandiseId: string; quantity: number }[]
) => {
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": `${process.env.NEXT_PUBLIC_SHOPIFY_STORE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            lines: cart,
            // returnUrl: customDomainURL,
          },
        },
      }),
    }
  );

  const res = await response.json();
  const errors = res?.data?.cartCreate?.userErrors;

  if (errors?.length) {
    console.error("Shopify Cart Errors:", errors);
    throw new Error(errors.map((e: ShopifyError) => e.message).join(", "));
  }

  return res.data.cartCreate.cart.checkoutUrl;
};
