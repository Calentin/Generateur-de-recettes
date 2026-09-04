CREATE TABLE "ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"quantity" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"prep_time" text NOT NULL,
	"ingredients" text NOT NULL,
	"steps" text NOT NULL,
	"image" text DEFAULT '',
	"image_status" text DEFAULT 'idle',
	"created_at" timestamp DEFAULT now()
);
