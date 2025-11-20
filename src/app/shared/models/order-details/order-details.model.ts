export interface OrderItem {
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface OrderDetails {
  id?: string;

  // Customer Information
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };

  // Products
  items: OrderItem[];

  // Payment Details
  subtotal: number;
  discount: number;
  finalAmount: number;

  paymentId?: string;
  orderId?: string;
  paymentStatus?: 'success' | 'failed' | 'pending';

  // Delivery Details
  status: 'Delivered' | 'On the way' | 'Cancelled' | 'Returned';
  deliveryDate?: string;

  createdAt?: any;
  date?: string;
}
