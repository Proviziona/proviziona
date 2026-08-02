import './style.css';
import { ProvisionamentoService } from './application/provisionamento-service';
import { IndexedDbProvisionamentoRepository } from './infra/indexed-db-provisionamento-repository';
import { montarApp } from './ui/app';

const raiz = document.querySelector<HTMLElement>('#app');

if (!raiz) {
  throw new Error('Elemento raiz não encontrado.');
}

const repository = new IndexedDbProvisionamentoRepository();
const service = new ProvisionamentoService(repository);

void montarApp(raiz, service);
