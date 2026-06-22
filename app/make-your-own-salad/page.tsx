import SaladBuilder from "./SaladBuilder";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Make Your Own Salad — EatQuick",
};

export default async function MakeYourOwnPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const initialUser = session?.user
    ? { id: session.user.id, name: session.user.name, email: session.user.email }
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="mb-2">Build Your Salad</h1>
      <p className="text-stone-500 mb-10">
        Composez votre bowl sur mesure. Choisissez une veggie, une protéine, une sauce (obligatoires) et un extra (optionnel).
      </p>
      <SaladBuilder initialCustomer={initialUser} />
    </div>
  );
}
