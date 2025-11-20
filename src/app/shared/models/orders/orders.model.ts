export interface Orders {
  id?: string;
  customerName: string;
  email: string;
  mobile: string;
  address: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount?: number;
  paymentId?: string;
  imageUrl?: string;
  createdAt: any;
  status: boolean;
  
}
