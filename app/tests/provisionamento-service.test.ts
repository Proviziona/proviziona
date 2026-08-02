import { describe, expect, it } from 'vitest';
import type { ProvisionamentoRepository } from '../src/application/provisionamento-repository';
import { ProvisionamentoService } from '../src/application/provisionamento-service';
import type { Provisionamento } from '../src/domain/provisionamento';

class RepositoryEmMemoria implements ProvisionamentoRepository {
  itens: Provisionamento[] = [];

  async salvar(provisionamento: Provisionamento): Promise<void> {
    this.itens.push(provisionamento);
  }

  async listar(): Promise<Provisionamento[]> {
    return this.itens;
  }
}

describe('ProvisionamentoService', () => {
  it('cria e persiste usando o repositório configurado', async () => {
    const repository = new RepositoryEmMemoria();
    const service = new ProvisionamentoService(repository, {
      gerarId: () => 'provisao-1',
      agora: () => new Date('2026-08-02T15:30:00.000Z'),
    });

    const criado = await service.criar({
      nome: 'Seguro',
      valorAlvoCentavos: 90_000,
      dataAlvo: '2026-12-01',
    });

    expect(repository.itens).toEqual([criado]);
    await expect(service.listar()).resolves.toEqual([criado]);
  });
});
