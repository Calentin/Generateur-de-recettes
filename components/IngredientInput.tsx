"use client";

import { Ingredient } from "@/types/ingredient";
import { useState } from "react";

interface Props {
  onAdd: (ingredient: Ingredient) => void;
}

export default function IngredientInput({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      quantity: quantity.trim(),
      createdAt: new Date().toISOString(),
    });
    setName("");
    setQuantity("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="flex items-end gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tomates cerises…"
        className="flex-1 pb-2 border-b border-white/15 focus:border-white/50 outline-none text-sm text-white placeholder-white/25 bg-transparent transition-colors duration-150"
      />
      <input
        type="text"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="qté"
        className="w-14 pb-2 border-b border-white/15 focus:border-white/50 outline-none text-sm text-white placeholder-white/25 bg-transparent transition-colors duration-150 text-center"
      />
      <button
        onClick={handleAdd}
        aria-label="Ajouter"
        className="mb-0.5 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white/30 hover:border-white/60 hover:text-white/80 transition-all duration-150 flex-shrink-0"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
          <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
        </svg>
      </button>
    </div>
  );
}
