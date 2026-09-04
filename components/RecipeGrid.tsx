"use client";

import { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/RecipeCard";

interface Props {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export default function RecipeGrid({ recipes, onSelect, onDelete }: Props) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 select-none text-center">
        <span className="text-7xl">🍳</span>
        <div>
          <p className="text-4xl font-bold tracking-tight text-stone-900 leading-tight">
            Qu&apos;est-ce qu&apos;on<br />cuisine aujourd&apos;hui ?
          </p>
          <p className="mt-3 text-sm text-stone-400">
            Ajoutez vos ingrédients à gauche et laissez l&apos;IA faire le reste.
          </p>
        </div>
      </div>
    );
  }

  //Ça parcourt le tableau de recettes et 
  // pour chaque recette ça affiche une RecipeCard 
  // avec une animation d'apparition décalée 
  // selon son index.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
      
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          style={{
            animation: "recipeAppear 0.4s ease forwards",
            animationDelay: `${index * 0.06}s`,
            opacity: 0,
          }}
        >
          <RecipeCard recipe={recipe} onSelect={onSelect} onDelete={onDelete}/>
        </div>
      ))}
    </div>
  );
}
