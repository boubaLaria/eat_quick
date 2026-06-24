import { PrismaClient, Prisma } from "../app/generated/prisma";
import { auth } from "../lib/auth";
import "dotenv/config";

const prisma = new PrismaClient();

async function createUser(name: string, email: string, password: string, role: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const res = await auth.api.signUpEmail({
    body: { name, email, password },
  });

  if (res.user && role !== "customer") {
    await prisma.user.update({
      where: { id: res.user.id },
      data: { role },
    });
  }

  return res.user;
}

async function main() {
  await createUser("Manager", "manager@eat-quick.io", "manager123", "staff");
  await createUser("Alice", "alice@eat-quick.io", "alice123", "customer");
  await createUser("Bob", "bob@eat-quick.io", "bob12345", "customer");
  await createUser("Carol", "carol@eat-quick.io", "carol123", "customer");

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

async function seedNews() {
  const articles = [
    {
      slug: "nouveaux-horaires-ouverture",
      title: "Changement de nos horaires d'ouverture",
      content:
        "À partir du 1er juillet, EatQuick adapte ses horaires pour mieux vous servir. Nous serons désormais ouverts du lundi au vendredi de 11h00 à 21h00, et le week-end de 11h00 à 22h00. Ces nouveaux créneaux nous permettent d'accueillir davantage de clients et de préparer vos commandes dans les meilleures conditions. Merci pour votre fidélité !",
      featured_image: "https://picsum.photos/seed/horaires/800/400",
    },
    {
      slug: "nouveau-wrap-poulet-grille",
      title: "Arrivée du Wrap Poulet Grillé sur notre carte",
      content:
        "Nous sommes ravis d'annoncer l'arrivée d'un nouveau produit sur notre carte : le Wrap Poulet Grillé. Préparé avec du poulet mariné maison, des légumes frais de saison et notre nouvelle sauce yaourt-citron, ce wrap complet est disponible dès aujourd'hui à 9,90 €. Succombez à la fraîcheur et à la gourmandise réunies dans un seul plat !",
      featured_image: "https://picsum.photos/seed/wrap/800/400",
    },
    {
      slug: "programme-fidelite-evolution",
      title: "Votre programme de fidélité évolue",
      content:
        "EatQuick améliore son programme de fidélité ! Désormais, chaque euro dépensé vous rapporte 2 points au lieu de 1. Dès 100 points cumulés, bénéficiez d'une remise de 5 € sur votre prochaine commande. Les points sont valables 12 mois et s'accumulent automatiquement sur votre compte. Connectez-vous à votre espace client pour consulter votre solde.",
      featured_image: "https://picsum.photos/seed/fidelite/800/400",
    },
    {
      slug: "partenariat-ferme-locale",
      title: "EatQuick s'engage avec une ferme locale",
      content:
        "Dans notre démarche de développement durable, EatQuick s'est associé à la Ferme du Vallon, producteur local situé à 30 km de notre restaurant. Tomates, concombres, courgettes et herbes aromatiques : une partie de nos légumes provient désormais directement de leur exploitation. Circuit court, fraîcheur garantie et soutien à l'agriculture locale — une initiative dont nous sommes fiers.",
      featured_image: "https://picsum.photos/seed/ferme/800/400",
    },
    {
      slug: "menu-estival-2026",
      title: "Le menu estival 2026 est arrivé !",
      content:
        "L'été commence chez EatQuick avec une sélection de recettes légères et colorées. Découvrez notre Salade Pastèque-Feta, notre Bowl Quinoa-Mangue et notre Gaspacho maison à consommer sur place ou à emporter. Des saveurs ensoleillées pour vous accompagner jusqu'en septembre. Le menu estival est disponible tous les jours en quantités limitées — ne tardez pas !",
      featured_image: "https://picsum.photos/seed/summer/800/400",
    },
  ];

  await prisma.news.deleteMany();
  await prisma.news.createMany({ data: articles });
  console.log(`Seeded ${articles.length} news articles`);
}

main()
  .then(() => seedNews())
  .catch(console.error)
  .finally(() => prisma.$disconnect());
