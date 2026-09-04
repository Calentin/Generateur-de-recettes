"use client";

import { Recipe } from "@/types/recipe";

interface Props {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export default function RecipeCard({ recipe, onSelect, onDelete }: Props) {
  return (
    <article onClick={() => onSelect(recipe)} className="group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 mb-3">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
          aria-label="Supprimer la recette"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-white flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 shadow-sm transition-all duration-150"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>
        {recipe.imageStatus === "loading" && (
          <div className="absolute inset-0 bg-stone-100 animate-pulse" />
        )}
        {recipe.imageStatus === "ready" && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        )}
        {recipe.imageStatus === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
            <span className="text-2xl opacity-20">✕</span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-stone-900 leading-snug group-hover:text-stone-500 transition-colors duration-200">
          {recipe.title}
        </h3>
        <span className="text-xs text-stone-400 flex-shrink-0 mt-0.5 tabular-nums">
          {recipe.prepTime}
        </span>
      </div>
      <p className="mt-1 text-xs text-stone-400 leading-relaxed line-clamp-2">
        {recipe.description}
      </p>
    </article>
  );
}
