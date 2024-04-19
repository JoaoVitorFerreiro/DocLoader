"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRoutes = void 0;
const tesseract_js_1 = require("tesseract.js");
async function ApiRoutes(app) {
    app.post("/upload", async (request, reply) => {
        console.log(request.headers, request.file, "testando");
        const data = await request.file();
        // Verificar se o arquivo foi recebido corretamente
        if (!data) {
            return reply.status(400).send({
                status: "error",
                message: "Nenhum arquivo foi recebido",
            });
        }
        // Converter o arquivo recebido para Buffer
        const buffer = await data.toBuffer();
        // Processar o arquivo com OCR
        const result = await (0, tesseract_js_1.recognize)(buffer, "por", {
            logger: (m) => console.log(m),
        });
        // Verificar se a resposta do OCR contém dados válidos
        if (!result || !result.data) {
            return reply.status(500).send({
                status: "error",
                message: "Falha ao processar o documento OCR.",
            });
        }
        // Retornar todo o texto extraído
        const text = result.data.text;
        reply.send({
            status: "ok",
            data: text, // Aqui estamos retornando todo o texto diretamente
        });
    });
}
exports.ApiRoutes = ApiRoutes;
