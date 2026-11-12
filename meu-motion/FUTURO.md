# O FUTURO NÃO ESPERA.

Composição `FuturoNaoEspera`: 1080 × 1920, 30 fps, 450 frames (15 s).
A composição original `MyComp` foi preservada. Não há dependências novas,
assets remotos ou animações CSS em tempo real. Esta versão é visual, sem áudio.

## Visualizar no Codespaces

No terminal do projeto `meu-motion`, atualize o checkout com `git pull` (preserve
eventuais alterações locais) e execute `npm ci` se as dependências não estiverem
instaladas. Com `npm run dev`, abra a porta do Studio pelo painel **Ports** do
Codespaces e selecione **FuturoNaoEspera** na lista de composições.
Se o Studio já estiver aberto, ele recarrega os arquivos atualizados.

## Renderizar MP4

Execute dentro de `meu-motion`:

```bash
npx remotion render src/index.ts FuturoNaoEspera out/futuro-nao-espera.mp4 --codec=h264
```

Também é possível usar **Render** no Studio e selecionar H.264.
O arquivo de saída está em `out/`, ignorado pelo Git.
Se o ambiente já tiver Chromium instalado, acrescente
`--browser-executable=/usr/bin/chromium`.

## Estrutura e edição

- `src/index.ts`: entrada original com `registerRoot`.
- `src/Root.tsx`: registros de `MyComp` e `FuturoNaoEspera`.
- `src/Composition.tsx`: composição original, intacta.
- `src/FuturoNaoEspera.tsx`: cinco cenas, texto reutilizável, envelope de
  transição, iluminação e cenário contínuo com anéis em perspectiva.
- `remotion.config.ts`: configuração original preservada (Rspack, JPEG,
  sobrescrita de saída e premount de dois segundos).

| Cena | Frames | Texto |
| --- | --- | --- |
| 1 | 0–89 | O FUTURO |
| 2 | 90–179 | NÃO ESPERA. |
| 3 | 180–299 | ENQUANTO UNS PLANEJAM… |
| 4 | 300–389 | OUTROS CONSTROEM. |
| 5 | 390–449 | COMECE AGORA. |

Textos usam entradas escalonadas, spring, blur e perspectiva. Quatro varreduras
de luz atravessam os cortes; o cenário tem movimento contínuo e fade final.
O conteúdo principal fica na região central, com padding de 100 px à esquerda,
150 px à direita, 280 px acima e 360 px abaixo. Interfaces e legendas das redes
variam; revise a prévia no aplicativo de destino antes da publicação.

## Verificação

```bash
npx tsc --noEmit
npx eslint src
npx remotion compositions src/index.ts
```

As animações dependem apenas do frame. A renderização não exige internet após
a instalação das dependências e do navegador. A tipografia usa Arial/Helvetica
com fallback sans-serif local.
