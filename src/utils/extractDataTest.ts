interface Patterns {
  [key: string]: RegExp; // Usando uma assinatura de índice para garantir que qualquer chave de string retorna um RegExp.
}

export function extractDataFromTextTest(text: string): Record<string, string> {
  const patterns: Patterns = {
    renavam: /RENAVAM\s+(\d+)/i,
    placa: /PLACA\s+([A-Z]{3}\d{4})/i,
    anoFabricacao: /ANO\s+FABRICAÇÃO\s+(\d{4})/i,
    anoModelo: /ANO\s+MODELO\s+(\d{4})/i,
    marcaModeloVersao: /MARCA\/\s+MODELO\s+\/\s+VERSÃO\s+([\w\s]+)/i,
    corPredominante: /COR\s+PREDOMINANTE\s+(\w+)/i,
    chassi: /CHASSI\s+(\w+)/i,
    numeroATPVe: /NÚMERO\s+ATPVe\s+(\d+)/i,
    hodometro: /HODÔMETRO\s+(\d+)/i,
    cpfCnpj: /CPF\/CNPJ\s+([\d-]+)/i,
    endereco: /ENDEREÇO\s+([\w\s\d,]+)/i,
    nome: /NOME\s+([\w\s]+)/i,
    cpf: /CPF\s+([\d-]+)/i,
  };

  const fields: Record<string, string> = {};

  Object.keys(patterns).forEach((key) => {
    const regex = patterns[key];
    const match = text.match(regex);
    fields[key] = match ? match[1].trim() : "Not Found";
  });

  return fields;
}
