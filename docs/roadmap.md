# Roteiro inicial

O roteiro descreve ordem, não datas.

## 1. Fundação

- definir modelo de provisionamentos, ciclos e movimentações;
- criar scaffold do aplicativo;
- incorporar o Elavora API Skeleton ao servidor;
- configurar testes e integração contínua.

## 2. MVP local

- cadastrar e editar provisionamentos;
- criar ciclos recorrentes;
- registrar aportes e retiradas;
- calcular valores recomendados;
- persistir tudo em SQLite;
- exportar e importar os dados.

## 3. Sincronização

- definir e versionar o protocolo;
- autenticar contas e dispositivos;
- implementar operações idempotentes;
- testar conflitos e uso prolongado offline.

## 4. Self-host

- publicar imagens de contêiner;
- fornecer `docker compose up -d`;
- documentar instalação, atualização, backup e restauração;
- permitir configurar no aplicativo a URL do servidor.

## 5. Proviziona Cloud

- operar o mesmo servidor do self-host;
- automatizar infraestrutura, backups e atualizações;
- definir cobrança pela comodidade e pelos custos recorrentes;
- manter as funções principais disponíveis sem assinatura.

Itens podem mudar conforme o uso real mostrar prioridades melhores.
