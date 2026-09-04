import { db } from "@/lib/db";
import { ingredients } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}){
    const {id} = await params;
    await db.delete(ingredients).where(eq(ingredients.id, id)).returning();
    return NextResponse.json({message: "Ingredients supprimé"})
}

export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const body = await request.json();
    const name = body.name;
    const quantity = body.quantity;

    if (!name || !quantity) {
        return NextResponse.json({ error: "Name and quantity are required" }, { status: 400 });
    }

    const result = await db.update(ingredients).set({name, quantity}).where(eq(ingredients.id, id)).returning();
    return NextResponse.json(result);
}