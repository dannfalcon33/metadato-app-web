# MetaPulse — Estudio Cyberpunk de Metadatos MP3 · MP3 Metadata Studio · Estúdio de Metadados MP3

[![Ver en Vivo — metapulse.falconit.xyz](public/ver-en-vivo-btn.svg)](https://metapulse.falconit.xyz/)

🌐 **Idiomas / Languages / Idiomas:** [🇪🇸 Español](#-español) · [🇺🇸 English](#-english) · [🇧🇷 Português](#-português)

🔗 **Live App / Ver en Vivo / Ver ao Vivo:** **[https://metapulse.falconit.xyz/](https://metapulse.falconit.xyz/)**

[![MetaPulse Preview](public/assets/aistudio/MetaPulse___Estudio_Cyberpunk_de_Metadatos_MP3_feeefafa.png)](https://metapulse.falconit.xyz/)

---

## 🇪🇸 Español

**MetaPulse** es una aplicación web organizada en vistas dedicadas con estética de estudio musical e iluminación dinámica **RGB multicolor** para analizar, autocompletar, editar e inyectar etiquetas binarias **ID3v2.3**, letras de canciones (**USLT**) y carátulas (**APIC 600×600 px**) directamente en archivos `.mp3`, acompañada de un buscador discográfico de canciones, artistas y álbumes.

- **Ver en vivo:** [https://metapulse.falconit.xyz/](https://metapulse.falconit.xyz/)

### Desglose Visual de Cómo Funciona la Interfaz

1. **Cabecera de Navegación Superior (3 Zonas)**:
   - **Izquierda**: Identidad de marca con el emblema vectorial reactivo `MetaPulseLogo`.
   - **Centro**: Enlaces directos entre las vistas dedicadas (`Inicio`, `Editor MP3`, `Buscador Musical`, `Acerca de`).
   - **Derecha**: Acceso rápido mediante el botón con gradiente RGB animado **«Abrir Editor MP3»**.

2. **Sección Hero Centrada con Burbuja Arcoíris RGB y Ondas Pulsantes**:
   - Sobre un fondo negro puro (`#000000`), una burbuja gradiente multicolor y ondas concéntricas suaves irradian detrás del bloque central de títulos y acciones.
   - Permite saltar directamente al **Editor MP3** (`/editor`), abrir el **Buscador Musical** (`/search`) o consultar la documentación técnica (`/about`).

3. **Cuadro de Transformación de Metadatos con Borde de Líneas RGB Animado**:
   - Enmarcado por un borde perimetral continuo de líneas RGB que cambian constantemente de color, muestra cómo evoluciona un archivo local:
     - **Entrada · Archivo Local**: Un contenedor como `"REM - Losing My Religion.mp3"` sin etiquetas internas (`0 bytes ID3`).
     - **Proceso · Búsqueda y Revisión**: Identificación automática por nombre de archivo o consulta manual en catálogo (`R.E.M. · Out of Time · 1991 · Pista 4/11`).
     - **Salida · Descarga Directa**: Cabecera binaria `ID3v2.3` inyectada (`TIT2 · TPE1 · TALB · TYER · USLT · APIC`) con texto en `UTF-16LE` sin recodificar ni alterar los frames de audio MPEG.

4. **Capacidades de la Plataforma y Flujo en 3 Pasos (Fondos de Estudio Musical con Opacidad Oscura)**:
   - **Consola de Estudio (`studio-section-console`)**: Presenta la edición `ID3v2.3` en el navegador, incrustación de carátulas `APIC` y letras `USLT`, buscador discográfico y vistas previas de audio.
   - **Cabina de Producción y Vinilos (`studio-section-vinyl`)**: Guía el proceso en tres pasos: **01. Selección del archivo MP3**, **02. Búsqueda y revisión de etiquetas** y **03. Inyección binaria y descarga**.

### Arquitectura de Rutas (`react-router-dom`)

| Ruta | Vista | Propósito |
|---|---|---|
| `/` | **Inicio (`HomePage`)** | Presentación centrada con ondas RGB, cuadro demostrativo con borde RGB animado y resumen del flujo en 3 pasos. |
| `/editor` | **Editor MP3 (`EditorPage`)** | Carga de archivos `.mp3`, autocompletado de etiquetas, edición de letra `USLT` y portada `APIC`, verificación binaria y descarga. |
| `/search` | **Buscador Musical (`SearchPage`)** | Consulta de canciones, artistas y álbumes, reproducción de fragmentos de referencia y envío de metadatos al Editor MP3. |
| `/about` | **Acerca de (`AboutPage`)** | Documentación técnica detallada sobre lectura/escritura binaria `ID3v2.3`, fuentes públicas y preguntas frecuentes. |
| `*` | **404 (`NotFoundPage`)** | Recuperación de ruta con accesos directos a Inicio, Editor MP3 y Buscador Musical. |

### Especificaciones Técnicas Principales
- **Lectura Multi-Versión**: Interpreta cabeceras existentes `ID3v2.3`, `ID3v2.4` e `ID3v1`.
- **Escritura Binaria Estándar ID3v2.3**: Codificación `UTF-16LE` con BOM (`0xFF 0xFE`) para las tramas `TIT2`, `TPE1`, `TALB`, `TYER`, `TRCK`, `TCON`, `TCOM`, `TPUB`, `USLT`, `COMM` y `APIC` (`0x03` portada frontal).
- **Verificación Post-Escritura (`verifyWrittenMp3Blob`)**: Vuelve a leer el `Blob` generado para confirmar que las etiquetas, la letra y la carátula se grabaron íntegramente antes de descargar el archivo `.mp3`.

---

## 🇺🇸 English

**MetaPulse** is a multi-page web application featuring a music studio aesthetic and dynamic **multi-color RGB lighting** designed to inspect, autocomplete, edit, and inject binary **ID3v2.3** tags, unsynchronized song lyrics (**USLT**), and album cover art (**APIC 600×600 px**) directly into `.mp3` files, paired with a dedicated music catalog explorer for songs, artists, and albums.

- **Live Demo:** [https://metapulse.falconit.xyz/](https://metapulse.falconit.xyz/)

### Visual Interface Walkthrough

1. **3-Zone Top Navigation Bar**:
   - **Left**: Brand identity featuring the reactive vector emblem `MetaPulseLogo`.
   - **Center**: Direct navigation across dedicated views (`Home`, `MP3 Editor`, `Music Search`, `About`).
   - **Right**: Primary RGB gradient call-to-action button **“Abrir Editor MP3”**.

2. **Centered Hero Section with Rainbow RGB Bubble & Pulsing Waves**:
   - Set over a pure black (`#000000`) backdrop, a morphing rainbow gradient bubble and soft concentric pulsing waves radiate behind the centered headline and action buttons.
   - Provides immediate access to the **MP3 Editor** (`/editor`), **Music Search** (`/search`), and **Technical Documentation** (`/about`).

3. **Metadata Transformation Showcase with Animated RGB Line Border**:
   - Framed by a continuously rotating multi-color RGB perimeter line border, this showcase illustrates how a local MP3 file is enriched:
     - **Input · Local File**: A raw container such as `"REM - Losing My Religion.mp3"` with missing or incomplete internal tags (`0 bytes ID3`).
     - **Process · Lookup & Review**: Automatic filename identification or manual catalog search (`R.E.M. · Out of Time · 1991 · Track 4/11`).
     - **Output · Direct Download**: Injected `ID3v2.3` binary header (`TIT2 · TPE1 · TALB · TYER · USLT · APIC`) encoded in `UTF-16LE` without re-encoding or altering the underlying MPEG audio frames.

4. **Platform Capabilities & 3-Step Workflow (Dark-Opacity Music Studio Backdrops)**:
   - **Studio Mixing Console (`studio-section-console`)**: Highlights browser-based `ID3v2.3` editing, `APIC` cover art and `USLT` lyrics embedding, catalog exploration, and audio previews.
   - **Production Booth & Turntables (`studio-section-vinyl`)**: Explains the 3-step workflow: **01. MP3 File Selection**, **02. Tag Lookup & Review**, and **03. Binary Injection & Download**.

### Route Architecture (`react-router-dom`)

| Route | View | Purpose |
|---|---|---|
| `/` | **Home (`HomePage`)** | Centered hero with RGB pulsing waves, animated RGB border transformation showcase, and 3-step workflow overview. |
| `/editor` | **MP3 Editor (`EditorPage`)** | Dedicated workspace to load `.mp3` files, autocomplete tags, edit `USLT` lyrics and `APIC` cover art, verify binary frames, and download the tagged file. |
| `/search` | **Music Search (`SearchPage`)** | Dedicated explorer to search songs, artists, and albums, listen to available audio previews, and send metadata to the MP3 Editor in one click. |
| `/about` | **About (`AboutPage`)** | Technical documentation covering `ID3v2.3` binary reading/writing, external public data sources, and frequently asked questions. |
| `*` | **404 (`NotFoundPage`)** | Route recovery screen with quick links back to Home, MP3 Editor, and Music Search. |

### Core Technical Specifications
- **Multi-Version Tag Reader**: Parses existing `ID3v2.3`, `ID3v2.4`, and `ID3v1` headers from local `.mp3` files.
- **Standard ID3v2.3 Binary Writer**: Uses `UTF-16LE` encoding with BOM (`0xFF 0xFE`) across `TIT2`, `TPE1`, `TALB`, `TYER`, `TRCK`, `TCON`, `TCOM`, `TPUB`, `USLT`, `COMM`, and `APIC` (`0x03` front cover).
- **Post-Write Binary Verification (`verifyWrittenMp3Blob`)**: Re-parses the generated output `Blob` to verify that title, artist, album, lyrics, and cover art were accurately written before triggering the download.

---

## 🇧🇷 Português

**MetaPulse** é uma aplicação web organizada em páginas dedicadas com estética de estúdio musical e iluminação dinâmica **RGB multicolorida** para analisar, autocompletar, editar e injetar tags binárias **ID3v2.3**, letras de músicas (**USLT**) e capas de álbuns (**APIC 600×600 px**) diretamente em arquivos `.mp3`, acompanhada de um buscador discográfico de músicas, artistas e álbuns.

- **Ver ao vivo:** [https://metapulse.falconit.xyz/](https://metapulse.falconit.xyz/)

### Detalhamento Visual de Como Funciona a Interface

1. **Cabeçalho de Navegação Superior (3 Zonas)**:
   - **Esquerda**: Identidade da marca com o emblema vetorial reativo `MetaPulseLogo`.
   - **Centro**: Links diretos entre as páginas dedicadas (`Início`, `Editor MP3`, `Buscador Musical`, `Sobre`).
   - **Direita**: Acesso rápido através do botão com gradiente RGB animado **«Abrir Editor MP3»**.

2. **Seção Hero Centralizada com Bolha Arco-Íris RGB e Ondas Pulsantes**:
   - Sobre um fundo preto puro (`#000000`), uma bolha gradiente multicolorida e ondas concêntricas suaves irradiam atrás do bloco central de títulos e botões de ação.
   - Permite acessar diretamente o **Editor MP3** (`/editor`), abrir o **Buscador Musical** (`/search`) ou consultar a documentação técnica (`/about`).

3. **Quadro de Transformação de Metadados com Borda de Linhas RGB Animada**:
   - Emoldurado por uma borda perimetral contínua de linhas RGB que mudam constantemente de cor, demonstra como um arquivo local é transformado:
     - **Entrada · Arquivo Local**: Um arquivo como `"REM - Losing My Religion.mp3"` sem tags internas (`0 bytes ID3`).
     - **Processo · Busca e Revisão**: Identificação automática pelo nome do arquivo ou consulta manual no catálogo (`R.E.M. · Out of Time · 1991 · Faixa 4/11`).
     - **Saída · Download Direto**: Cabeçalho binário `ID3v2.3` injetado (`TIT2 · TPE1 · TALB · TYER · USLT · APIC`) com texto em `UTF-16LE` sem recodificar nem alterar os frames de áudio MPEG.

4. **Capacidades da Plataforma e Fluxo em 3 Passos (Fundos de Estúdio Musical com Opacidade Escura)**:
   - **Console de Estúdio (`studio-section-console`)**: Apresenta a edição `ID3v2.3` no navegador, incorporação de capas `APIC` e letras `USLT`, buscador discográfico e prévias de áudio.
   - **Cabine de Produção e Vinis (`studio-section-vinyl`)**: Guia o processo em três etapas: **01. Seleção do arquivo MP3**, **02. Busca e revisão de tags** e **03. Injeção binária e download**.

### Arquitetura de Rotas (`react-router-dom`)

| Rota | Página | Finalidade |
|---|---|---|
| `/` | **Início (`HomePage`)** | Apresentação centralizada com ondas RGB, quadro demonstrativo com borda RGB animada e resumo do fluxo em 3 passos. |
| `/editor` | **Editor MP3 (`EditorPage`)** | Carregamento de arquivos `.mp3`, preenchimento automático de tags, edição de letra `USLT` e capa `APIC`, verificação binária e download. |
| `/search` | **Buscador Musical (`SearchPage`)** | Consulta de músicas, artistas e álbuns, reprodução de prévias de referência e envio de metadados para o Editor MP3 com um clique. |
| `/about` | **Sobre (`AboutPage`)** | Documentação técnica detalhada sobre leitura/escrita binária `ID3v2.3`, fontes públicas de dados e perguntas frequentes. |
| `*` | **404 (`NotFoundPage`)** | Tela de recuperação de rota com atalhos diretos para Início, Editor MP3 e Buscador Musical. |

### Especificações Técnicas Principais
- **Leitura Multi-Versão**: Interpreta cabeçalhos existentes `ID3v2.3`, `ID3v2.4` e `ID3v1`.
- **Escrita Binária Padrão ID3v2.3**: Codificação `UTF-16LE` com BOM (`0xFF 0xFE`) para os frames `TIT2`, `TPE1`, `TALB`, `TYER`, `TRCK`, `TCON`, `TCOM`, `TPUB`, `USLT`, `COMM` e `APIC` (`0x03` capa frontal).
- **Verificação Pós-Escrita (`verifyWrittenMp3Blob`)**: Relê o `Blob` gerado para confirmar que título, artista, álbum, letra e capa foram gravados com precisão antes de iniciar o download do arquivo `.mp3`.

---

## Estructura del Proyecto · Project Structure · Estrutura do Projeto

```text
├── index.html                        # SEO, OpenGraph, JSON-LD & Typography
├── vercel.json                       # Vite build configuration & SPA rewrites
├── .npmrc                            # Peer dependency resolution for deployments
├── public/
│   ├── metapulse-logo.svg            # Official MetaPulse vector emblem
│   ├── metapulse-og.svg              # OpenGraph social card (1200×630)
│   ├── ver-en-vivo-btn.svg           # Custom RGB SVG button for README live link
│   ├── studio-console-bg.svg         # Studio mixing console vector backdrop
│   ├── studio-synth-vinyl-bg.svg     # Turntables & production booth vector backdrop
│   └── assets/aistudio/              # Project screenshots and engineering specs
└── src/
    ├── App.tsx                       # BrowserRouter setup & lazy-loaded routes
    ├── index.css                     # RGB lighting cycle, animated borders & studio backdrops
    ├── main.tsx                      # React entry point
    ├── types/
    │   └── music.ts                  # TypeScript interfaces for ID3 metadata & catalog
    ├── utils/
    │   └── id3.ts                    # ID3v2.3 binary reader, writer & verifier (UTF-16LE, USLT, APIC)
    ├── services/
    │   └── musicCatalog.ts           # Catalog & lyrics API queries with AbortSignal
    ├── components/
    │   ├── layout/
    │   │   └── AppLayout.tsx         # 3-zone header, scroll-to-top & footer
    │   ├── MetaPulseLogo.tsx         # RGB-reactive SVG brand emblem
    │   ├── CoverArtVisual.tsx        # Resilient cover art renderer with SVG fallback
    │   ├── Mp3TaggerStudio.tsx       # MP3 Editor core engine
    │   └── CatalogExplorer.tsx       # Music Search core engine
    └── pages/
        ├── HomePage.tsx              # Route /
        ├── EditorPage.tsx            # Route /editor
        ├── SearchPage.tsx            # Route /search
        ├── AboutPage.tsx             # Route /about
        └── NotFoundPage.tsx          # Route * (404)
```
