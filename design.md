---
name: "Telles Dedetizadora"
description: "Proteção local apresentada com clareza editorial, fotografia e autoridade técnica."
colors:
  protection-green: "#003e2f"
  deep-green: "#002b21"
  action-lime: "#8cc63f"
  action-lime-hover: "#a6df55"
  signal-orange: "#ff6b00"
  natural-surface: "#f5f6f2"
  paper-white: "#ffffff"
  forest-text: "#173a2f"
  leaf-muted: "#5b6c64"
  soft-line: "#dbe3dc"
  hero-copy: "#e2eee9"
  on-dark-muted: "#d7e8e1"
typography:
  display:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "clamp(3.25rem, 5.3vw, 4.5rem)"
    fontWeight: 850
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "clamp(2.35rem, 4.4vw, 3.65rem)"
    lineHeight: 1.03
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "23px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "14px"
    fontWeight: 750
rounded:
  action: "7px"
  control: "8px"
  seal: "10px"
  section: "12px"
  hero: "14px"
  round: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "24px"
  xl: "34px"
  section: "98px"
components:
  button-primary:
    backgroundColor: "{colors.action-lime}"
    textColor: "{colors.deep-green}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "12px 19px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.action-lime-hover}"
    textColor: "{colors.deep-green}"
    rounded: "{rounded.action}"
  nav-cta:
    backgroundColor: "{colors.action-lime}"
    textColor: "{colors.deep-green}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "0 18px"
    height: "44px"
  service-icon:
    backgroundColor: "{colors.action-lime}"
    textColor: "{colors.deep-green}"
    rounded: "{rounded.round}"
    size: "56px"
---

# Design System: Telles Dedetizadora

## Overview

**Creative North Star: "Proteção Editorial em Campo"**

A Telles se apresenta como uma operação local, técnica e acessível. A direção visual usa a objetividade de um editorial de serviço: fotografia de atendimento em escala ampla, títulos firmes, informação organizada por linhas e blocos de cor institucionais, sem transformar o conteúdo em uma grade de cartões.

O verde profundo cria autoridade e proteção; o verde-lima conduz ações e sinais úteis. A fotografia abre a narrativa no hero, enquanto a imagem de detalhe e o selo com a marca criam uma assimetria reconhecível na seção Sobre. O sistema é persuasivo, mas contido: a confiança vem da hierarquia, da prova social e dos fatos do produto.

**Key Characteristics:**

- Hero fotográfico com navegação sobreposta e gradiente direcional para legibilidade.
- Ritmo editorial aberto, com divisórias finas no lugar de caixas repetidas.
- Assimetria controlada na seção Sobre, combinando imagem vertical e selo da marca.
- Serviços apresentados como lista técnica; avaliações apresentadas em uma faixa verde profunda.
- Contato tipográfico e aberto, com a ação principal em verde-lima.

## Colors

A paleta combina verdes institucionais com uma superfície quase branca; o lima é ação, e o laranja existe apenas como sinal de foco acessível.

### Primary

- **Verde Proteção:** base institucional usada em texto de ação, links e identidade.
- **Verde Profundo:** fundo de alta autoridade para hero, avaliações e cabeçalho sobreposto.
- **Verde Ação:** CTAs, ícones circulares e indicadores de prova.
- **Verde Ação Claro:** resposta de hover para ações em verde-lima.

### Secondary

- **Laranja Sinal:** contorno de foco visível; não ocupa superfícies extensas.

### Neutral

- **Superfície Natural:** fundo geral da página.
- **Branco Papel:** faixa de serviços, seção de serviços e superfícies do cabeçalho após rolagem.
- **Texto Floresta:** texto principal em superfícies claras.
- **Cinza Folha:** textos explicativos e dados secundários.
- **Linha Suave:** divisórias de listas e seções.
- **Texto do Hero:** cópia secundária sobre fotografia escurecida.
- **Névoa sobre Verde:** microtexto sobre fundos institucionais.

### Named Rules

**The Action Lime Rule.** O verde-lima marca uma ação, um ícone ou uma prova; ele não vira fundo dominante de seção.

**The Orange Focus Rule.** O laranja pertence ao foco visível de 3px com afastamento de 4px; não é uma segunda cor promocional.

## Typography

**Display Font:** Inter Variable (com Arial, Helvetica e sans-serif como alternativas)
**Body Font:** Inter Variable (com Arial, Helvetica e sans-serif como alternativas)

**Character:** Uma única família sans-serif sustenta precisão e proximidade. O arquivo local `Assets/fonts/InterVariable.woff2` é carregado por `@font-face` nos pesos 100–900 com `font-display: swap`; hierarquia e personalidade vêm do peso, da escala e do espaçamento compacto.

### Hierarchy

- **Display** (peso 850, escala fluida, entrelinha 0.98): título principal do hero, compacto e assertivo.
- **Headline** (escala fluida, entrelinha 1.03): títulos das seções Sobre, Serviços, Avaliações e Contato.
- **Title** (peso forte, 23px, entrelinha 1.2): nomes na lista técnica de serviços.
- **Body** (peso 400, 16px, entrelinha 1.6): conteúdo corrente; introduções ganham 17–18px quando precisam conduzir a leitura.
- **Label** (peso 750–800, 12–14px): navegação, CTAs, autoria, métricas e metadados em caixa alta quando necessário.

### Named Rules

**The One-Family Rule.** Use somente a Inter local e seus fallbacks; contraste tipográfico deve vir de peso, tamanho e ritmo, não de uma fonte decorativa adicional.

## Layout

O sistema usa um container central de 1120px com 24px de respiro lateral no desktop. As seções têm 98px de espaço vertical. O hero permanece dentro do container, com altura mínima limitada por 680px e pela viewport; a fotografia preenche o quadro e a cópia ocupa 62% da largura. Uma faixa fina de três serviços fecha o hero.

Sobre usa duas colunas assimétricas (`.92fr / 1.08fr`), grande intervalo e imagem vertical parcialmente coberta pelo selo da marca. Serviços usa introdução sticky e uma lista aberta em duas colunas (`.82fr / 1.18fr`). Avaliações organiza a nota e três depoimentos numa única faixa deep-green, separados apenas por linhas. Contato usa duas colunas (`1.15fr / .85fr`) e termina em uma linha horizontal antes do rodapé.

Em até 900px, as composições principais aproximam as colunas, a imagem Sobre reduz de altura e a introdução de Serviços deixa de ser sticky. Em até 760px, o container passa a 16px de margem lateral, o menu vira painel vertical, o hero perde os cantos, todas as composições empilham, a faixa de serviços vira uma lista e os depoimentos passam a uma coluna. Em telas com largura de até 760px **e** altura de até 700px, hero, título, parágrafo, botão e provas recebem uma compactação vertical específica para preservar o conteúdo útil dentro da viewport.

**The Open Editorial Rule.** Seções densas se organizam por alinhamento, espaço e divisórias; não envolva cada item em um cartão.

## Elevation & Depth

O sistema é predominantemente plano e tonal. Profundidade vem da fotografia sob o gradiente, da sobreposição física do selo na imagem e de duas sombras ambientais específicas; listas e depoimentos permanecem sem sombra.

### Shadow Vocabulary

- **Cabeçalho em rolagem** (`0 8px 28px rgba(0,0,0,.08)`): separa discretamente o cabeçalho claro do conteúdo.
- **Faixa de serviços** (`0 18px 40px rgba(0,0,0,.06)`): faz a faixa parecer conectada ao quadro fotográfico no desktop.
- **Selo da marca** (`0 22px 45px rgba(0,0,0,.14)`): reforça a sobreposição na composição Sobre.
- **WhatsApp flutuante** (`0 12px 28px rgba(0,0,0,.2)`): mantém a ação global legível sobre qualquer seção.

### Named Rules

**The Structural Shadow Rule.** Sombra só aparece quando explica sobreposição ou fixação; nunca transforme serviços ou avaliações em cartões elevados.

## Shapes

A linguagem usa cantos pequenos e funcionais: 7px em CTAs, 8px em controles, 10px no selo, 12px em imagens e faixas, e 14px no quadro do hero. Círculos completos são reservados a ícones de prova, ícones de serviço e ao botão flutuante. Linhas de 1px criam estrutura sem fechar o conteúdo em caixas.

## Components

### Buttons

- **Shape:** ação compacta com cantos de 7px, altura mínima de 52px e padding de 12px por 19px.
- **Primary:** fundo verde-lima, texto verde profundo, peso 800 e ícone linear opcional.
- **Hover / Focus:** sobe 2px e clareia no hover; o foco usa contorno laranja de 3px com afastamento de 4px.
- **Navigation CTA:** versão de 44px de altura, com padding horizontal de 18px.

### Navigation

O cabeçalho é fixo e começa sobre o hero em verde profundo translúcido. Após rolagem, torna-se quase opaco na cor da superfície, muda o texto para verde profundo e recebe sombra baixa. Links têm alvo mínimo de 44px e sublinhado no hover. Em até 760px, o botão de 46px abre um painel vertical abaixo do cabeçalho de 68px, com divisórias e links de pelo menos 50px.

### Hero and Service Strip

O hero combina fotografia em `cover`, gradiente horizontal verde, título, CTA e duas provas junto à base. No celular o gradiente passa a vertical e escurece a base. A faixa de três serviços é branca e fina no desktop; no celular vira uma lista de três linhas alinhadas à esquerda, sem sombra.

### About Composition

A imagem vertical ocupa 82% da coluna e alinha à direita. O selo verde-lima com a marca ocupa o canto inferior esquerdo, criando sobreposição assimétrica. Esta é a assinatura gráfica da seção e não deve ser convertida em órbitas, palco circular ou ilustração abstrata.

### Service List

Cada serviço é uma linha aberta com ícone circular verde-lima, título e descrição. A lista começa com linha escura e usa divisórias suaves entre itens; não há fundo, borda externa, destaque central ou elevação por item.

### Reviews Band

A seção inteira usa fundo verde profundo. A nota aparece junto ao título e os três depoimentos compartilham a mesma superfície, separados por linhas brancas translúcidas. Autores usam verde-lima; não há cartões individuais.

### Contact and Floating Action

Contato permanece aberto sobre a superfície natural: texto e CTA à esquerda, dados organizados por uma linha superior à direita. O botão fixo do WhatsApp é circular, verde-lima, com borda branca de 2px, sombra e deslocamento de 3px no hover.

## Do's and Don'ts

### Do:

- **Do** usar a fotografia do hero como entrada persuasiva e manter o gradiente verde que assegura contraste do texto.
- **Do** preservar o selo da marca sobre a imagem vertical na seção Sobre.
- **Do** apresentar serviços e avaliações como listas abertas separadas por linhas.
- **Do** reservar verde-lima para ação, prova e pequenos sinais de ênfase.
- **Do** manter foco visível, alvos interativos de pelo menos 44px e suporte a movimento reduzido.
- **Do** aplicar as adaptações de 900px, 760px e a regra adicional de altura máxima de 700px.

### Don't:

- **Don't** reintroduzir órbitas, palco circular, composição abstrata do escudo ou hero sem fotografia.
- **Don't** converter serviços ou avaliações em grades de cartões.
- **Don't** inventar licenças, garantias, estatísticas, equipe ou credenciais que não constem no produto.
- **Don't** usar o laranja como cor dominante ou reduzir o contraste do foco acessível.
- **Don't** adicionar vidro, carrosséis, gradientes decorativos extras ou movimento elaborado.
