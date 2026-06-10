import { PrismaClient, Prisma } from "../app/generated/prisma";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // Staff
  await prisma.customer.upsert({
    where: { email: "manager@eat-quick.io" },
    update: {},
    create: {
      name: "Manager",
      email: "manager@eat-quick.io",
      password: await bcrypt.hash("manager123", 10),
      role: "STAFF",
    },
  });

  // Customers
  const customers: { name: string; email: string; password: string }[] = [
    { name: "Alice", email: "alice@eat-quick.io", password: "alice123" },
    { name: "Bob", email: "bob@eat-quick.io", password: "bob123" },
    { name: "Carol", email: "carol@eat-quick.io", password: "carol123" },
  ];

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: { name: c.name, email: c.email, password: await bcrypt.hash(c.password, 10) },
    });
  }

  // Ingredients
  const ingredients: Prisma.IngredientCreateInput[] = [
    { category: "VEGGIE", label: "salad", price: 5 },
    { category: "VEGGIE", label: "pasta", price: 6 },
    { category: "VEGGIE", label: "rice", price: 6 },
    { category: "VEGGIE", label: "quinoa", price: 7 },
    { category: "VEGGIE", label: "lentils", price: 6 },
    { category: "PROTEIN", label: "tuna", price: 5 },
    { category: "PROTEIN", label: "eggs", price: 4 },
    { category: "PROTEIN", label: "tofu", price: 4 },
    { category: "PROTEIN", label: "chicken", price: 6 },
    { category: "SAUCE", label: "mustard", price: 1 },
    { category: "SAUCE", label: "vinegar", price: 1 },
    { category: "SAUCE", label: "lemon", price: 1 },
    { category: "SAUCE", label: "sweet curry", price: 2 },
    { category: "SAUCE", label: "tandoori", price: 2 },
    { category: "EXTRA", label: "nuts", price: 1 },
    { category: "EXTRA", label: "sesame seeds", price: 0.5 },
    { category: "EXTRA", label: "dried fruits", price: 1 },
    { category: "EXTRA", label: "pickles", price: 0.5 },
    { category: "EXTRA", label: "feta cheese", price: 2 },
  ];

  await prisma.ingredient.deleteMany();
  await prisma.ingredient.createMany({ data: ingredients });

  const now = new Date();
  const pickup = (h: number, m: number) => {
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const orders = [
    {
      orderNumber: "EQ-20260610-1001",
      pickupTime: pickup(12, 30),
      customerName: "Alice",
      customerEmail: "alice@eat-quick.io",
      customerPhone: "0600000001",
      items: JSON.stringify([
        { name: "quinoa", price: 7 },
        { name: "chicken", price: 6 },
        { name: "lemon", price: 1 },
        { name: "feta cheese", price: 2 },
      ]),
      status: "COMPLETED" as const,
      customerId: null as number | null,
    },
    {
      orderNumber: "EQ-20260610-1002",
      pickupTime: pickup(13, 0),
      customerName: "Bob",
      customerEmail: "bob@eat-quick.io",
      customerPhone: "0600000002",
      items: JSON.stringify([
        { name: "rice", price: 6 },
        { name: "tofu", price: 4 },
        { name: "tandoori", price: 2 },
      ]),
      status: "READY" as const,
      customerId: null,
    },
    {
      orderNumber: "EQ-20260610-1003",
      pickupTime: pickup(14, 15),
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "0612345678",
      items: JSON.stringify([
        { name: "salad", price: 5 },
        { name: "eggs", price: 4 },
        { name: "mustard", price: 1 },
        { name: "nuts", price: 1 },
      ]),
      status: "PENDING" as const,
      customerId: null,
    },
  ];

  for (const o of orders) {
    await prisma.order.upsert({
      where: { orderNumber: o.orderNumber },
      update: {},
      create: o,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
