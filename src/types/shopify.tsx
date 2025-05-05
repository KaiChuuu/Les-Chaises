export interface ImageNode {
  src: string;
}

export interface ImageEdge {
  node: ImageNode;
}

export interface Price {
  amount: string;
  currencyCode: string;
}

export interface VariantNode {
  id: string;
  priceV2: Price;
  compareAtPriceV2?: Price;
  weight: number;
  weightUnit: string;
}

export interface VariantEdge {
  node: VariantNode;
}

export interface Edge {
  node: Product;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: ImageEdge[];
  };
  variants: {
    edges: VariantEdge[];
  };
}

export interface ProductVariant {
  id: string;
  title: string;
  price: Price;
  compareAtPrice: Price;
  product: Product;
}
