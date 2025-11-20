export interface WeddingCard {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  createdAt?: any;
  status: boolean;
}