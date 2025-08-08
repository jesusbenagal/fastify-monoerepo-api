import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: "USER" | "ADMIN"; email: string };
    user: { sub: string; role: "USER" | "ADMIN"; email: string };
  }
}
