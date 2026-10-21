# MetaPulse — Estudio Cyberpunk de Metadatos MP3 e Inspector Musical

**MetaPulse** es una aplicación web organizada en vistas dedicadas con estética cyberpunk futurista para analizar, autocompletar, editar e inyectar etiquetas binarias **ID3v2.3**, letras de canciones (**USLT**) y carátulas (**APIC 600×600 px**) en archivos `.mp3`, junto con un buscador de canciones, artistas y álbumes.

---

## Arquitectura de Navegación y Páginas (`react-router-dom`)

| Ruta | Vista | Propósito |
|---|---|---|
| `/` | **Home (`HomePage`)** | Presentación del producto, demostración visual compacta del flujo ID3v2.3 y acceso directo a las herramientas. |
| `/editor` | **Editor MP3 (`EditorPage`)** | Entorno dedicado para cargar archivos `.mp3`, autocompletar etiquetas, editar letra `USLT` / portada `APIC`, inspeccionar tramas binarias y descargar el resultado. |
| `/search` | **Buscador Musical (`SearchPage`)** | Entorno dedicado para consultar canciones, artistas y álbumes, escuchar vistas previas cuando están disponibles y transferir metadatos al Editor MP3. |
| `/about` | **Acerca de (`AboutPage`)** | Documentación técnica sobre lectura/escritura binaria `ID3v2.3`, uso de servicios externos y preguntas frecuentes. |
| `*` | **404 (`NotFoundPage`)** | Recuperación de navegación hacia Inicio, Editor MP3 o Buscador Musical. |

---

## Características Principales

### 1. Editor de Metadatos MP3 (`/editor`)
- **Validación y Carga Local**: Valida archivos `.mp3` seleccionados o arrastrados desde el dispositivo y ofrece contenedores de prueba sin etiquetas (`"REM - Losing My Religion.mp3"`, `"Daft Punk - Veridis Quo.mp3"`, `"Kavinsky - Nightcall.mp3"`, `"Soda Stereo - De Musica Ligera.mp3"`).
- **Tramas Admitidas**:
  - Lectura de cabeceras `ID3v2.3`, `ID3v2.4` e `ID3v1`.
  - Escritura binaria `ID3v2.3` en codificación `UTF-16LE` con BOM para `TIT2` (Título), `TPE1` (Artista), `TALB` (Álbum), `TYER` (Año), `TRCK` (Pista), `TCON` (Género), `TCOM` (Compositor), `TPUB` (Sello), `USLT` (Letra no sincronizada), `COMM` (Comentario) y `APIC` (Carátula frontal `0x03`).
- **Inspector Binario Plegable**: Desglose en vivo del tamaño en bytes de cada trama antes de descargar el archivo `.mp3`.

### 2. Buscador Musical (`/search`)
- **Modos de Consulta**: Búsqueda filtrada por **Canciones**, **Artistas y Discografía** y **Álbumes** con cancelación automática de peticiones anteriores (`AbortController`).
- **Reproductor de Vistas Previas**: Reproduce fragmentos de referencia cuando la fuente los proporciona e informa explícitamente cuando una edición no dispone de vista previa.
- **Integración con el Editor**: El botón **«Usar en Editor»** transfiere los metadatos normalizados hacia `/editor` para que el usuario los revise antes de escribir en su archivo.

### 3. Sistema Visual y 4 Temas Neón Globales
Selector global persistente en todas las rutas para alternar entre **Verde Neón** (`#00FF66`), **Rojo Carmesí** (`#FF2A54`), **Azul Cian** (`#00D4FF`) y **Morado Cyber** (`#B855FF`), respetando preferencias de movimiento reducido (`prefers-reduced-motion`).

---

## Estructura del Proyecto

```text
├── index.html                        # Metadatos SEO, OpenGraph, JSON-LD y tipografías
├── vercel.json                       # Configuración de compilación Vite y rewrites SPA
├── public/
│   ├── metapulse-logo.svg            # Logo vectorial oficial de MetaPulse
│   └── metapulse-og.svg              # Imagen OpenGraph (1200×630)
└── src/
    ├── App.tsx                       # Configuración de BrowserRouter y rutas principales
    ├── index.css                     # Tokens de diseño, 4 temas neón y accesibilidad
    ├── main.tsx                      # Punto de entrada React
    ├── types/
    │   └── music.ts                  # Modelos TypeScript de metadatos y catálogo
    ├── utils/
    │   └── id3.ts                    # Lector/escritor binario ID3v2.3 (UTF-16LE, USLT, APIC)
    ├── services/
    │   └── musicCatalog.ts           # Consultas a APIs de catálogo y letras con AbortSignal
    ├── components/
    │   ├── layout/
    │   │   └── AppLayout.tsx         # Cabecera compartida, selector de tema y pie de página
    │   ├── MetaPulseLogo.tsx         # Emblema SVG reactivo al tema activo
    │   ├── CoverArtVisual.tsx        # Renderizador resiliente de portadas con respaldo SVG
    │   ├── Mp3TaggerStudio.tsx       # Motor de interfaz del Editor MP3
    │   └── CatalogExplorer.tsx       # Motor de interfaz del Buscador Musical
    └── pages/
        ├── HomePage.tsx              # Ruta /
        ├── AboutPage.tsx             # Ruta /about
        ├── EditorPage.tsx            # Ruta /editor
        ├── SearchPage.tsx            # Ruta /search
        └── NotFoundPage.tsx          # Ruta * (404)
```
