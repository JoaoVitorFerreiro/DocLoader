interface Patterns {
  [key: string]: RegExp;
}

const documentPatterns: Record<string, Patterns> = {
  autorizacao_transferencia: {
    renavam: /RENAVAM\s+(\d+)/i,
    placa: /PLACA\s+([A-Z0-9]{7})/i,
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
  },
  empresa_vendedora: {
    cnpj: /NÚMERO\s+DE\s+INSCRIÇÃO\s+(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i,
  },
  renave: {
    codigoRenavam: /CÓDIGO\s+RENAVAM\s+(\d+)/i,
    placa: /PLACA\s+([A-Z0-9]{7})/i,
    chassi: /CHASSI\s+(\w+)/i,
    marcaModelo: /MARCA\/MODELO\s+([\w\s]+)/i,
    cnpj: /CNPJ\s+([\d-./]+)/i,
  },
  vistoria_identificacao_veicular: {
    placa: /PLACA\s+([A-Z0-9]{7})/i,
    numeroMotor: /Nº\s+MOTOR\s+(\w+)/i,
    numeroChassi: /Nº\s+CHASSI\s+(\w+)/i,
    marcaModelo: /MARCA\/MODELO\s+([\w\s]+)/i,
  },
};

export function extractDataFromText(
  text: string,
  documentType: string,
): Record<string, string> {
  const patterns = documentPatterns[documentType];
  const fields: Record<string, string> = {};

  Object.keys(patterns).forEach((key) => {
    const regex = patterns[key];
    const match = text.match(regex);
    fields[key] = match ? match[1].trim() : "Not Found";
  });

  return fields;
}

export function compareDocuments(
  docData: Record<string, Record<string, string>>,
): string[] {
  const errors: string[] = [];
  const keys = Object.keys(docData);

  // Comparar cada campo com os outros documentos
  keys.forEach((key1) => {
    keys.forEach((key2) => {
      if (key1 !== key2) {
        Object.keys(docData[key1]).forEach((field) => {
          if (
            docData[key2][field] &&
            docData[key1][field] !== docData[key2][field]
          ) {
            errors.push(`Mismatch in ${field} between ${key1} and ${key2}`);
          }
        });
      }
    });
  });

  return errors;
}
