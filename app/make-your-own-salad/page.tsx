import SaladBuilder from "./SaladBuilder";

export const metadata = {
  title: "Make Your Own Salad — EatQuick",
};

export default function MakeYourOwnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="mb-2">Build Your Salad</h1>
      <p className="text-stone-500 mb-10">
        Composez votre bowl sur mesure. Choisissez une veggie, une protéine, une sauce (obligatoires) et un extra (optionnel).
      </p>
      <SaladBuilder />
    </div>
  );
}
