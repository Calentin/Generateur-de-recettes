"use client";

import { Recipe } from "@/types/recipe";

interface Props {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}

export default function RecipeDetail({ recipe, open, onClose }: Props) {
  if (!open || !recipe) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-stone-950/40" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl sm:rounded-xl bg-white shadow-2xl max-h-[96dvh] sm:max-h-[88vh] flex flex-col rounded-t-xl overflow-hidden">

        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-stone-500 hover:text-stone-900 shadow-sm transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>

        <div className="relative h-52 sm:h-64 flex-shrink-0 bg-stone-100">
          {recipe.imageStatus === "loading" && (
            <div className="absolute inset-0 animate-pulse bg-stone-100" />
          )}
          {recipe.imageStatus === "ready" && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          )}
          {recipe.imageStatus === "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-50">
              <span className="text-4xl opacity-10">✕</span>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-xs text-stone-400 mb-1 tabular-nums">{recipe.prepTime}</p>
            <h2 className="text-xl font-bold text-stone-900 leading-tight">{recipe.title}</h2>
            <p className="mt-2.5 text-sm text-stone-500 leading-relaxed">{recipe.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <section>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-4">
                Ingrédients
              </p>
              <ul className="flex flex-col gap-2.5">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-stone-300 flex-shrink-0" />
                    <span className="text-sm text-stone-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-4">
                Préparation
              </p>
              <ol className="flex flex-col gap-4">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[11px] font-bold text-stone-300 flex-shrink-0 pt-0.5 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-stone-600 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
