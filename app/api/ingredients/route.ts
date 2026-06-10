import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const all = await prisma.ingredient.findMany();

  return NextResponse.json({
    veggies: all
      .filter((i) => i.category === "VEGGIE")
      .map((i) => ({ name: i.label, price: i.price })),
    proteins: all
      .filter((i) => i.category === "PROTEIN")
      .map((i) => ({ name: i.label, price: i.price })),
    sauces: all
      .filter((i) => i.category === "SAUCE")
      .map((i) => ({ name: i.label, price: i.price })),
    extras: all
      .filter((i) => i.category === "EXTRA")
      .map((i) => ({ name: i.label, price: i.price })),
  });
}
