import PaymentClient from "./PaymentClient";

export const metadata = {
  title: "Paiement — EatQuick",
};

type OrderItem = { name: string; price: number };

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{
    method?: string;
    name?: string;
    pickup?: string;
    total?: string;
    items?: string;
  }>;
}) {
  const {
    method = "card",
    name = "Client",
    pickup = "",
    total = "0.00",
    items: itemsRaw,
  } = await searchParams;

  let items: OrderItem[] = [];
  try {
    if (itemsRaw) items = JSON.parse(itemsRaw);
  } catch {
    // malformed items param — ignore, show empty recap
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="mb-2">Paiement</h1>
      <p className="text-stone-500 mb-8">
        Bonjour <strong>{name}</strong>, finalisez votre commande ci-dessous.
      </p>
      <PaymentClient
        method={method}
        name={name}
        pickup={pickup}
        total={total}
        items={items}
      />
    </div>
  );
}
