import SaladBuilder from "./SaladBuilder";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Make Your Own Salad — EatQuick",
};

export default async function MakeYourOwnPage() {
  const session = await getSession();

  const initialCustomer = session?.userId
    ? await prisma.customer.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true },
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="mb-2">Build Your Salad</h1>
      <p className="text-stone-500 mb-10">
        Composez votre bowl sur mesure. Choisissez une veggie, une protéine, une sauce (obligatoires) et un extra (optionnel).
      </p>
      <SaladBuilder initialCustomer={initialCustomer} />
    </div>
  );
}
