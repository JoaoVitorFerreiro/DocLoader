/* eslint-disable @typescript-eslint/no-unused-vars */
// Em algum lugar em seus arquivos de definição de tipo, por exemplo, em 'src/types/fastify.d.ts'
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    file: () => Promise<{
      file: NodeJS.ReadableStream;
      filename: string;
      encoding: string;
      mimetype: string;
      toBuffer: () => Promise<Buffer>;
    }>;
  }
}
