export interface Product {
  id?: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  description: string;
  imageUrl: string;
  status: boolean;
  createdAt: number;
}
