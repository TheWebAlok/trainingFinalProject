export interface Mouse {
  id?: string;
  name: string;
  brand: string;
  type: 'wired' | 'wireless';
  dpi?: number;
  price: number;
  status: boolean;
  description?: string;
  imageUrl?: string;
  stock: number;
  createdAt?: any;
  categoryId: string;
  categoryName: string;
}
