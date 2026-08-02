import { describe, expect, it } from 'vitest';
import {
  converterValorParaCentavos,
  criarProvisionamento,
  ErroDeValidacao,
} from '../src/domain/provisionamento';

const dependencias = {
  gerarId: () => 'id-1',
  agora: () => new Date('2026-08-02T12:00:00.000Z'),
};

describe('criarProvisionamento', () => {
  it('normaliza e cria um provisionamento válido', () => {
    expect(
      criarProvisionamento(
        { nome: '  IPVA  ', valorAlvoCentavos: 180_000, dataAlvo: '2027-01-10' },
        dependencias,
      ),
    ).toEqual({
      id: 'id-1',
      nome: 'IPVA',
      valorAlvoCentavos: 180_000,
      dataAlvo: '2027-01-10',
      criadoEm: '2026-08-02T12:00:00.000Z',
    });
  });

  it.each([
    {
      entrada: { nome: ' ', valorAlvoCentavos: 100, dataAlvo: '2027-01-10' },
      mensagem: 'Informe o nome',
    },
    {
      entrada: { nome: 'IPVA', valorAlvoCentavos: 0, dataAlvo: '2027-01-10' },
      mensagem: 'maior que zero',
    },
    {
      entrada: { nome: 'IPVA', valorAlvoCentavos: 10.5, dataAlvo: '2027-01-10' },
      mensagem: 'maior que zero',
    },
    {
      entrada: { nome: 'IPVA', valorAlvoCentavos: 100, dataAlvo: '2027-02-30' },
      mensagem: 'data válida',
    },
  ])('rejeita dados inválidos', ({ entrada, mensagem }) => {
    expect(() => criarProvisionamento(entrada, dependencias)).toThrow(mensagem);
  });
});

describe('converterValorParaCentavos', () => {
  it.each([
    { valor: '10', centavos: 1_000 },
    { valor: '10,50', centavos: 1_050 },
    { valor: '0.01', centavos: 1 },
  ])('converte $valor para centavos', ({ valor, centavos }) => {
    expect(converterValorParaCentavos(valor)).toBe(centavos);
  });

  it.each(['', 'abc', '10,999', '-1', '1.2.3'])('rejeita o valor inválido %s', (valor) => {
    expect(() => converterValorParaCentavos(valor)).toThrow(ErroDeValidacao);
  });
});
