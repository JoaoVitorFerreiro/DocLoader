import fastify from "fastify";

import fastifyCors from "@fastify/cors";
import { ApiRoutes } from "@/http/controllers/routes";

import multipart from "@fastify/multipart";

export const app = fastify();

app.register(multipart);
app.register(ApiRoutes);
app.register(fastifyCors, {
  origin: true,
});
