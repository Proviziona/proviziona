import type { Provisionamento } from '../domain/provisionamento';

export interface ProvisionamentoRepository {
  salvar(provisionamento: Provisionamento): Promise<void>;
  listar(): Promise<Provisionamento[]>;
}
