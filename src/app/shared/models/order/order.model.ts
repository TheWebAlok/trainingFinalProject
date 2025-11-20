export interface Order {
  customerName: string;
  email: string;
  mobile: string;
  address: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  paymentId?: string;
  totalAmount?: number;
  status: boolean;
  createdAt: any;
}
