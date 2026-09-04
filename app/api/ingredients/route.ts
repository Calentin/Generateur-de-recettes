import { db } from "@/lib/db";
import { ingredients } from "@/lib/schema";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const result = await db.select().from(ingredients).limit(60);
    return NextResponse.json(result);
}

export async function POST(request: Request) {
    const body = await request.json();
    const name = body.name;
    const quantity = body.quantity;

    if (!name && !quantity) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const result = await db.insert(ingredients).values({name, quantity}).returning();
    //extrait cet unique objet du tableau pour renvoyer directement l'ingredient, 
    // pas un tableau d'ingrédients
    return NextResponse.json(result[0]); 
    
}