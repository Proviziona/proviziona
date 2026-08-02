import type { ProvisionamentoService } from '../application/provisionamento-service';
import {
  converterValorParaCentavos,
  ErroDeValidacao,
  type Provisionamento,
} from '../domain/provisionamento';

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatadorData = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

export async function montarApp(
  elemento: HTMLElement,
  service: ProvisionamentoService,
): Promise<void> {
  elemento.innerHTML = `
    <main class="container">
      <header class="cabecalho">
        <p class="marca">Proviziona</p>
        <h1>Planeje hoje. Respire amanhã.</h1>
        <p>Seus provisionamentos ficam salvos neste dispositivo.</p>
      </header>

      <section class="painel" aria-labelledby="novo-titulo">
        <h2 id="novo-titulo">Novo provisionamento</h2>
        <form id="form-provisionamento">
          <label>Nome <input name="nome" required maxlength="80" placeholder="Ex.: IPVA" /></label>
          <div class="campos-linha">
            <label>Valor alvo <input name="valor" required inputmode="decimal" placeholder="0,00" /></label>
            <label>Data alvo <input name="dataAlvo" required type="date" /></label>
          </div>
          <p id="mensagem" class="mensagem" role="status"></p>
          <button type="submit">Criar provisionamento</button>
        </form>
      </section>

      <section aria-labelledby="lista-titulo">
        <div class="titulo-lista">
          <h2 id="lista-titulo">Seus provisionamentos</h2>
          <span class="selo-offline">Disponível offline</span>
        </div>
        <div id="lista-provisionamentos"></div>
      </section>
    </main>
  `;

  const formulario = obterElemento<HTMLFormElement>(elemento, '#form-provisionamento');
  const mensagem = obterElemento<HTMLParagraphElement>(elemento, '#mensagem');
  const lista = obterElemento<HTMLDivElement>(elemento, '#lista-provisionamentos');

  const atualizarLista = async () => {
    renderizarLista(lista, await service.listar());
  };

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensagem.textContent = '';
    const dados = new FormData(formulario);

    try {
      await service.criar({
        nome: String(dados.get('nome') ?? ''),
        valorAlvoCentavos: converterValorParaCentavos(String(dados.get('valor') ?? '')),
        dataAlvo: String(dados.get('dataAlvo') ?? ''),
      });
      formulario.reset();
      mensagem.textContent = 'Provisionamento criado neste dispositivo.';
      await atualizarLista();
    } catch (erro) {
      mensagem.textContent =
        erro instanceof ErroDeValidacao ? erro.message : 'Não foi possível salvar no dispositivo.';
    }
  });

  await atualizarLista();
}

function renderizarLista(elemento: HTMLElement, itens: Provisionamento[]): void {
  if (itens.length === 0) {
    elemento.innerHTML = '<p class="vazio">Você ainda não criou nenhum provisionamento.</p>';
    return;
  }

  elemento.innerHTML = `<ul class="lista">${itens
    .map(
      (item) => `
        <li class="provisionamento">
          <div><strong>${escaparHtml(item.nome)}</strong><span>Até ${formatarData(item.dataAlvo)}</span></div>
          <b>${formatadorMoeda.format(item.valorAlvoCentavos / 100)}</b>
        </li>`,
    )
    .join('')}</ul>`;
}

function formatarData(data: string): string {
  return formatadorData.format(new Date(`${data}T00:00:00Z`));
}

function escaparHtml(valor: string): string {
  const elemento = document.createElement('span');
  elemento.textContent = valor;
  return elemento.innerHTML;
}

function obterElemento<T extends Element>(raiz: ParentNode, seletor: string): T {
  const elemento = raiz.querySelector<T>(seletor);
  if (!elemento) {
    throw new Error(`Elemento obrigatório ausente: ${seletor}`);
  }
  return elemento;
}
