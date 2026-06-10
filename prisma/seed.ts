import { PrismaClient, Prisma } from "../app/generated/prisma";
import "dotenv/config";

const prisma = new PrismaClient();

const customers: Prisma.CustomerCreateInput[] = [
  { name: "Alice", email: "alice@eat-quick.io", password: "alice123" },
  { name: "Bob", email: "bob@eat-quick.io", password: "bob123" },
  { name: "Carol", email: "carol@eat-quick.io", password: "carol123" },
];

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

async function main() {
  for (const c of customers) {
    await prisma.customer.create({ data: c });
  }

  for (const i of ingredients) {
    await prisma.ingredient.create({ data: i });
  }

  const now = new Date();
  const pickup = (h: number, m: number) => {
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  };

  await prisma.order.create({
    data: {
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
      status: "COMPLETED",
      customerId: 1,
    },
  });

  await prisma.order.create({
    data: {
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
      status: "READY",
      customerId: 2,
    },
  });

  await prisma.order.create({
    data: {
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
      status: "PENDING",
      customerId: null,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
