export interface CategoryType {
  id: string;
  parentCategory: string;
  name: string;
  description?: string;
}

export interface ProductType {
  id: string;
  number: string;
  category: string;
  supplier: string;
  name: string;
  price: string;
  shippingDay: string;
  stock: string;
  minQty: string;
  maxQty: string;
  qty?: number;
  totalPrice?: string;
}

export interface BasketItemType{
  [key: string]: ProductType
}
