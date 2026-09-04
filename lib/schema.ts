import {pgTable, uuid, text, timestamp} from 'drizzle-orm/pg-core'

export const recipes = pgTable('recipes',{
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    prepTime: text('prep_time').notNull(),
    ingredients: text('ingredients').notNull(),
    steps: text('steps').notNull(),
    image: text('image').default(''),
    imageStatus: text('image_status').default('idle'),
    createdAt: timestamp('created_at').defaultNow(),
})

export const ingredients = pgTable('ingredients', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    quantity: text('quantity').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})