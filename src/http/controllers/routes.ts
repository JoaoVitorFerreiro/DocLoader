import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { GetDocuments } from "./get-documents";
import pdf from "pdf-parse";
import { extractDataFromTextTest } from "@/utils/extractDataTest";

export async function ApiRoutes(app: FastifyInstance) {
  app.post("/upload", GetDocuments);

  app.post("/teste", async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file(); // Isso assume que há um campo 'file'
    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }
    const buffer = await data.toBuffer();
    const pdfText = await pdf(buffer);
    const textReturn = extractDataFromTextTest(pdfText.text);
    // Aqui você processaria o texto do PDF
    reply.send({ textReturn });
  });
}
