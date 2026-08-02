import type { ProvisionamentoRepository } from '../application/provisionamento-repository';
import type { Provisionamento } from '../domain/provisionamento';

const NOME_BANCO = 'proviziona-local';
const VERSAO_BANCO = 1;
const STORE_PROVISIONAMENTOS = 'provisionamentos';

export class IndexedDbProvisionamentoRepository implements ProvisionamentoRepository {
  constructor(private readonly abrirBanco = abrirBancoPadrao) {}

  async salvar(provisionamento: Provisionamento): Promise<void> {
    const banco = await this.abrirBanco();

    try {
      await executarTransacao(banco, 'readwrite', (store) => store.put(provisionamento));
    } finally {
      banco.close();
    }
  }

  async listar(): Promise<Provisionamento[]> {
    const banco = await this.abrirBanco();

    try {
      const itens = await executarTransacao<Provisionamento[]>(
        banco,
        'readonly',
        (store) => store.getAll(),
      );

      return itens.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    } finally {
      banco.close();
    }
  }
}

function abrirBancoPadrao(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const requisicao = indexedDB.open(NOME_BANCO, VERSAO_BANCO);

    requisicao.onupgradeneeded = () => {
      const banco = requisicao.result;
      if (!banco.objectStoreNames.contains(STORE_PROVISIONAMENTOS)) {
        banco.createObjectStore(STORE_PROVISIONAMENTOS, { keyPath: 'id' });
      }
    };
    requisicao.onsuccess = () => resolve(requisicao.result);
    requisicao.onerror = () => reject(requisicao.error ?? new Error('Não foi possível abrir o banco local.'));
  });
}

function executarTransacao<T = void>(
  banco: IDBDatabase,
  modo: IDBTransactionMode,
  executar: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transacao = banco.transaction(STORE_PROVISIONAMENTOS, modo);
    const requisicao = executar(transacao.objectStore(STORE_PROVISIONAMENTOS));
    let resultado!: T;

    requisicao.onsuccess = () => {
      resultado = requisicao.result;
    };
    requisicao.onerror = () => reject(requisicao.error ?? new Error('Falha ao acessar os dados locais.'));
    transacao.oncomplete = () => resolve(resultado);
    transacao.onabort = () => reject(transacao.error ?? new Error('A transação local foi cancelada.'));
  });
}
