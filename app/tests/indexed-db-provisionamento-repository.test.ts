import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Provisionamento } from '../src/domain/provisionamento';
import { IndexedDbProvisionamentoRepository } from '../src/infra/indexed-db-provisionamento-repository';

const excluirBanco = (): Promise<void> =>
  new Promise((resolve, reject) => {
    const requisicao = indexedDB.deleteDatabase('proviziona-local');
    requisicao.onsuccess = () => resolve();
    requisicao.onerror = () => reject(requisicao.error);
  });

describe('IndexedDbProvisionamentoRepository', () => {
  beforeEach(excluirBanco);
  afterEach(excluirBanco);

  it('mantém os provisionamentos no dispositivo e lista os mais recentes primeiro', async () => {
    const repository = new IndexedDbProvisionamentoRepository();
    const antigo: Provisionamento = {
      id: '1',
      nome: 'IPVA',
      valorAlvoCentavos: 100_000,
      dataAlvo: '2027-01-01',
      criadoEm: '2026-08-01T10:00:00.000Z',
    };
    const recente: Provisionamento = {
      id: '2',
      nome: 'Seguro',
      valorAlvoCentavos: 80_000,
      dataAlvo: '2027-02-01',
      criadoEm: '2026-08-02T10:00:00.000Z',
    };

    await repository.salvar(antigo);
    await repository.salvar(recente);

    await expect(repository.listar()).resolves.toEqual([recente, antigo]);
  });

  it('atualiza um registro com o mesmo identificador', async () => {
    const repository = new IndexedDbProvisionamentoRepository();
    const original: Provisionamento = {
      id: '1',
      nome: 'IPVA',
      valorAlvoCentavos: 100_000,
      dataAlvo: '2027-01-01',
      criadoEm: '2026-08-01T10:00:00.000Z',
    };

    await repository.salvar(original);
    await repository.salvar({ ...original, nome: 'IPVA 2027' });

    await expect(repository.listar()).resolves.toEqual([{ ...original, nome: 'IPVA 2027' }]);
  });
});
