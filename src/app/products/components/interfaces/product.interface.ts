import { User } from "@auth/interfaces/user.interface";

export interface ProductsResponse {
    count:    number;
    pages:    number;
    products: Product[];
}

export interface Product {
    id:          string;
    title:       string;
    price:       number;
    description: string;
    slug:        string;
    stock:       number;
    sizes:       Size[];
    gender:      Gender;
    tags:        string[];
    images:      string[];
    user:        User;
}

export type Gender = "men" | "kid" | "women" | "unisex";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type Tag = "shirt" | "sweatshirt" | "hoodie" | "jacket" | "hats";


