export async function createContext(opts: { req: Request }) {
  return {
    req: opts.req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
