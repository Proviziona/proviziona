import {
  criarProvisionamento,
  type CriarProvisionamentoDependencias,
  type NovoProvisionamento,
  type Provisionamento,
} from '../domain/provisionamento';
import type { ProvisionamentoRepository } from './provisionamento-repository';

const dependenciasPadrao: CriarProvisionamentoDependencias = {
  gerarId: () => crypto.randomUUID(),
  agora: () => new Date(),
};

export class ProvisionamentoService {
  constructor(
    private readonly repository: ProvisionamentoRepository,
    private readonly dependencias = dependenciasPadrao,
  ) {}

  async criar(entrada: NovoProvisionamento): Promise<Provisionamento> {
    const provisionamento = criarProvisionamento(entrada, this.dependencias);
    await this.repository.salvar(provisionamento);
    return provisionamento;
  }

  listar(): Promise<Provisionamento[]> {
    return this.repository.listar();
  }
}
