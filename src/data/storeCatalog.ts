export type StoreCategory = "Electronics" | "Fashion" | "Accessories" | "Home";

export type StoreVariant = {
  id: string;
  label: string;
};

export type StoreProduct = {
  id: string;
  name: string;
  category: StoreCategory;
  price: number;
  stock: number;
  active: boolean;
  summary: string;
  image: string;
  variants: readonly StoreVariant[];
};

export const storeCategories: readonly StoreCategory[] = ["Electronics", "Fashion", "Accessories", "Home"];

export const storeCatalog: readonly StoreProduct[] = [
  {
    id: "aura-headphones",
    name: "Aura Headphones",
    category: "Electronics",
    price: 189,
    stock: 14,
    active: true,
    summary: "Closed wireless headphones with a 30-hour battery and a travel case.",
    image: "/products/aura-headphones.jpg",
    variants: [
      { id: "black", label: "Black" },
      { id: "sand", label: "Sand" },
    ],
  },
  {
    id: "field-lamp",
    name: "Field Desk Lamp",
    category: "Electronics",
    price: 96,
    stock: 9,
    active: true,
    summary: "A dimmable desk lamp with a warm LED and a weighted base.",
    image: "/products/field-desk-lamp.jpg",
    variants: [
      { id: "brass", label: "Brass" },
      { id: "graphite", label: "Graphite" },
    ],
  },
  {
    id: "meridian-coat",
    name: "Meridian Coat",
    category: "Fashion",
    price: 240,
    stock: 7,
    active: true,
    summary: "Wool-blend coat cut for a straight fit, with a hidden placket.",
    image: "/products/meridian-coat.jpg",
    variants: [
      { id: "s", label: "Size S" },
      { id: "m", label: "Size M" },
      { id: "l", label: "Size L" },
    ],
  },
  {
    id: "everyday-shirt",
    name: "Everyday Shirt",
    category: "Fashion",
    price: 78,
    stock: 18,
    active: true,
    summary: "Cotton shirt with a soft collar, meant for daily wear.",
    image: "/products/everyday-shirt.jpg",
    variants: [
      { id: "white", label: "White" },
      { id: "ink", label: "Ink" },
    ],
  },
  {
    id: "harbor-watch",
    name: "Harbor Watch",
    category: "Accessories",
    price: 210,
    stock: 6,
    active: true,
    summary: "Steel-case watch with a date window and a 40-hour reserve.",
    image: "/products/harbor-watch.jpg",
    variants: [
      { id: "leather", label: "Leather strap" },
      { id: "steel", label: "Steel bracelet" },
    ],
  },
  {
    id: "city-belt",
    name: "City Belt",
    category: "Accessories",
    price: 64,
    stock: 20,
    active: true,
    summary: "Full-grain belt with a brushed buckle.",
    image: "/products/city-belt.jpg",
    variants: [
      { id: "80", label: "80 cm" },
      { id: "85", label: "85 cm" },
      { id: "90", label: "90 cm" },
    ],
  },
  {
    id: "linen-throw",
    name: "Linen Throw",
    category: "Home",
    price: 88,
    stock: 11,
    active: true,
    summary: "Washed linen throw, 140 by 200 cm.",
    image: "/products/linen-throw.jpg",
    variants: [
      { id: "stone", label: "Stone" },
      { id: "olive", label: "Olive" },
    ],
  },
  {
    id: "ceramic-vessel",
    name: "Ceramic Vessel",
    category: "Home",
    price: 54,
    stock: 15,
    active: true,
    summary: "Hand-finished vessel for a desk or shelf.",
    image: "/products/ceramic-vessel.jpg",
    variants: [
      { id: "small", label: "Small" },
      { id: "large", label: "Large" },
    ],
  },
];

export function formatMoney(value: number) {
  return `$${value}`;
}
