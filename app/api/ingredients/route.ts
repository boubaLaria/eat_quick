import { NextResponse } from "next/server";

const ingredients = [
  // Bases
  { id: 1, name: "Romaine Lettuce", category: "base", price: 1.0 },
  { id: 2, name: "Baby Spinach", category: "base", price: 1.0 },
  { id: 3, name: "Mixed Greens", category: "base", price: 1.2 },
  { id: 4, name: "Arugula", category: "base", price: 1.3 },
  // Proteins
  { id: 5, name: "Grilled Chicken", category: "protein", price: 3.5 },
  { id: 6, name: "Chickpeas", category: "protein", price: 1.5 },
  { id: 7, name: "Hard-boiled Egg", category: "protein", price: 1.2 },
  { id: 8, name: "Tuna", category: "protein", price: 2.8 },
  { id: 9, name: "Feta Cheese", category: "protein", price: 2.0 },
  { id: 10, name: "Tofu", category: "protein", price: 2.0 },
  // Toppings
  { id: 11, name: "Cherry Tomatoes", category: "topping", price: 0.8 },
  { id: 12, name: "Cucumber", category: "topping", price: 0.6 },
  { id: 13, name: "Red Onion", category: "topping", price: 0.5 },
  { id: 14, name: "Avocado", category: "topping", price: 1.8 },
  { id: 15, name: "Kalamata Olives", category: "topping", price: 0.9 },
  { id: 16, name: "Croutons", category: "topping", price: 0.7 },
  { id: 17, name: "Almonds", category: "topping", price: 1.1 },
  { id: 18, name: "Corn", category: "topping", price: 0.6 },
  // Dressings
  { id: 19, name: "Caesar Dressing", category: "dressing", price: 0.8 },
  { id: 20, name: "Greek Dressing", category: "dressing", price: 0.8 },
  { id: 21, name: "Balsamic Glaze", category: "dressing", price: 0.9 },
  { id: 22, name: "Lime Vinaigrette", category: "dressing", price: 0.8 },
  { id: 23, name: "Poppyseed Dressing", category: "dressing", price: 0.8 },
];

export async function GET() {
  return NextResponse.json({ ingredients });
}
