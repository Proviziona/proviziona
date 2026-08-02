import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProvisionamentoRepository } from '../src/application/provisionamento-repository';
import { ProvisionamentoService } from '../src/application/provisionamento-service';
import type { Provisionamento } from '../src/domain/provisionamento';
import { montarApp } from '../src/ui/app';

class RepositoryEmMemoria implements ProvisionamentoRepository {
  itens: Provisionamento[] = [];

  async salvar(provisionamento: Provisionamento): Promise<void> {
    this.itens.push(provisionamento);
  }

  async listar(): Promise<Provisionamento[]> {
    return [...this.itens];
  }
}

describe('interface do aplicativo', () => {
  let raiz: HTMLDivElement;
  let repository: RepositoryEmMemoria;
  let service: ProvisionamentoService;

  beforeEach(() => {
    raiz = document.createElement('div');
    repository = new RepositoryEmMemoria();
    service = new ProvisionamentoService(repository, {
      gerarId: () => 'id-interface',
      agora: () => new Date('2026-08-02T12:00:00.000Z'),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exibe o estado vazio sem acessar a rede', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    await montarApp(raiz, service);

    expect(raiz.textContent).toContain('Você ainda não criou nenhum provisionamento.');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('cria e lista um provisionamento pelo formulário', async () => {
    await montarApp(raiz, service);
    preencher('input[name="nome"]', 'IPVA <2027>');
    preencher('input[name="valor"]', '1.500,00');
    preencher('input[name="dataAlvo"]', '2027-01-15');

    obter<HTMLFormElement>('#form-provisionamento').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await aguardarMicrotarefas();

    expect(repository.itens).toHaveLength(0);
    expect(raiz.textContent).toContain('Informe um valor monetário válido.');

    preencher('input[name="valor"]', '1500,00');
    obter<HTMLFormElement>('#form-provisionamento').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await aguardarMicrotarefas();

    expect(repository.itens).toHaveLength(1);
    expect(raiz.textContent).toContain('IPVA <2027>');
    expect(raiz.innerHTML).not.toContain('<2027>');
    expect(raiz.textContent).toMatch(/R\$\s+1\.500,00/);
    expect(raiz.textContent).toContain('15/01/2027');
    expect(raiz.textContent).toContain('Provisionamento criado neste dispositivo.');
  });

  function preencher(seletor: string, valor: string): void {
    obter<HTMLInputElement>(seletor).value = valor;
  }

  function obter<T extends Element>(seletor: string): T {
    const elemento = raiz.querySelector<T>(seletor);
    if (!elemento) throw new Error(`Elemento ausente no teste: ${seletor}`);
    return elemento;
  }
});

async function aguardarMicrotarefas(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
