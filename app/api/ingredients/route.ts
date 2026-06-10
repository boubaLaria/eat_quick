import { NextResponse } from "next/server";

const veggies = [
  { name: "salad", price: 5 },
  { name: "pasta", price: 6 },
  { name: "rice", price: 6 },
  { name: "quinoa", price: 7 },
  { name: "lentils", price: 6 },
];

const proteins = [
  { name: "tuna", price: 5 },
  { name: "eggs", price: 4 },
  { name: "tofu", price: 4 },
  { name: "chicken", price: 6 },
];

const sauces = [
  { name: "mustard", price: 1 },
  { name: "vinegar", price: 1 },
  { name: "lemon", price: 1 },
  { name: "sweet curry", price: 2 },
  { name: "tandoori", price: 2 },
];

const extras = [
  { name: "nuts", price: 1 },
  { name: "sesame seeds", price: 0.5 },
  { name: "dried fruits", price: 1 },
  { name: "pickles", price: 0.5 },
  { name: "feta cheese", price: 2 },
];

export async function GET() {
  return NextResponse.json({ veggies, proteins, sauces, extras });
}
