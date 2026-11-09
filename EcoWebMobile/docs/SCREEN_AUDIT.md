# Varredura de telas — EcoWeb Mobile

Data: 11/10/2026. Escopo: as 18 páginas de `app/`, navegação, estados de carregamento/erro, formulários e adaptação a diferentes dimensões. Ajustes preservam a identidade visual existente: cores, tipografia, cartões e organização das páginas.

## Resultado

Foram corrigidos riscos de corte, excesso lateral, cabeçalhos comprimidos, conteúdo escondido por ações fixas e falhas funcionais pontuais. Isso não constitui garantia para todo aparelho: teclado, recortes de tela, barras do sistema e acessibilidade precisam de validação nativa.

A API real em `127.0.0.1:3333` estava indisponível durante a revisão. Para conferir páginas carregadas, foram usadas respostas fictícias em uma API temporária na porta 4333 e uma prévia isolada na porta 8082, sem alterar `.env`, sem conta real e sem publicação/exclusão de conteúdo. O contrato de produção não foi revalidado nesta execução.

## Mapeamento por página

| Página | Problema/risco encontrado | Ajuste ou situação atual |
| --- | --- | --- |
| `/` | Alturas proporcionais e espaçamento grande comprimiam o onboarding em telas baixas; rotação podia desalinhá-lo | Rolagem vertical em cada slide, imagem com altura limitada, rodapé acessível e realinhamento ao mudar a largura |
| `/login` | Conteúdo sem rolagem; seta absoluta; formas do fundo excediam a largura; campo comprimido | Rolagem com adaptação ao teclado, seta no fluxo, recorte apenas do fundo decorativo, campos flexíveis e largura máxima |
| `/auth/register` | Campos e ícones disputavam espaço; conteúdo e rodapé extensos | Área segura, rolagem, largura máxima, campos flexíveis, rodapé com quebra de linha |
| `/dashboard` | Saudação longa, títulos e links comprimidos; atalhos estreitos | Textos flexíveis, cabeçalhos com quebra, atalhos em uma coluna quando necessário e destaques proporcionais |
| `/project` | Duas colunas fixas em telas pequenas ou com fonte ampliada | Uma, duas ou três colunas conforme largura útil e escala de fonte; mudança de colunas remonta a lista corretamente |
| `/material` | Imagem lateral deixava pouco espaço para título, endereço e CTA | Cartão empilhado em largura compacta; texto flexível, CTA com quebra e área segura |
| `/project/[id]` | Hero alto em modo horizontal; informações estreitas; vídeo/data inválidos | Hero limitado pela altura disponível, blocos empilhados no modo compacto, validação do ID de vídeo e da data |
| `/material/[id]` | Botão absoluto podia cobrir o fim da página e aumentar com texto ampliado | Rodapé medido dinamicamente, reserva de espaço na rolagem e respeito à área segura inferior; informações empilhadas |
| `/institution/[id]` | Cartões com texto longo; ausência de ID podia manter carregamento | Conteúdo flexível, área segura e erro explícito quando não há ID |
| `/search` | Resposta antiga podia substituir uma consulta recente | Controle de versão das consultas; resposta atrasada ignorada; busca vazia limpa resultados; erro e nova tentativa mantidos |
| `/project/register` | Cabeçalho e tags longas; formulário incompleto podia ser enviado; múltiplos toques | Cabeçalho flexível, tags com quebra, rolagem/área segura, validação de campos e URLs, indicador e bloqueio durante envio |
| `/material/register` | Cabeçalho comprimido; quantidade e unidade enviadas juntas como texto | Campos flexíveis; quantidade numérica e `unitOfMeasure` separados; validação, imagem opcional e bloqueio de envio duplicado |
| `/project/me` | Grade fixa; falha de API aparentava lista vazia; exclusão apenas local | Grade responsiva, mensagem de erro com nova tentativa e exclusão explicitamente indisponível |
| `/material/me` | Conteúdo e ações disputavam espaço; edição/exclusão aparentavam funcionar | Cartão com quebra e alvos de toque maiores; mensagens honestas de indisponibilidade. Lista continua demonstrativa |
| `/profile` | Nome longo e estatísticas apertados; edição não implementada | Nome centralizado com quebra, área segura e aviso de indisponibilidade da edição. Estatísticas/avatar continuam demonstrativos |
| `/profile/favorites` | Grade fixa; toque em remover também podia abrir detalhe | Grade responsiva, áreas de toque maiores e interrupção da propagação. Favoritos continuam demonstrativos |
| `/profile/messages` | Metadados comprimiam o texto; rota relativa de conversa | Texto flexível, espaçamento dos metadados e rota absoluta de chat. Conversas continuam demonstrativas |
| `/chat/[id]` | Offset de teclado fixo; envio apagava texto sem enviá-lo; título sempre igual | Ajuste do offset, campo flexível, botão acessível, preservação do rascunho e aviso de envio indisponível; título genérico fora da conversa demonstrativa |

## Correções compartilhadas

- `PageHeader`: título pode quebrar; seta e ações preservam espaço de toque sem sobreposição.
- `useResponsiveLayout` / `getResponsiveLayout`: considera largura, altura e `fontScale`. Fonte maior reduz o número de colunas; não foi desativado o aumento de texto.
- `ContentImage`: mantém o espaço da imagem e mostra um indicador neutro quando a URL está vazia ou falha. Aplicado às páginas públicas e a Meus Projetos; não altera imagens carregadas corretamente.
- Retorno após autenticação: login e guard de rotas usam o mesmo destino, evitando que o guard mande para a home antes de retornar à ação solicitada. Destinos externos e rotas de autenticação são rejeitados.
- Nome/e-mail são normalizados antes do envio. Campos obrigatórios não aceitam somente espaços.
- Removido o log de objetos de erro das requisições de cadastro/Meus Projetos, evitando registrar configuração HTTP e cabeçalhos de autenticação no console.
- Serviço de Meus Projetos preserva o erro HTTP original para distinguir conexão, conteúdo indisponível e resposta do servidor.

## Validação executada

Dimensões de viewport web: **320×568**, **360×640**, **390×844**, **430×932** e **568×320**. Foi feita também uma conferência adicional do catálogo de projetos em **768×1024**, com três colunas.

Todas as 18 páginas foram inspecionadas em código e visitadas na prévia nos cinco formatos. As páginas com API foram exercitadas com nomes, títulos, endereços e descrições longos. As medidas iniciais incluíram estados de carregamento/falha; as páginas carregadas foram novamente conferidas em 320×568, 430×932 e modo horizontal. Nessas verificações finais não houve excesso de largura do documento. O excesso do fundo do login foi corrigido e revalidado nos cinco formatos.

Fluxos exercitados pela interface:

- Onboarding: avançar, mudar orientação, concluir e abrir a home como visitante.
- Visitante: abrir cadastro protegido e chegar ao login com destino de retorno preservado.
- Conta fictícia: entrar no login e retornar diretamente ao cadastro de projeto solicitado.
- Material: alcançar o link do doador no fim da página sem o rodapé encobri-lo.
- Busca: consulta lenta seguida por consulta sem resultados; a resposta antiga não substituiu a recente. Consulta vazia restaurou o estado inicial.
- API indisponível: estados de erro/repetição observados em páginas públicas e Meus Projetos.

Verificações técnicas:

- `npm run lint`.
- `npx tsc --noEmit`.
- `npm run test:screens`: cinco testes de regras reais de responsividade, altura do hero, proteção das rotas, destino após login e validação de URLs.
- `npx expo export --platform web --output-dir /tmp/ecoweb-screen-audit-export`: compilação e exportação das rotas concluídas.
- `git diff --check`.

Os testes de regras incluem escalas de fonte 1,5 e 2. Isso testa a seleção do layout, **não** o comportamento visual completo das fontes ampliadas em Android/iOS. Não foi criado cadastro real nem enviado projeto, material ou mensagem à API real.

## Pendências encontradas

### P1 — Integração e confiança dos dados

1. **Favoritos**: corações dos detalhes mudam apenas em memória; lista de favoritos usa itens de exemplo, com IDs que podem abrir detalhes inexistentes. Conectar persistência/listagem real e sincronizar as telas.
2. **Mensagens/interesse**: histórico e lista são demonstrativos. O interesse navega com ID de material, não com ID de conversa criado no servidor. Integrar criação/obtenção de conversa antes de permitir envio real.
3. **Meus Materiais**: lista e contadores ainda não vêm da conta autenticada; um material cadastrado pode não aparecer nessa lista. Integrar endpoint de gerenciamento e atualizar após cadastro.
4. **Perfil/home**: avatar, estatísticas e indicador de mensagens não representam necessariamente dados reais. Substituir pelos dados da conta ou por estado neutro.
5. **Edição, exclusão e recuperação de senha**: não implementadas. Os pontos ajustados agora avisam a indisponibilidade, sem indicar uma operação bem-sucedida.
6. **Termos de uso e privacidade**: aparecem como texto no cadastro, sem acesso aos documentos. É necessário fornecer os destinos reais antes de completar esse fluxo.
7. **Papéis e sessão**: confirmar na API as permissões de criador/instituição e expiração do token. O guard atual exige login, mas não implementa autorização por papel nem tratamento centralizado de sessão expirada. A segurança efetiva deve continuar no servidor.

### P2 — Robustez e acessibilidade

1. Validar em aparelhos/emuladores Android e iOS: teclado aberto, voltar do sistema, modo horizontal, notch/recortes, navegação por gestos e barras inferiores.
2. Testar fontes ampliadas (150% e 200%) e leitores de tela. Completar papéis/rótulos de todos os controles e revisar limites de linhas usados como resumo nos cartões.
3. Alertas de React Native não são implementados pelo runtime web instalado (`react-native-web`), portanto ações que dependem desses alertas precisam de equivalente se a versão web for um produto suportado.
4. Há avisos web de depreciação de estilos de sombra; não impediram compilação nem renderização. Migrar considerando a compatibilidade nativa, sem mudar o visual.
5. Verificar respostas fora de ordem ao trocar rapidamente os IDs dos detalhes, perda de conexão durante publicação e carregamento de listas grandes. O controle de resposta atrasada foi aplicado à busca, não a todos os carregamentos.
6. Considerar confirmação ao sair de um formulário com rascunho e preservação de dados após interrupção do aplicativo.

Não foram inventados endpoints de favoritos, mensagens, edição ou exclusão. Essas pendências requerem o contrato real da API e verificação integrada.
