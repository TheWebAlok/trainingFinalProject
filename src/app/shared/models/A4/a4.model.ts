export interface A4 {
  id?: string;
  name: string;
  gsm: number;
  price: number;
  packSize: number;
  imageUrl?: string;
  description: string;   // 👈 required hai
  stock: number;
  createdAt?: any;
  status: boolean;
  categoryId: string;
  categoryName: string;
}
