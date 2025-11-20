export interface Keyboard {
  id?: string;
  name: string;
  brand: string;
  type: 'wired' | 'wireless' | 'mechanical';
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  createdAt?: any;
  categoryId: string;
  categoryName: string;
}
