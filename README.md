# AI Recettes

Génère des recettes de cuisine à partir des ingrédients disponibles, en s'appuyant sur GPT (texte + images).

## Stack

- Next.js 16 / React 19
- Drizzle ORM + PostgreSQL (Neon)
- Vercel AI SDK + OpenAI (`gpt-4.1-mini`, `gpt-image-1`)

## Configuration

1. Copiez `.env.example` en `.env` et renseignez vos propres valeurs :

```bash
cp .env.example .env
```

- `DATABASE_URL` : chaîne de connexion vers votre base PostgreSQL (ex. [Neon](https://neon.tech), Supabase, ou une instance locale)
- `OPENAI_API_KEY` : votre clé API OpenAI

2. Créez les tables sur votre base :

```bash
npx drizzle-kit push
```

## Développement

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement

L'app se déploie facilement sur [Vercel](https://vercel.com/new) : importez le repo, renseignez `DATABASE_URL` et `OPENAI_API_KEY` dans les variables d'environnement du projet, puis déployez.

Pour protéger votre clé OpenAI d'un usage abusif une fois l'app publique, `app/api/chat/route.ts` limite le nombre de générations de recettes par visiteur et par jour (`IP_LIMIT_PER_DAY`) ainsi qu'un plafond global quotidien pour tout le site (`GLOBAL_LIMIT_PER_DAY`). Ajustez ces constantes selon votre budget.
