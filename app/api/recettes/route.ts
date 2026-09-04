import { db } from "@/lib/db";
import { recipes } from "@/lib/schema";
import { NextResponse } from "next/server";
import type { Recipe } from "@/types/recipe";
import type { ImageStatus } from "@/types/recipe";

export async function GET() {
  try {
    const rows = await db.select().from(recipes);
    const result: Recipe[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image ?? "",
      imageStatus: (row.imageStatus ?? "idle") as ImageStatus,
      prepTime: row.prepTime,
      ingredients: JSON.parse(row.ingredients) as string[],
      steps: JSON.parse(row.steps) as string[],
    }));
    return NextResponse.json(result);
  } catch (err) {
    console.error("Erreur GET /api/recettes :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}