export interface Provisionamento {
  id: string;
  nome: string;
  valorAlvoCentavos: number;
  dataAlvo: string;
  criadoEm: string;
}

export interface NovoProvisionamento {
  nome: string;
  valorAlvoCentavos: number;
  dataAlvo: string;
}

export interface CriarProvisionamentoDependencias {
  gerarId: () => string;
  agora: () => Date;
}

export class ErroDeValidacao extends Error {}

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

export function criarProvisionamento(
  entrada: NovoProvisionamento,
  dependencias: CriarProvisionamentoDependencias,
): Provisionamento {
  const nome = entrada.nome.trim();

  if (!nome) {
    throw new ErroDeValidacao('Informe o nome do provisionamento.');
  }

  if (!Number.isSafeInteger(entrada.valorAlvoCentavos) || entrada.valorAlvoCentavos <= 0) {
    throw new ErroDeValidacao('Informe um valor maior que zero.');
  }

  if (!dataEhValida(entrada.dataAlvo)) {
    throw new ErroDeValidacao('Informe uma data válida.');
  }

  return {
    id: dependencias.gerarId(),
    nome,
    valorAlvoCentavos: entrada.valorAlvoCentavos,
    dataAlvo: entrada.dataAlvo,
    criadoEm: dependencias.agora().toISOString(),
  };
}

export function converterValorParaCentavos(valor: string): number {
  const normalizado = valor.trim().replace(',', '.');

  if (!/^\d+(\.\d{1,2})?$/.test(normalizado)) {
    throw new ErroDeValidacao('Informe um valor monetário válido.');
  }

  return Math.round(Number(normalizado) * 100);
}

function dataEhValida(data: string): boolean {
  if (!FORMATO_DATA.test(data)) {
    return false;
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const dataUtc = new Date(Date.UTC(ano!, mes! - 1, dia!));

  return (
    dataUtc.getUTCFullYear() === ano &&
    dataUtc.getUTCMonth() === mes! - 1 &&
    dataUtc.getUTCDate() === dia
  );
}
