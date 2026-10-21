# MetaPulse — Estudio Cyberpunk de Metadatos MP3 e Inspector Discográfico

**MetaPulse** es una aplicación web de estética cyberpunk futurista diseñada para analizar, autocompletar, editar e inyectar etiquetas binarias **ID3v2.3**, letras de canciones (**USLT**) y carátulas oficiales en alta resolución (**APIC 600×600 px**) directamente dentro de archivos `.mp3`, acompañada de un buscador técnico de canciones, artistas y álbumes en tiempo real.

---

## Propósito y Función Principal

Muchos archivos de audio digitalizados o descargados carecen de metadatos internos y solo cuentan con el nombre del archivo (por ejemplo, `"REM - Losing My Religion.mp3"`). **MetaPulse** resuelve este problema mediante un flujo automatizado 100 % en el navegador:

1. **Lectura e Inspección Binaria**: Analiza las cabeceras existentes (`ID3v2.3`, `ID3v2.4` o `ID3v1`) del archivo `.mp3` cargado sin alterar ni recodificar el flujo de audio MPEG original.
2. **Autodetección Heurística en la Red**: Si el archivo no posee etiquetas internas, limpia el nombre del archivo y consulta catálogos musicales internacionales y bases de datos de letras en tiempo real para recuperar automáticamente todos los metadatos, la portada oficial del álbum y la letra de la canción.
3. **Empaquetado y Descarga Directa**: Construye la nueva cabecera binaria `ID3v2.3` codificada en `UTF-16LE` (con BOM) y genera un nuevo archivo `.mp3` listo para descargar y usar en reproductores como VLC, Apple Music, Rekordbox, Serato o sistemas de audio automotrices.

---

## Características Principales

### 1. Estudio de Inyección Binaria ID3v2.3 (`Mp3TaggerStudio`)
- **Carga Local y Simulador Instantáneo**: Permite arrastrar cualquier archivo `.mp3` desde el ordenador o probar al instante con archivos MP3 de muestra sin metadatos (`"REM - Losing My Religion.mp3"`, `"Daft Punk - Veridis Quo.mp3"`, `"Kavinsky - Nightcall.mp3"`, `"Soda Stereo - De Musica Ligera.mp3"`).
- **Tramas Estándar Soportadas**:
  - `TIT2`: Título de la canción.
  - `TPE1`: Artista o intérprete principal.
  - `TALB`: Álbum o colección.
  - `TYER`: Año de publicación.
  - `TRCK`: Número de pista y total del álbum (ej. `4/11`).
  - `TCON`: Género musical.
  - `TCOM`: Compositor / créditos.
  - `TPUB`: Sello discográfico / editorial.
  - `USLT`: Letra completa no sincronizada del tema (*Unsynchronised Lyric/Text Transcription*), autocompletada desde la red o editable manualmente.
  - `COMM`: Comentarios técnicos embebidos.
  - `APIC`: Carátula frontal (*Front Cover*, descriptor `0x03`) en resolución `600×600 px` obtenida automáticamente o reemplazada por una imagen local (`JPEG`, `PNG` o `WebP`).
- **Inspector de Estructura Binaria en Vivo**: Tabla técnica que calcula en tiempo real el tamaño exacto en bytes de cada trama antes de empaquetar el archivo.

### 2. Buscador de Metadatos de Canciones, Artistas y Álbumes (`CatalogExplorer`)
- **Modo de Consulta Técnica**: Diseñado exclusivamente para explorar e inspeccionar fichas técnicas sin descargas intrusivas de pistas comerciales.
- **Tres Vistas Especializadas**:
  - **Canciones**: Muestra carátula, álbum, año, número de pista, duración exacta, muestra de referencia de 30 segundos, visor de letra (`USLT`) y botón para enviar todas las etiquetas directamente al editor MP3.
  - **Artistas y Discografía**: Agrupa el género principal del artista, sus álbumes indexados y sus temas más representativos.
  - **Álbumes e Inspector de Tracklist**: Al seleccionar un álbum se despliega su ficha técnica completa (sello/copyright, fecha exacta de lanzamiento, país y listado íntegro de pistas con numeración y duración).

### 3. Sistema de Temas Cyberpunk Neón (4 Paletas Globales)
El usuario puede alternar en tiempo real el tema visual de toda la plataforma (incluyendo la landing page, el logo vectorial de MetaPulse, el estudio de metadatos y la etiqueta `<meta name="theme-color">` del navegador):
- **Verde Neón** (`#00FF66`)
- **Rojo Carmesí** (`#FF2A54`)
- **Azul Cian** (`#00D4FF`)
- **Morado Cyber** (`#B855FF`)

### 4. Animaciones de Scroll e Identidad Web SEO
- **Animaciones Fluidas (`motion/react`)**: Aparición progresiva de secciones, tarjetas y paneles al desplazarse por la página (`whileInView`).
- **Identidad y Metadatos HTML**: Incluye logo vectorial propio (`/metapulse-logo.svg`), banner social OpenGraph (`/metapulse-og.svg`), tarjetas para Twitter/X y datos estructurados **Schema.org (`JSON-LD`)** bajo el estándar `WebApplication`.

---

## Arquitectura del Proyecto

```text
├── index.html                        # Metadatos de identidad web, OpenGraph, JSON-LD y fuentes
├── metadata.json                     # Configuración de metadatos de la aplicación
├── public/
│   ├── metapulse-logo.svg            # Logo vectorial oficial de MetaPulse
│   └── metapulse-og.svg              # Imagen OpenGraph (1200×630) para compartir en redes
└── src/
    ├── App.tsx                       # Landing page cyberpunk, selector de temas y estructura general
    ├── index.css                     # Variables CSS de los 4 temas neón y estilos base
    ├── main.tsx                      # Punto de entrada de React
    ├── types/
    │   └── music.ts                  # Interfaces TypeScript para etiquetas ID3 y catálogo musical
    ├── utils/
    │   └── id3.ts                    # Motor binario lector/escritor ID3v2.3 (UTF-16, USLT, APIC)
    ├── services/
    │   └── musicCatalog.ts           # Autodetección por nombre de archivo, API de catálogo y letras
    └── components/
        ├── MetaPulseLogo.tsx         # Emblema SVG reactivo al color neón activo
        ├── CoverArtVisual.tsx        # Renderizador resiliente de carátulas con vinilo SVG de respaldo
        ├── Mp3TaggerStudio.tsx       # Estudio interactivo de edición e inyección de metadatos MP3
        └── CatalogExplorer.tsx       # Mini buscador de canciones, artistas, álbumes y letras
```

---

## Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript + Vite
- **Estilos y Tematización**: Tailwind CSS v4 + Variables CSS dinámicas
- **Animaciones**: Motion (`motion/react`)
- **Iconografía y Gráficos**: Lucide React + SVG vectorial reactivo
- **Procesamiento Binario de Audio**: Manipulación nativa con `ArrayBuffer`, `Uint8Array`, `Blob` y `TextDecoder` / `TextEncoder` bajo la especificación **ID3v2.3.0**
