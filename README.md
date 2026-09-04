# AI Recettes

🇫🇷 [Français](#français) · 🇬🇧 [English](#english)

**Démo en ligne / Live demo :** https://papilo-nu.vercel.app

---

## Français

Génère des recettes de cuisine à partir des ingrédients disponibles, en s'appuyant sur GPT (texte + images).

### Stack

- Next.js 16 / React 19
- Drizzle ORM + PostgreSQL (Neon)
- Vercel AI SDK + OpenAI (`gpt-4.1-mini`, `gpt-image-1`)

### Configuration

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

### Développement

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Déploiement

L'app se déploie facilement sur [Vercel](https://vercel.com/new) : importez le repo, renseignez `DATABASE_URL` et `OPENAI_API_KEY` dans les variables d'environnement du projet, puis déployez.

Pour protéger votre clé OpenAI d'un usage abusif une fois l'app publique, `app/api/chat/route.ts` limite le nombre de générations de recettes par visiteur et par jour (`IP_LIMIT_PER_DAY`) ainsi qu'un plafond global quotidien pour tout le site (`GLOBAL_LIMIT_PER_DAY`). Ajustez ces constantes selon votre budget.

---

## English

Generates cooking recipes from your available ingredients, powered by GPT (text + images).

### Stack

- Next.js 16 / React 19
- Drizzle ORM + PostgreSQL (Neon)
- Vercel AI SDK + OpenAI (`gpt-4.1-mini`, `gpt-image-1`)

### Setup

1. Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

- `DATABASE_URL`: connection string for your PostgreSQL database (e.g. [Neon](https://neon.tech), Supabase, or a local instance)
- `OPENAI_API_KEY`: your OpenAI API key

2. Push the schema to your database:

```bash
npx drizzle-kit push
```

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deployment

The app deploys easily on [Vercel](https://vercel.com/new): import the repo, set `DATABASE_URL` and `OPENAI_API_KEY` as environment variables, then deploy.

To protect your OpenAI key from abuse once the app is public, `app/api/chat/route.ts` caps recipe generations per visitor per day (`IP_LIMIT_PER_DAY`) and enforces a global daily limit for the whole site (`GLOBAL_LIMIT_PER_DAY`). Adjust these constants to fit your budget.
