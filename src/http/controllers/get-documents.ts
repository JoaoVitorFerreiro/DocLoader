import { FastifyReply, FastifyRequest } from "fastify";
import pdf from "pdf-parse";
import {
  compareDocuments,
  extractDataFromText,
} from "@/utils/extractDataFromText";

interface DocumentData {
  [key: string]: Record<string, string>;
}

interface TextContentItem {
  str: string;
}

interface TextContent {
  items: TextContentItem[];
}

const pageToDocType: Record<number, string> = {
  1: "autorizacao_transferencia",
  2: "vistoria_identificacao_veicular",
  3: "renave",
  16: "empresa_vendedora",
};

async function extractTextFromPage(
  buffer: Buffer,
  pageNumbers: number[],
): Promise<string[]> {
  const texts: string[] = [];

  const data = await pdf(buffer, {
    pagerender: (pageData) => {
      return pageData.getTextContent().then((textContent: TextContent) => {
        return textContent.items
          .map((item: TextContentItem) => item.str)
          .join("");
      });
    },
  });

  pageNumbers.forEach((pageNumber) => {
    if (pageNumber <= data.numpages) {
      console.log(`Text for page ${pageNumber} extracted.`);
      texts.push(data.text[pageNumber - 1]);
    }
  });

  return texts;
}

export async function GetDocuments(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    console.log("iniciou");
    const files = await request.saveRequestFiles();
    console.log("arquivos carregados", files);
    if (files.length === 0) {
      console.log("No files were uploaded.");
      reply.status(400).send({ error: "No files uploaded" });
      return;
    }

    const file = files[0];
    console.log(`Processing file: ${file.filename}`);
    const buffer = await file.toBuffer();
    const docData: DocumentData = {};
    const pagesOfInterest = [1, 16, 3, 2];

    const pageTexts = await extractTextFromPage(buffer, pagesOfInterest);
    console.log("Extracted texts from pages:", pageTexts);

    pageTexts.forEach((text, index) => {
      const pageNumber = pagesOfInterest[index];
      const docType = pageToDocType[pageNumber];
      docData[docType] = extractDataFromText(text, docType);
      console.log(
        `Data extracted for document type ${docType}:`,
        docData[docType],
      );
    });

    const errors = compareDocuments(docData);
    console.log("Comparison errors:", errors);
    if (errors.length > 0) {
      reply.send({ errors });
    } else {
      reply.send({ message: "All documents match!" });
    }
  } catch (error) {
    console.error("Error processing documents:", error);
    reply.status(500).send({ error: "Failed to process documents" });
  }
}
