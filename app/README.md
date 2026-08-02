# Aplicativo

Aplicativo web local e offline do Proviziona. O cadastro e a consulta de
provisionamentos usam apenas o armazenamento do próprio dispositivo; nenhuma
conexão com o servidor é necessária.

## Modelo de acesso

O aplicativo local é gratuito e completo. Conta, sincronização e uso em
múltiplos dispositivos dependem de um plano pago e são opcionais. Os níveis e
limites dos planos ainda serão definidos.

Ao cancelar o plano, o usuário perde somente os serviços de nuvem. Seus dados
locais e todas as funções locais permanecem disponíveis integralmente.

## Desenvolvimento

Todos os comandos devem ser executados em container:

```sh
docker run --rm -v "${PWD}/app:/app" -w /app node:22-alpine npm ci
docker run --rm -v "${PWD}/app:/app" -w /app node:22-alpine npm run check
```

`npm run check` executa lint, verificação de tipos, testes e build.

## Persistência

No navegador, os dados ficam no IndexedDB, no banco `proviziona-local`. A
interface de repositório fica separada do domínio para permitir substituir a
implementação sem alterar as regras da aplicação.

Para a futura distribuição nativa com Capacitor, deve ser criado um adaptador
da mesma interface `ProvisionamentoRepository` usando SQLite. Essa integração
ainda não existe: não há fallback silencioso, sincronização ou simulação de
SQLite nesta versão.
