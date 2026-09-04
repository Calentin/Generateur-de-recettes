import { db } from "@/lib/db";
import { recipes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await db.delete(recipes).where(eq(recipes.id, id)).returning();
    return NextResponse.json({ message: "Recipe deleted" });
}
