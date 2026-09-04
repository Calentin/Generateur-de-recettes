"use client";

import IngredientInput from "@/components/IngredientInput";
import IngredientList from "@/components/IngredientList";
import RecipeGrid from "@/components/RecipeGrid";
import RecipeDetail from "@/components/RecipeDetail";
import { Ingredient } from "@/types/ingredient";
import { Recipe } from "@/types/recipe";
import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";

export default function Page() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipe, setRecipe] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // useRef permet de créer le transport une seule fois et de garder une référence stable en mémoire
  // Sans useRef, un nouvel objet DefaultChatTransport serait recrée à chaque render ce qui pourrait réinitialiser useChat
  const transportRef = useRef(new DefaultChatTransport({api: "/api/chat"}));
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const {sendMessage, status} = useChat({
    transport: transportRef.current,
    onError: (error) => setLimitMessage(error.message),
  })

  const isLoading = status === "streaming" || status === "submitted";

  async function fetchRecipe(){
    try{
      const res = await fetch("/api/recettes");
      if(!res.ok)  throw new Error("Error fetching Recipe");
      const data: Recipe[] = await res.json();
      setRecipe(data);
      //Synchronise la modale si une recette est ouverte et que son image vient d'arriver
      // Met à jour la recette du modal avec sa version la plus récente depuis la DB (ex: image générée), sans fermer le modal
      setSelectedRecipe((current) => current ? (data.find((r) => r.id === current.id) ?? current) : null);
    } catch (error){
      console.log("Erreur lors de la récupération des recettes", error);
    }
  }

  useEffect(() => {
    async function fetchIngredients(){
      try{
        const res = await fetch ("/api/ingredients")
        if(!res.ok) throw new Error("Error fetching Ingredients")
        setIngredients(await res.json());
      } catch (error){
        console.log("Erreur lors de la récupération des ingrédients", error);
      }
    }
    fetchIngredients();
    fetchRecipe()
  },[])

  useEffect(() => {
    if (status === "ready") fetchRecipe();
  }, [status])

  useEffect(() => {
    const hasLoading = recipe.some((r) => r.imageStatus === "loading");
    if (!hasLoading) return;
    const id = setInterval(fetchRecipe, 3000);
    //le return () => clearInterval(id) c'est le cleanup du useEffect — 
    //il s'exécute automatiquement quand le composant se démonte ou 
    // quand recipe change, pour éviter les fuites mémoire.
    return () => clearInterval(id);
  }, [recipe])

  async function handleAdd(ingredient: Ingredient){
    try{
      const res = await fetch("/api/ingredients",{
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(ingredient),
      })
      if(!res.ok) throw new Error("Error adding ingredient");
      const saved: Ingredient = await res.json();
      setIngredients((prev) => [...prev, saved]);
    } catch (error) {
      console.log("Erreur lors de l'ajout de l'ingrédient", error)
    }
  }

  async function handleDeleteIngredients(id: string){
     try {
      const res = await fetch(`/api/ingredients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error deleting ingredient");
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  }

  async function handleDeleteRecettes(id: string){
    try{
      const res = await fetch(`/api/recettes/${id}`, {method: "DELETE"});
      if (!res.ok) throw new Error("Error deleting recipe");
      //filter retourne un nouveau tableau avec seulement
      //les recettes dont l'id est différent de celui supprimé
      setRecipe((prev) => prev.filter((i) => i.id !== id));
    } catch (error){
      console.log("Error deleting recipe:", error)
    }
  }

  function handleGenerate() {
    setLimitMessage(null);
    const list = ingredients
      .map((i) => `${i.name}${i.quantity ? ` (${i.quantity})` : ""}`)
      .join(", ");
    sendMessage({
      text: `Génère-moi des recettes avec ces ingrédients : ${list}. Réponds uniquement avec un tableau JSON valide de recettes au format Recipe[].`,
    });
  }

  function handleSelect(recipe: Recipe){
    setSelectedRecipe(recipe);
  }

  function handleClose(){
    setSelectedRecipe(null);
  }


  return (
    <div className="flex h-screen overflow-hidden bg-stone-950">

      <aside className="w-64 flex-shrink-0 flex flex-col p-7 overflow-y-auto border-r border-white/[0.06]">
        <div className="flex items-center justify-between mb-10">
          <span className="text-white text-sm font-semibold tracking-tight">Recette.AI</span>
          {isLoading && (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-white/30 animate-pulse" />
              <span className="text-[11px] text-white/30">En cours</span>
            </span>
          )}
        </div>

        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-5">
          Ingrédients
        </p>

        <IngredientInput onAdd={handleAdd} />

        <div className="h-px bg-white/[0.06] my-6" />

        <IngredientList
          ingredients={ingredients}
          onDelete={handleDeleteIngredients}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {limitMessage && (
          <p className="mt-4 text-[11px] leading-snug text-amber-400/80">
            {limitMessage}
          </p>
        )}
      </aside>

      <main className="flex-1 bg-white overflow-y-auto">
        <div className="p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              {recipe.length > 0
                ? `${recipe.length} recette${recipe.length > 1 ? "s" : ""}`
                : "Recettes"}
            </h1>
            {recipe.length > 0 && ingredients.length > 0 && (
              <p className="text-sm text-stone-400 mt-1">
                À partir de {ingredients.length} ingrédient{ingredients.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <RecipeGrid recipes={recipe} onSelect={handleSelect} onDelete={handleDeleteRecettes} />
        </div>
      </main>

      <RecipeDetail recipe={selectedRecipe} open={selectedRecipe !== null} onClose={handleClose} />
    </div>
  );
}
