"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const tesseract_js_1 = require("tesseract.js");
// Configuração do Multer para armazenamento de arquivos
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads"); // Pasta de destino para os arquivos enviados
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname +
            "-" +
            uniqueSuffix +
            "." +
            file.originalname.split(".").pop());
    },
});
const upload = (0, multer_1.default)({ storage });
const app = (0, express_1.default)();
const port = 3333; // Porta do servidor
// Rota POST para receber o arquivo e processar com OCR
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: "Nenhum arquivo enviado!" });
    }
    // Processar o arquivo com Tesseract.js
    try {
        const { data: { text }, } = await (0, tesseract_js_1.recognize)(req.file.path, "por", {
            logger: (m) => console.log(m),
        });
        res.send({ status: "ok", data: text });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "Falha ao processar o documento OCR.",
        });
    }
});
// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
