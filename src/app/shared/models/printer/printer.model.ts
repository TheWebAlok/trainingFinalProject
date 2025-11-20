export interface Printer {
  id?: string;
  name: string;
  brand: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  createdAt?: any;
  categoryId: string;
  categoryName: string;
}
