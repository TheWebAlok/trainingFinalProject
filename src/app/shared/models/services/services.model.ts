export interface Services {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  status?: boolean;
  categoryId: string;
  categoryName: string;
  createdAt?: any;
}
