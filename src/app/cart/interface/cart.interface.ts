import { IProduct } from "../../products/interface/product.interface";

export interface ICartItem extends IProduct{
    quantity: number;
    subtotal: number;
    discountedSubtotal?: number;
}

export interface ICart {
    items: ICartItem[];
    totalPrice: number;
    couponCode: string;
}