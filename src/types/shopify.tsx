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
  priceV2: Price;
  compareAtPriceV2?: Price;
  weight: number;
  weightUnit: string;
}

export interface VariantEdge {
  node: VariantNode;
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
