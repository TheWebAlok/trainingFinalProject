export interface Category {
  id?: string;
  name: string;
  company: string;
  price: number;
  warranty: number;
  description: string;
  imageUrl?: string;
  status?: boolean
  createdAt?: number
}
