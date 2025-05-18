import { Property } from "csstype";
import Order = Property.Order;

export interface UserUpdate {
  surName: string;
  email: string;
  phone: string;
  snils: string;
  birth: Date;
}
export interface User {
  email: string;
  password: string;
  id: number;
  firstName: string;
  surName: string | null;
  lastName: string;
  phone: string;
  birth: Date;
  gender: "MALE" | "FEMALE";
  role: "ADMIN" | "DOCTOR" | "CLIENT";
}
export interface OrdersTable {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  userPhone: string;
  serviceName: string | undefined;
  doctorFullName: string;
  date: Date;
  price: number;
}
export interface Doctor {
  id: number;
  firstName: string;
  surName: string | null;
  lastName: string;
  password: string;
  email: string;
  image: string;
  description: JsonValue;
  categoryId: number;
  experience: string;
  post: string;
}
interface Order {
  doctorId: number;
  serviceId: number;
  userId: number;
  date: Date;
  status: "WAITING" | "PROVIDED";
}
export interface Service {
  id: number;
  name: string;
  image: string;
  price: number;
  categoryName: string;
  description: JsonValue | null;
  doctorId: number;
}
export interface ServiceFullInfo {
  service: Service;
  doctor: Doctor;
  lastOrder: Order;
  ordersByService: OrderWithUser[];
  ordersSum: number;
}
export interface OrderWithUser extends User, Order {}
export interface orderFullInfo {
  id: number;
  status: $Enums.Status;
  date: Date;
  service: {
    id: number;
    name: string;
    doctorId: number;
    image: string;
    price: number;
    categoryName: string;
    description: JsonValue | null;
  } | null;
  user: User | null;
  doctor: Doctor | null;
  userOtherOrders: {
    id: number;
    serviceName: string | undefined;
    status: $Enums.Status;
    doctorFullName: string;
    date: Date;
    price: number;
  }[];
}
export interface CategoryFullInfo {
  ordersByCategory: number;
  ordersActive: number;
  services: {
    id: number;
    name: string;
    doctorId: number;
    image: string;
    description: JsonValue | null;
    price: number;
    categoryName: string;
    orders: Order[];
    ordersActiveByService: number;
  };
  doctor: Doctor;
}
export interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  colorIcon: string;
}
export interface LastOrdersInfo {
  serviceName: string | undefined;
  userFulName: string;
  id: number;
  price: number;
  doctorId: number;
  serviceId: number;
  userId: number;
  status: $Enums.Status;
  date: Date;
  createdAt: Date;
}
