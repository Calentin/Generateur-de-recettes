"use client";

import { Ingredient } from "@/types/ingredient";

interface Props {
  ingredients: Ingredient[];
  onDelete: (id: string) => void;
  onGenerate: () => void;
  isLoading?: boolean;
}

export default function IngredientList({ ingredients, onDelete, onGenerate, isLoading }: Props) {
  const isEmpty = ingredients.length === 0;

  return (
    <div className="flex flex-col gap-6 flex-1">
      {isEmpty ? (
        <p className="text-xs text-white/20 py-1">Aucun ingrédient pour l'instant.</p>
      ) : (
        <ul className="flex flex-col flex-1">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.id}
              className="group flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0"
            >
              <span className="text-sm text-white/75">{ingredient.name}</span>
              <div className="flex items-center gap-3">
                {ingredient.quantity && (
                  <span className="text-xs text-white/30">{ingredient.quantity}</span>
                )}
                <button
                  onClick={() => onDelete(ingredient.id)}
                  aria-label={`Supprimer ${ingredient.name}`}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all duration-150"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onGenerate}
        disabled={isEmpty || isLoading}
        className="w-full py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200
          bg-white text-stone-900 hover:bg-stone-100
          disabled:bg-white/10 disabled:text-white/20 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
            Génération…
          </span>
        ) : (
          "Générer des recettes"
        )}
      </button>
    </div>
  );
}
