import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";
import { chatRequests, ingredients, recipes } from "@/lib/schema";
import { db } from "@/lib/db";
import { and, eq, gte, sql } from "drizzle-orm";
import type { Recipe } from "@/types/recipe";

// Protège la clé OpenAI d'un usage abusif une fois l'app déployée publiquement.
const IP_LIMIT_PER_DAY = 3;
const GLOBAL_LIMIT_PER_DAY = 30;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

async function countRequestsSince(since: Date, ip?: string): Promise<number> {
  const conditions = ip ? and(eq(chatRequests.ip, ip), gte(chatRequests.createdAt, since)) : gte(chatRequests.createdAt, since);
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(chatRequests)
    .where(conditions);
  return row?.count ?? 0;
}

export async function POST(request: Request) {
  const { messages } = await request.json();
  const ip = getClientIp(request);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const globalCount = await countRequestsSince(since);
  if (globalCount >= GLOBAL_LIMIT_PER_DAY) {
    return new Response(
      "La limite quotidienne de génération de recettes a été atteinte pour l'ensemble des visiteurs. Réessayez demain.",
      { status: 429 }
    );
  }

  const ipCount = await countRequestsSince(since, ip);
  if (ipCount >= IP_LIMIT_PER_DAY) {
    return new Response(
      "Vous avez atteint la limite de génération de recettes pour aujourd'hui. Réessayez demain.",
      { status: 429 }
    );
  }

  await db.insert(chatRequests).values({ ip });

  const allIngredients = await db.select().from(ingredients).limit(100);
  const ingredientList = allIngredients
    .map((i) => `${i.name} (${i.quantity})`)
    .join(", ");

  const result = streamText({
    model: openai("gpt-4.1-mini"),
    system: `Tu es un chef cuisinier étoilé qui rédige des recettes précises, savoureuses et détaillées.

Ingrédients disponibles :
${ingredientList}

Génère EXACTEMENT 3 recettes en JSON pur, sans markdown, sans texte autour :
{
  "recipes": [
    {
      "title": "Nom du plat précis et appétissant",
      "description": "2-3 phrases évocatrices : texture, saveurs, occasion idéale. Donne envie.",
      "prepTime": "35 min",
      "ingredients": [
        "200g de pâtes (poids exact)",
        "2 gousses d'ail, émincées finement",
        "1 c. à s. d'huile d'olive extra vierge",
        "Sel fin et poivre noir fraîchement moulu"
      ],
      "steps": [
        "Étape courte mais précise avec geste technique si nécessaire (ex: faire revenir à feu vif 2 min jusqu'à coloration dorée).",
        "Chaque étape = une action. Minimum 5 étapes, idéalement 6-8.",
        "Inclure températures (180°C), durées (10 min), textures attendues (jusqu'à ce que la sauce nappe la cuillère).",
        "Dernière étape : dressage et conseil de dégustation."
      ]
    }
  ]
}

Règles strictes :
- Utilise UNIQUEMENT les ingrédients listés, tu peux supposer sel, poivre, eau et matières grasses basiques
- Quantités précises pour chaque ingrédient
- Steps détaillés : gestes, durées, températures, textures visuelles
- Description évocatrice, pas générique
- JSON valide uniquement, rien d'autre`,

    messages: await convertToModelMessages(messages),

    onFinish: async ({ text }) => {
      try {
        const clean = text.replace(/```json|```/g, "").trim();
        const raw = JSON.parse(clean);

        // Ce que l'IA retourne : Recipe sans les champs serveur (id, image, imageStatus).
        type RecipeInput = Omit<Recipe, "id" | "image" | "imageStatus">;

        // Le modèle GPT peut répondre dans deux formats différents selon son humeur :
        //   Format A : { "recipes": [ {...}, {...} ] }  → objet avec clé "recipes"
        //   Format B : [ {...}, {...} ]                 → tableau direct
        //
        // On normalise les deux cas pour toujours obtenir un tableau propre dans recipeList.
        // Le (() => { throw ... })() est une fonction anonyme appelée immédiatement :
        // seul moyen de throw à l'intérieur d'un ternaire (qui attend une expression).
        const recipeList: RecipeInput[] = Array.isArray(raw) //Est-ce que raw est un tableau ?
          ? raw //Oui → c'est le format B, on prend raw directement
          : Array.isArray(raw.recipes) //Non → est-ce que raw.recipes est un tableau ?
          ? raw.recipes //Oui → c'est le format A, on prend raw.recipes
          : (() => { throw new Error(`Format inattendu : ${JSON.stringify(raw).slice(0, 200)}`); })();

        // Insère toutes les recettes immédiatement avec imageStatus "loading"
        // puis génère les images en arrière-plan sans bloquer la réponse streaming.
        const insertedRows = await Promise.all(
          recipeList.map((recipe) =>
            db
              .insert(recipes)
              .values({
                title: recipe.title,
                description: recipe.description,
                prepTime: recipe.prepTime,
                ingredients: JSON.stringify(recipe.ingredients),
                steps: JSON.stringify(recipe.steps),
                imageStatus: "loading",
              })
              .returning({ id: recipes.id, title: recipes.title })
          )
        );

        // Génération d'image en parallèle pour chaque recette (fire-and-forget).
        // On utilise le client openai directement : le SDK AI ne supporte plus
        // les paramètres de l'ancienne API OpenAI (response_format supprimé).
        const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        insertedRows.forEach((rows, index) => {
          const row = rows[0];
          const recipe = recipeList[index];

          openaiClient.images.generate({
            model: "gpt-image-1",
            prompt: `Food photography of ${recipe.title}, ${recipe.description}, natural lighting, appetizing`,
            n: 1,
            size: "1024x1024",
          })
            .then(async (response) => {
              const b64 = response.data?.[0]?.b64_json;
              if (!b64) throw new Error("b64_json manquant dans la réponse");
              console.log("✅ Image générée pour :", row.title);
              await db
                .update(recipes)
                .set({
                  image: `data:image/png;base64,${b64}`,
                  imageStatus: "ready",
                })
                .where(eq(recipes.id, row.id));
            })
            .catch(async (err: unknown) => {
              console.error("❌ Erreur génération image :", err);
              await db
                .update(recipes)
                .set({ imageStatus: "error" })
                .where(eq(recipes.id, row.id));
            });
        });
      } catch (err) {
        console.error("Erreur sauvegarde recettes :", err);
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
