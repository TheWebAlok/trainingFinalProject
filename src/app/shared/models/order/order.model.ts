export interface Order {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAddress: string;
  userMobile: string;
  itemName: string;
  itemImage: string;
  price: number;
  buyDate: any;
  deliveryDate: any;
  status: string; // e.g., 'Pending', 'Delivered'
}
