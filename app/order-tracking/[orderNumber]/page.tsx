import Link from "next/link";
import prisma from "@/lib/prisma";
import OrderTrackingView from "./OrderTrackingView";

type Props = { params: Promise<{ orderNumber: string }> };

const ORDER_NUMBER_REGEX = /^EQ-\d{8}-\d{4}$/;

function maskName(name: string): string {
  if (name.length <= 2) return name + "***";
  return name.slice(0, 2) + "***";
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local[0]}***@${domain}`;
}

export async function generateMetadata({ params }: Props) {
  const { orderNumber } = await params;
  return { title: `Commande ${orderNumber} — EatQuick` };
}

export default async function OrderTrackingPage({ params }: Props) {
  const { orderNumber } = await params;

  // Validation du format du slug
  if (!ORDER_NUMBER_REGEX.test(orderNumber)) {
    return (
      <main className="max-w-lg mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4">
          <p className="text-2xl">⚠️</p>
          <h1 className="text-lg font-bold text-red-700">Format invalide</h1>
          <p className="text-sm text-red-600">
            Le numéro{" "}
            <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono">
              {orderNumber}
            </code>{" "}
            n&apos;est pas un format valide.
            <br />
            Format attendu :{" "}
            <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono">
              EQ-20260610-1001
            </code>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/make-your-own-salad"
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Passer une nouvelle commande
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-medium rounded-xl transition-colors"
            >
              Contacter l&apos;équipe
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      orderTime: true,
      pickupTime: true,
      customerName: true,
      customerEmail: true,
      items: true,
      status: true,
      discount: true,
    },
  });

  // Commande introuvable
  if (!order) {
    return (
      <main className="max-w-lg mx-auto py-12 px-4">
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center space-y-4">
          <p className="text-2xl">🔍</p>
          <h1 className="text-lg font-bold text-stone-700">
            Commande introuvable
          </h1>
          <p className="text-sm text-stone-500">
            Aucune commande trouvée pour le numéro{" "}
            <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono">
              {orderNumber}
            </code>
            .
            <br />
            Vérifiez le numéro reçu dans votre confirmation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/make-your-own-salad"
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Passer une nouvelle commande
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-medium rounded-xl transition-colors"
            >
              Contacter l&apos;équipe
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Parsing des ingrédients
  let items: { name: string; price: number }[] = [];
  try {
    items = JSON.parse(order.items);
  } catch {
    // JSON malformé — liste vide
  }

  const rawTotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = order.discount ?? 0;
  const total = Math.max(0, rawTotal - discount);

  const pickupFormatted = order.pickupTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderDateFormatted = order.orderTime.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="max-w-lg mx-auto py-12 px-4">
      <OrderTrackingView
        order={{
          orderNumber: order.orderNumber,
          orderDateFormatted,
          pickupFormatted,
          maskedName: maskName(order.customerName),
          maskedEmail: maskEmail(order.customerEmail),
          items,
          total,
          discount,
          status: order.status,
        }}
      />
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
