"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createNews, type CreateNewsState } from "@/actions/createNews";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Publication en cours…" : "Publier l'actualité"}
    </button>
  );
}

export default function CreateNewsForm() {
  const [state, formAction] = useActionState<CreateNewsState | null, FormData>(
    createNews,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (slugRef.current && !slugRef.current.dataset.manual) {
      slugRef.current.value = toSlug(e.target.value);
    }
  }

  function handleSlugChange() {
    if (slugRef.current) {
      slugRef.current.dataset.manual = "1";
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {/* Feedback */}
      {state?.success && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 font-medium">
          ✓ Actualité publiée avec succès. La page /news sera recalculée.
        </div>
      )}
      {state?.error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          type="text"
          required
          onChange={handleTitleChange}
          placeholder="Ex : Nouveaux horaires d'été"
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
          Slug (URL) <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-400 whitespace-nowrap">/news/</span>
          <input
            ref={slugRef}
            name="slug"
            type="text"
            required
            onChange={handleSlugChange}
            placeholder="nouveaux-horaires-ete"
            className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <p className="text-xs text-stone-400 mt-1">
          Généré depuis le titre — modifiable. Minuscules et tirets uniquement.
        </p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
          Contenu <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          required
          rows={6}
          placeholder="Rédigez votre article ici…"
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-y"
        />
      </div>

      {/* Featured image */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
          URL de l&apos;image d&apos;illustration <span className="text-red-500">*</span>
        </label>
        <input
          name="featured_image"
          type="url"
          required
          placeholder="https://picsum.photos/seed/mon-article/800/400"
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <p className="text-xs text-stone-400 mt-1">
          Utilisez picsum.photos (ex: https://picsum.photos/seed/MOT/800/400) ou cdn.dummyjson.com.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
