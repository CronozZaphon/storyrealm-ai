import { mysqlTable, serial, varchar, text, json, timestamp, int } from 'drizzle-orm/mysql-core';

export const stories = mysqlTable('stories', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  genre: varchar('genre', { length: 100 }),
  authorName: varchar('author_name', { length: 255 }),
  coverImage: text('cover_image'),
  status: varchar('status', { length: 50 }).default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chapters = mysqlTable('chapters', {
  id: serial('id').primaryKey(),
  storyId: int('story_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  orderNum: int('order_num').notNull(),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const characters = mysqlTable('characters', {
  id: serial('id').primaryKey(),
  storyId: int('story_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  appearance: text('appearance'),
  personality: text('personality'),
  role: varchar('role', { length: 100 }),
  avatarPrompt: text('avatar_prompt'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const manhuaPages = mysqlTable('manhua_pages', {
  id: serial('id').primaryKey(),
  storyId: int('story_id').notNull(),
  chapterId: int('chapter_id').notNull(),
  pageNumber: int('page_number').notNull(),
  panelData: json('panel_data').$type<{
    panels: { imageUrl: string; dialogue: string; narration: string; characters: string[] }[]
  }>(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const audiobooks = mysqlTable('audiobooks', {
  id: serial('id').primaryKey(),
  storyId: int('story_id').notNull(),
  chapterId: int('chapter_id'),
  audioUrl: text('audio_url'),
  musicUrl: text('music_url'),
  voice: varchar('voice', { length: 100 }),
  ambience: varchar('ambience', { length: 100 }),
  status: varchar('status', { length: 50 }).default('generating').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userSettings = mysqlTable('user_settings', {
  id: serial('id').primaryKey(),
  openaiKey: varchar('openai_key', { length: 255 }),
  claudeKey: varchar('claude_key', { length: 255 }),
  preferredAi: varchar('preferred_ai', { length: 50 }).default('free'),
  theme: varchar('theme', { length: 50 }).default('dark'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Story = typeof stories.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type ManhuaPage = typeof manhuaPages.$inferSelect;
export type Audiobook = typeof audiobooks.$inferSelect;
export type UserSetting = typeof userSettings.$inferSelect;
