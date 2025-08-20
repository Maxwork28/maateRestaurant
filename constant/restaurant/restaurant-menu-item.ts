// Restaurant Menu Items Data (using image file names only)

export const items = [
  {
    id: 1,
    name: "Creamy Garlic Parmesan Pasta",
    restaurant: "Burger Bistro",
    price: 40,
    image: "burger.jpg",
    category: "Italian",
    isVegetarian: true,
  },
  {
    id: 2,
    name: "Classic Burger",
    restaurant: "Burger Bistro",
    price: 40,
    image: "burger.jpg",
    category: "American",
    isVegetarian: false,
  },
  {
    id: 3,
    name: "Creamy Garlic Chicken",
    restaurant: "Burger Bistro",
    price: 40,
    image: "burger.jpg",
    category: "Continental",
    isVegetarian: false,
  },
  {
    id: 4,
    name: "Margherita Pizza",
    restaurant: "Pizza Palace",
    price: 35,
    image: "burger.jpg",
    category: "Italian",
    isVegetarian: true,
  },
  {
    id: 5,
    name: "Grilled Salmon",
    restaurant: "Sea Food Hub",
    price: 65,
    image: "burger.jpg",
    category: "Seafood",
    isVegetarian: false,
  },
];

export const categories = [
  {
    id: 1,
    name: "Veg",
    image: "veg.jpg",
    itemCount: 15,
  },
  {
    id: 2,
    name: "Non Veg",
    itemCount: 25,
    image: "non-veg.jpg",
  },
  {
    id: 3,
    name: "Beverages",
    itemCount: 12,
    image: "beverages.jpg",
  }
];

export const bestSellers = [
  {
    id: 1,
    name: "Pepperoni Pizza",
    price: 559,
    image: "bestseller.png",
    soldCount: "1k",
    rating: 4.5,
    discount: 15,
    restaurant: "Pizza Corner",
  },
  {
    id: 2,
    name: "Chicken Biryani",
    price: 299,
    image: "bestseller.png",
    soldCount: "2.5k",
    rating: 4.7,
    discount: 10,
    restaurant: "Spice Garden",
  },
  {
    id: 3,
    name: "Chocolate Brownie",
    price: 159,
    image: "bestseller.png",
    soldCount: "800",
    rating: 4.3,
    discount: 20,
    restaurant: "Sweet Treats",
  },
  {
    id: 4,
    name: "Cheese Burger",
    price: 249,
    image: "bestseller.png",
    soldCount: "1.8k",
    rating: 4.4,
    discount: 12,
    restaurant: "Burger King",
  },
  {
    id: 5,
    name: "Caesar Salad",
    price: 199,
    image: "bestseller.png",
    soldCount: "650",
    rating: 4.2,
    discount: 8,
    restaurant: "Green Bowl",
  },
];

export const offers = [
  {
    id: 1,
    title: "GET YOUR FOOD IN JUST",
    discount: "\u20B950/-",
    description: "Free delivery on orders above \u20B9299",
    image: "spoffer2.jpg",
    validTill: "2024-12-31",
    code: "SAVE50",
    minOrder: 299,
  },
  {
    id: 2,
    title: "WEEKEND SPECIAL",
    discount: "25% OFF",
    description: "Get 25% off on all pizza orders",
    image: "spoffer2.jpg",
    validTill: "2024-12-15",
    code: "WEEKEND25",
    minOrder: 199,
  },
  {
    id: 3,
    title: "FIRST ORDER",
    discount: "\u20B9100 OFF",
    description: "Special discount for new users",
    image: "spoffer2.jpg",
    validTill: "2024-12-31",
    code: "FIRST100",
    minOrder: 399,
  },
];

// Default export containing all data
export default {
  items,
  categories,
  bestSellers,
  offers,
};