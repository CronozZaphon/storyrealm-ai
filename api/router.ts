import { router } from './trpc.js'
import { storyRouter } from './routers/story.js'
import { aiRouter } from './routers/ai.js'
import { manhuaRouter } from './routers/manhua.js'
import { audiobookRouter } from './routers/audiobook.js'
import { settingsRouter } from './routers/settings.js'

export const appRouter = router({
  story: storyRouter,
  ai: aiRouter,
  manhua: manhuaRouter,
  audiobook: audiobookRouter,
  settings: settingsRouter,
})

export type AppRouter = typeof appRouter;
