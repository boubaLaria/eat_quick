import SignupForm from "@/components/SignupForm";

export const metadata = {
  title: "Inscription — EatQuick",
};

export default function SignupPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="card p-8 w-full max-w-sm space-y-5">
        <h1 className="text-xl text-center">Créer un compte</h1>
        <p className="text-stone-500 text-sm text-center">
          Rejoignez EatQuick pour commander facilement
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
