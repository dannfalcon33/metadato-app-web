# MetaPulse — Plan de desarrollo y modernización

**Documento para:** Argon 4 en Google AI Studio  
**Tipo de proyecto:** Aplicación web React existente  
**Objetivo:** Separar la página de presentación de las herramientas, modernizar la experiencia de usuario y conservar la funcionalidad actual.  
**Entorno de producción informado por el propietario:** https://metapulse.falconit.xyz/  
**Repositorio y despliegue:** proyecto conectado a GitHub y desplegado en Vercel.  
**Estrategia:** auditoría primero, cambios incrementales por fases y validación antes de integrar en producción.

---

## 1. Instrucción principal para el agente

Actúa como ingeniero de software senior y diseñador de producto especializado en React, aplicaciones musicales y experiencias web modernas.

Debes **trabajar sobre el proyecto existente de MetaPulse**, no reemplazarlo por una aplicación nueva ni reconstruir desde cero funciones que ya trabajan. El objetivo es reorganizar y modernizar el producto en fases pequeñas, revisables y comprobables.

La aplicación permite trabajar con metadatos de archivos MP3 y buscar información musical mediante integraciones con Spotify, Deezer y otras fuentes configuradas en el proyecto. Según la implementación actual, la búsqueda puede ofrecer vistas previas de canciones. Antes de tocar cualquiera de estas funciones, debes identificar cómo están implementadas realmente.

La prioridad es mantener la funcionalidad y los datos actuales. El rediseño visual debe apoyarse en una arquitectura más clara, no sustituir el motor existente por simulaciones, datos inventados ni componentes que solo parezcan funcionales.

### Reglas obligatorias

1. **Audita antes de editar.** Inspecciona el repositorio, su estructura, dependencias, scripts, configuración de despliegue, componentes, servicios, integraciones y flujos reales.
2. **Preserva las funciones existentes.** No elimines ni simules capacidades de edición, reconocimiento, búsqueda, vista previa, metadatos, carátulas, descarga o visualización binaria que ya existan.
3. **No reescribas todo el proyecto.** Extrae y reorganiza componentes gradualmente. Reutiliza la lógica actual siempre que sea válida.
4. **No actualices dependencias principales de forma indiscriminada.** Mantén las versiones instaladas salvo que un cambio sea necesario y justificado. Verifica la compatibilidad antes de instalar React Router DOM u otra librería.
5. **No inventes integraciones.** No supongas que una API, campo de respuesta, credencial o vista previa está disponible. Revisa el código y documenta las limitaciones reales.
6. **No expongas secretos.** No pongas claves privadas en código cliente, commits, archivos públicos ni registros. No modifiques variables de entorno de producción sin autorización.
7. **Protege la producción.** No hagas force-push, no borres ramas, no cambies el dominio, no alteres la configuración de Vercel ni despliegues a producción deliberadamente sin autorización expresa del propietario.
8. **Trabaja en una rama de desarrollo cuando el entorno lo permita.** Usa una rama como `feature/metapulse-multipage-redesign` y verifica los cambios mediante build y, si está disponible, un Preview Deployment de Vercel. Si el entorno obliga a trabajar sobre otra rama, informa de la limitación antes de operaciones que puedan afectar producción.
9. **Avanza por fases.** Al terminar cada fase, resume archivos modificados, decisiones técnicas, comprobaciones ejecutadas, resultados y tareas pendientes. No declares una fase terminada si las comprobaciones fallan.
10. **No ocultes errores.** Si una funcionalidad existente está rota antes de los cambios, registra el estado inicial y separa ese problema de las regresiones introducidas por la refactorización.

---

## 2. Contexto conocido y aspectos por verificar

### Información conocida

- El nombre del producto es **MetaPulse**.
- La base actual es una aplicación React creada inicialmente con Google AI Studio.
- El proyecto ya está publicado y conectado a GitHub y Vercel.
- URL de producción informada: https://metapulse.falconit.xyz/
- La interfaz actual tiene una identidad oscura/cyberpunk: fondo negro, cuadrícula técnica, verde neón, paneles compactos y estética de herramientas musicales.
- La herramienta de metadatos permite seleccionar un archivo MP3, buscar información, revisar o editar etiquetas y descargar un resultado.
- La aplicación incluye búsquedas de artistas, álbumes y canciones, además de vistas previas musicales cuando las fuentes y sus permisos las proporcionan.
- La interfaz actual incluye información de etiquetas ID3, carátulas y una vista técnica/estructural de los metadatos.

### Debes verificar antes de planificar cambios de implementación

- Versión de React y herramienta de compilación (por ejemplo, Vite u otra).
- Gestor de paquetes y archivo lock que corresponda.
- Rama activa, estado de Git y configuración de ramas/despliegue.
- Estructura actual de `src`, puntos de entrada y componentes principales.
- Si React Router DOM ya está instalado y, en caso afirmativo, cómo se usa.
- Cómo se realiza el procesamiento de audio: navegador, servidor o combinación.
- Biblioteca que lee/escribe metadatos y versiones ID3 actualmente admitidas.
- Cómo se guardan las imágenes de portada en el MP3 y cómo se genera la descarga.
- Servicios y adaptadores existentes para Spotify, Deezer y otros proveedores.
- Manejo actual de tokens, variables de entorno, límites de solicitudes y errores de API.
- Disponibilidad y formato reales de las vistas previas de audio.
- Pruebas automatizadas disponibles, scripts de lint, compilación y despliegue.
- Configuración existente de Vercel, incluyendo rewrites, headers y rutas de SPA.
- Activos de marca, tipografías, imágenes, vídeos y licencias presentes en el proyecto.

**No asumas que has inspeccionado el sitio o el repositorio solo por conocer su URL.** Utiliza el acceso real al código disponible en el entorno de trabajo. Si no puedes acceder a un archivo, servicio o configuración, indícalo y continúa sin inventar su contenido.

---

## 3. Objetivo del producto

Transformar MetaPulse en una aplicación web organizada en cuatro páginas principales que compartan el mismo sistema visual:

1. **Home:** presentación del producto y acceso claro a las herramientas.
2. **About:** explicación de la utilidad, funcionamiento y capacidades de MetaPulse.
3. **Editor MP3:** entorno dedicado a completar y editar metadatos.
4. **Buscador musical:** entorno dedicado a consultar artistas, álbumes y canciones y escuchar vistas previas disponibles.

La navegación debe ser clara y sentirse como una aplicación única. Las páginas funcionales deben tener más espacio para trabajar, mientras que el Home debe presentar el producto sin duplicar toda la interfaz del editor o el buscador.

### Objetivos de experiencia

- Reducir la longitud excesiva de la página actual y separar presentación de funcionalidad.
- Permitir llegar a cada herramienta desde la navegación principal y desde llamadas a la acción.
- Mantener el estilo cyberpunk/neón con una ejecución más refinada, legible y consistente.
- Usar animaciones y medios ambientales con moderación, sin sacrificar velocidad ni accesibilidad.
- Facilitar el paso desde una canción encontrada hasta el editor MP3 cuando el flujo actual lo permita.
- Mantener una experiencia sólida en escritorio, tablet y móvil.

### Fuera del alcance inicial

No añadir autenticación, cuentas, pagos, planes de suscripción, backend nuevo, base de datos nueva ni funcionalidades comerciales que no existan ya y no sean necesarias para la separación de páginas. No convertir el proyecto en una reescritura de arquitectura completa. Cualquier trabajo de ese tipo requiere una propuesta separada y aprobación.

---

## 4. Arquitectura de navegación y páginas

Implementa una navegación con React Router DOM compatible con la versión real del proyecto. Si ya existe un router, extiéndelo en lugar de crear otro.

### Rutas objetivo

| Ruta | Página | Propósito |
|---|---|---|
| `/` | Home | Presentación y acceso a las herramientas. |
| `/about` | About | Explicar el proyecto y sus capacidades. |
| `/editor` | Editor MP3 | Selección, reconocimiento, edición y descarga de metadatos. |
| `/search` | Buscador musical | Búsqueda de canciones, artistas y álbumes, con vistas previas disponibles. |
| Ruta no reconocida | 404 / Not Found | Mostrar un mensaje útil y enlaces para volver al Home o a las herramientas. |

### Requisitos de navegación

- Todas las páginas funcionales deben ser accesibles directamente mediante su URL.
- Los enlaces internos deben usar los mecanismos de navegación de React Router; evitar recargas completas innecesarias.
- La navegación debe indicar de forma clara la página activa.
- La cabecera y el footer deben compartir los mismos estilos, enlaces y comportamiento entre páginas.
- Los enlaces de Home al editor y al buscador deben llevar a sus rutas definitivas.
- Al cambiar de ruta, la vista anterior no debe quedar visualmente superpuesta ni mantener animaciones que bloqueen la interfaz.
- Añadir una página 404 que permita recuperar la navegación.
- Gestionar el título de página y, cuando sea viable con la configuración existente, sus metadatos básicos.
- Comprobar que abrir o actualizar `/about`, `/editor` y `/search` directamente no produce un 404 del servidor.

### Integración entre buscador y editor

Si el usuario elige una canción desde el buscador y pulsa una acción equivalente a **“Usar en el editor”** o **“Cargar metadatos”**, pasa al editor los datos normalizados disponibles para precompletar los campos relevantes.

- Reutiliza los modelos actuales siempre que sea posible.
- Usa el estado del router o un estado compartido mínimo, según convenga a la arquitectura real.
- No pongas archivos MP3, tokens ni información sensible en la URL.
- No dependas exclusivamente del estado de navegación para que el editor pueda abrirse normalmente después de actualizar la página.
- Si faltan datos, permite continuar usando el editor sin bloquearlo.
- No sobrescribas un archivo ni guardes etiquetas automáticamente solo por seleccionar un resultado de búsqueda; el usuario debe poder revisar y confirmar.

---

## 5. Requisitos funcionales del Home

El Home es la página de presentación, no la aplicación completa dentro de una única página larga.

### Secciones recomendadas

1. **Hero principal:** título, explicación breve y llamadas a la acción para el Editor y el Buscador.
2. **Demostración visual:** una representación pequeña del flujo de completar metadatos, sin duplicar el editor funcional.
3. **Características:** tarjetas que expliquen edición de metadatos, búsqueda musical, carátulas y vistas previas.
4. **Cómo funciona:** flujo resumido de selección de archivo, búsqueda/revisión de coincidencias y descarga.
5. **Llamada a la acción final:** acceso al editor y al buscador.
6. **Footer compartido:** navegación a Home, About, Editor y Buscador.

### Contenido

- El mensaje debe ser breve, concreto y legible.
- No afirmar compatibilidad con todos los formatos o proveedores si no está demostrada.
- No asegurar que cada canción tiene una vista previa de 30 segundos: depende de la fuente, disponibilidad y permisos de cada resultado.
- Evitar duplicar las listas extensas de resultados que ahora aparecen en la página general.

### Hero con imagen o vídeo

Objetivo visual: una presentación cinematográfica con ambiente de estudio musical, ondas de audio, discos, partículas o líneas digitales abstractas. Mantener la identidad actual de fondo oscuro, cuadrícula técnica y verde neón.

- Antes de crear o añadir recursos, inspecciona si ya existen imágenes, vídeos o fondos que se puedan aprovechar.
- Si existen archivos de vídeo aprobados, utiliza un bucle breve sin sonido con `autoplay`, `muted`, `loop` y `playsInline` cuando corresponda.
- Incluye un póster o imagen de respaldo para evitar un fondo vacío durante la carga.
- Aplica una capa oscura o degradado para garantizar el contraste del texto.
- Optimiza resolución, peso y formato; evita descargar vídeos grandes antes de mostrar el contenido principal.
- Si no hay un recurso adecuado, implementa primero una solución visual con activos existentes y comunica que el vídeo final queda pendiente. No inventes rutas de activos ni enlaces externos.
- Debe existir una alternativa estática y respetarse la preferencia de movimiento reducido del sistema.

---

## 6. Requisitos funcionales de About

Crear una página informativa consistente con la identidad de MetaPulse y el mismo layout compartido.

### Contenido sugerido

- Qué es MetaPulse y qué problema ayuda a resolver.
- Cómo se puede encontrar información para completar los metadatos de un MP3.
- Descripción del flujo de edición y descarga.
- Explicación de las búsquedas de canciones, artistas y álbumes.
- Información de los estándares y campos que la implementación actual admita realmente.
- Explicación transparente sobre el procesamiento de archivos y uso de servicios externos.
- Preguntas frecuentes concisas y enlaces al Editor y Buscador.

### Reglas de exactitud

- No prometer procesamiento local si el código envía el audio a un servidor o a un proveedor externo.
- No afirmar que no se almacenan archivos, que no se guardan datos o que una fuente es oficial sin comprobarlo.
- No publicar detalles privados, tokens, claves o configuración interna.
- Si algún aspecto técnico no se puede verificar, omitir la afirmación categórica y reportar el punto pendiente.

---

## 7. Requisitos funcionales del Editor MP3

El editor debe convertirse en un área dedicada de trabajo, conservando su lógica y sus capacidades reales.

### Flujo esperado

1. Seleccionar o arrastrar un archivo MP3.
2. Validar el archivo y mostrar nombre, tamaño y estado.
3. Buscar candidatos o recuperar información musical con los mecanismos ya disponibles.
4. Mostrar candidatos con datos suficientes para que el usuario compare las coincidencias.
5. Permitir revisar y editar las etiquetas antes de guardarlas.
6. Mostrar la carátula actual y permitir utilizar o modificar la imagen según lo admitido actualmente.
7. Guardar/escribir las etiquetas con el motor existente.
8. Permitir descargar el archivo procesado y mostrar un resultado claro.

### Campos y capacidades

Identifica primero el conjunto exacto de campos admitidos por la implementación. La interfaz actual muestra información asociada a etiquetas como título, artista, álbum, año, número de pista, género, compositor, letras USLT y carátula. Conserva y verifica los campos que el motor realmente maneje.

### Conservación del motor

- No sustituyas la biblioteca de lectura/escritura de metadatos sin una razón técnica demostrada.
- No recodifiques el audio solo para modificar etiquetas, salvo que sea parte imprescindible del comportamiento actual y esté documentado.
- Verifica la compatibilidad real de ID3v2.3, ID3v2.4 u otras versiones antes de anunciarlas como admitidas.
- Comprueba que una nueva escritura mantiene los campos no modificados que deban conservarse.
- Comprueba la descarga del resultado y vuelve a leer sus etiquetas si las herramientas disponibles lo permiten.
- No modifiques automáticamente el archivo original de forma destructiva.
- Mantén el panel de información binaria/estructura como función avanzada si ya funciona, preferentemente en un panel secundario que no distraiga del flujo principal.
- No elimines demos, pistas de prueba o elementos auxiliares antes de determinar si tienen dependencias de desarrollo o son parte de una función de producto.

### Estados de interfaz necesarios

Incluye estados visuales claros para archivo sin seleccionar, validación, búsqueda, resultados, ausencia de coincidencias, edición pendiente, guardado, descarga y errores. Los mensajes deben explicar cómo continuar y no limitarse a mostrar un spinner indefinido.

---

## 8. Requisitos funcionales del Buscador musical

Separar en una ruta propia la búsqueda musical y sus resultados.

### Interfaz

- Campo de búsqueda principal.
- Filtros por canciones, artistas y álbumes, en línea con los modos que ya tenga la aplicación.
- Filtros contextuales según el tipo de resultado.
- Tarjetas o filas legibles con carátula, título, artista, álbum y otros metadatos que devuelva realmente la fuente.
- Vista detallada para consultar una canción, artista, discografía o álbum, según las capacidades existentes.
- Reproductor compacto para los previews que estén disponibles.
- Acción para transferir los metadatos seleccionados al Editor, sin escribir automáticamente en el MP3.

### Comportamiento de búsqueda

- Añadir debounce solo si resulta adecuado al flujo actual.
- Evitar que una respuesta antigua sustituya resultados de una consulta más reciente.
- Cancelar solicitudes anteriores cuando la implementación y las APIs lo permitan.
- Manejar resultados vacíos, fallos de red, límites de solicitudes y errores específicos de cada fuente.
- Si no hay vista previa, mostrarlo claramente y mantener disponibles los metadatos del resultado.
- Si las fuentes devuelven estructuras distintas, usar adaptadores y un modelo común sin alterar innecesariamente las integraciones que ya funcionan.
- No añadir proveedores nuevos como parte de esta refactorización salvo petición expresa.

### Reproductor de vista previa

- Reproducir únicamente URLs de preview entregadas legítimamente por la integración existente.
- No construir URLs ficticias ni descargar audio completo desde fuentes no autorizadas.
- Gestionar reproducción, pausa, progreso, error y ausencia de preview.
- Evitar que varias tarjetas reproduzcan audio simultáneamente, si el reproductor actual permite controlar ese estado.
- Respetar los límites, los términos y los permisos del proveedor.
- No asegurar que todos los previews tienen 30 segundos; mostrar la duración real disponible cuando se conozca.

### Seguridad de las integraciones

- Inspeccionar cómo se obtienen y utilizan las credenciales actuales.
- No mover secretos a variables accesibles desde el navegador.
- No mostrar tokens en consola, pantalla, URL o logs persistentes.
- Si se identifica una credencial expuesta, no imprimir su valor: notificar el riesgo y proponer la corrección adecuada antes de desplegar.
- No cambiar el mecanismo de autenticación o proxy de una API sin entender sus dependencias.

---

## 9. Sistema visual y dirección de diseño

### Identidad

Conservar la personalidad de MetaPulse: cyberpunk musical, fondo carbón casi negro, cuadrícula técnica sutil, verde neón como color de acción y tipografía compacta de carácter tecnológico.

Refinar el sistema para que sea más legible y contemporáneo, sin convertir cada sección en una colección de efectos.

### Principios de interfaz

- Jerarquía visual clara: título, explicación, acción principal y contenido.
- Contraste suficiente para texto normal, controles y estados.
- Espaciado consistente entre secciones y componentes.
- Superficies con diferentes niveles de profundidad, bordes discretos y brillos verdes moderados.
- Iconos coherentes en estilo, tamaño y alineación.
- Las animaciones deben reforzar la comprensión y la respuesta, no dificultar la lectura.
- Las páginas del Editor y Buscador deben priorizar la densidad útil de información y la productividad.
- Evitar tamaños de fuente minúsculos, especialmente en formularios, tarjetas y metadatos.

### Tokens de diseño

Centraliza los valores repetidos usando el sistema que ya tenga el proyecto (CSS variables, estilos globales, Tailwind u otra solución existente). No añadas un sistema CSS nuevo sin necesidad.

Define o unifica tokens para:

- Fondo principal y fondos de superficie.
- Color de acción verde neón y sus estados.
- Texto principal, secundario y deshabilitado.
- Bordes, sombras y glows.
- Radios de esquina y espaciados.
- Tipografía, escalas de tamaño y altura de línea.
- Duraciones y curvas de transición.
- Breakpoints y anchos máximos de contenido.

Los valores definitivos deben salir de la inspección y del ajuste visual; no multipliques colores casi idénticos sin una función clara.

---

## 10. Animaciones, imágenes y vídeo

Se busca una web llamativa y moderna, pero ligera y usable.

### Efectos recomendados

- Aparición sutil de secciones cuando entran en pantalla.
- Transiciones cortas al navegar entre rutas, si no causan parpadeo ni bloquean la interacción.
- Estados hover y focus consistentes en botones, enlaces y tarjetas.
- Feedback para carga, búsqueda, guardado y descarga.
- Movimiento ambiental discreto en el hero, con ondas, partículas o reflejos si existen recursos adecuados.

### Reglas técnicas

- Usa CSS para animaciones sencillas.
- Añade como máximo una librería de animación adicional si la arquitectura actual realmente lo necesita y su coste está justificado.
- Evita animar continuamente grandes superficies, filtros costosos o propiedades que provoquen trabajo de layout innecesario.
- Prioriza `transform` y `opacity` para animaciones cuando sea apropiado.
- Respeta `prefers-reduced-motion`.
- No retrases el acceso a las herramientas esperando que termine una animación.
- Usa imágenes con dimensiones definidas, formatos optimizados y carga diferida cuando corresponda.
- No cargues de forma eager todos los fondos, portadas y vídeos de páginas que el usuario todavía no ha abierto.
- No uses imágenes remotas aleatorias como solución definitiva ni asumas que una URL externa estará disponible en producción.
- Todo activo nuevo debe tener una ubicación clara dentro del proyecto y respetar su licencia y atribución si corresponde.

### Estrategia para el hero multimedia

1. Revisar los activos existentes.
2. Preparar un recurso optimizado y un póster estático.
3. Implementar overlay oscuro/degradado y comprobar legibilidad.
4. Comprobar carga en escritorio y móvil.
5. Probar la alternativa sin vídeo y el modo de movimiento reducido.
6. Medir el efecto sobre el rendimiento.

Si todavía no existe un recurso final, no bloquees las demás fases: crea una implementación visual provisional con activos válidos del propio proyecto y deja documentado qué recurso deberá sustituirse.

---

## 11. Responsive, accesibilidad y rendimiento

### Responsive

- Escritorio: aprovechar el espacio sin extender excesivamente las líneas de texto.
- Tablet: adaptar la cuadrícula y el panel de metadatos.
- Móvil: navegación cómoda, controles táctiles, tarjetas en una columna cuando corresponda y formularios sin desbordamiento horizontal.
- Los paneles técnicos/binarios deben plegarse o desplazarse de forma controlada en pantallas pequeñas.
- El reproductor debe seguir siendo accesible cuando las listas sean largas, sin cubrir campos necesarios del editor.

### Accesibilidad

- Los botones y enlaces deben usar elementos semánticos correctos.
- Todas las funciones deben poder operarse con teclado.
- Los estados focus deben ser visibles.
- Los formularios deben tener etiquetas accesibles y mensajes de validación comprensibles.
- El estado de carga o resultado de una operación debe anunciarse de forma apropiada sin generar ruido excesivo.
- Las imágenes decorativas no deben crear ruido para lectores de pantalla; las carátulas informativas deben tener texto alternativo adecuado.
- No comunicar un estado únicamente por color.
- Comprobar contraste y movimiento reducido.

### Rendimiento

- Mantener liviana la carga inicial de Home.
- Considerar carga diferida de las rutas funcionales si la arquitectura y el empaquetado actual lo justifican.
- Evitar cargar el motor de metadatos pesado en páginas que no lo usan si las dependencias permiten separarlo.
- Optimizar imágenes, fuentes y vídeo.
- Evitar renders innecesarios en listas largas de resultados.
- Mostrar estados de carga honestos y evitar pantallas que parezcan congeladas.
- Ejecutar el build de producción y comprobar errores y advertencias relevantes.

---

## 12. Arquitectura interna objetivo

La organización definitiva debe adaptarse al repositorio auditado. La siguiente estructura es una **referencia**, no una instrucción para mover todos los archivos de golpe:

```text
src/
├── app/
│   ├── router
│   └── layouts/
├── pages/
│   ├── Home/
│   ├── About/
│   ├── Editor/
│   └── Search/
├── features/
│   ├── metadata-editor/
│   ├── music-search/
│   └── audio-preview/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── music/
│   └── motion/
├── services/
│   ├── providers/
│   └── metadata/
├── hooks/
├── utils/
└── styles/
```

### Criterios de separación

- Las páginas coordinan la composición y el flujo; no deberían contener todos los detalles de lógica de negocio.
- Los componentes compartidos se ubican en una capa reutilizable.
- La lógica de metadatos debe permanecer en el módulo correspondiente y no mezclarse con el diseño de Home.
- Las integraciones de proveedores deben conservar las implementaciones existentes y ofrecer interfaces claras a la UI.
- Los modelos normalizados deben ser mínimos y basarse en los datos reales que entregan los proveedores.
- Evita crear capas, hooks o abstracciones que no tengan un uso claro.
- Evita duplicar componentes o lógica entre rutas.
- Mantén separados el estado efímero de interfaz y los datos de negocio cuando esto mejore la claridad.
- No añadas un gestor de estado global si React Router, props, hooks o el contexto existente resuelven el caso con menos complejidad.

---

## 13. Plan de ejecución por fases

Trabaja en el siguiente orden. Cada fase debe ser pequeña, validable y fácil de revertir.

### Fase 0 — Auditoría y línea base

**Tareas**

1. Inspeccionar el repositorio y describir la arquitectura actual.
2. Confirmar framework, herramientas, dependencias y scripts.
3. Localizar el código de edición de metadatos, búsqueda, proveedores, audio preview, carátulas y descarga.
4. Identificar qué contenido está mezclado actualmente dentro de la página general.
5. Ejecutar las comprobaciones existentes: instalación en modo compatible con el lock, lint/test/build disponibles.
6. Registrar errores previos, limitaciones y riesgos de producción.
7. Revisar la configuración actual de GitHub y Vercel sin modificarla.

**Entrega de fase**

- Resumen de arquitectura y flujo actual.
- Inventario de funciones que no se pueden perder.
- Lista de archivos/componentes relevantes.
- Resultados de build, tests y lint existentes.
- Propuesta de cambios mínimos y posibles riesgos.

**Puerta de aprobación**

No empieces una refactorización amplia hasta saber dónde están las funciones críticas y qué comprobaciones funcionan.

### Fase 1 — Router y layout común

**Tareas**

1. Instalar React Router DOM solo si no existe y confirmar compatibilidad.
2. Añadir las cuatro rutas principales y una ruta 404.
3. Extraer la cabecera, navegación y footer compartidos sin rediseñarlos por completo todavía.
4. Establecer enlaces correctos y estado activo de navegación.
5. Mover la funcionalidad actual a una ruta temporal/dedicada de forma que siga disponible durante la extracción.
6. Configurar la navegación para funcionar mediante URLs directas.
7. Verificar la estrategia de fallback SPA de Vercel. Modificar la configuración solo si es necesario y documentar el cambio antes de aplicarlo.

**Criterios de salida**

- Las rutas responden dentro de la app.
- Los enlaces no producen recargas completas innecesarias.
- Las URLs directas funcionan en el entorno de desarrollo.
- La configuración de despliegue queda revisada y el plan de prueba para Preview Deployment está definido.

### Fase 2 — Separación del Editor MP3

**Tareas**

1. Extraer la experiencia de edición a `/editor`.
2. Reutilizar el motor y los componentes de negocio actuales.
3. Organizar el flujo de selección, búsqueda, revisión, edición y descarga.
4. Separar la vista técnica/binaria en un área avanzada si mejora la claridad y conserva la funcionalidad.
5. Definir estados de carga, éxito, ausencia de coincidencias y error.
6. Probar el ciclo real de lectura y escritura con archivos de prueba apropiados.

**Criterios de salida**

- Un usuario puede seleccionar un MP3, completar/revisar metadatos y descargar el archivo procesado.
- La descarga contiene los cambios esperados.
- No hay regresiones conocidas frente al comportamiento de línea base.

### Fase 3 — Separación del Buscador musical

**Tareas**

1. Extraer el buscador a `/search`.
2. Mantener los modos actuales para canciones, artistas y álbumes.
3. Reutilizar las integraciones de los proveedores existentes.
4. Normalizar solo los datos necesarios para presentar resultados coherentes.
5. Implementar estados de carga, error y resultados vacíos.
6. Validar el reproductor de previews y el caso de canciones sin preview.
7. Añadir la acción para enviar metadatos seleccionados al editor, si la implementación actual dispone de los datos necesarios.

**Criterios de salida**

- Los tipos de búsqueda actuales funcionan desde la nueva ruta.
- Los errores o la ausencia de preview no bloquean la navegación.
- El flujo hacia el editor funciona sin guardar cambios automáticamente.

### Fase 4 — Home

**Tareas**

1. Crear una página de presentación separada de las herramientas.
2. Añadir hero, llamadas a la acción y secciones cortas de valor.
3. Utilizar activos existentes o recursos aprobados; implementar alternativa estática para vídeo.
4. Eliminar duplicaciones de herramientas completas del Home, conservando demostraciones pequeñas útiles.
5. Revisar textos para que describan únicamente capacidades comprobadas.

**Criterios de salida**

- El Home comunica qué es MetaPulse y cómo acceder al Editor y Buscador.
- El contenido es legible y no intenta alojar la interfaz funcional completa.

### Fase 5 — About

**Tareas**

1. Crear la página informativa.
2. Explicar el producto y sus funciones comprobadas.
3. Incorporar información técnica precisa y preguntas frecuentes.
4. Evitar afirmaciones no verificadas sobre privacidad, compatibilidad o proveedores.
5. Enlazar las herramientas desde la página.

**Criterios de salida**

- About está completo, comparte el layout y no presenta afirmaciones técnicas sin respaldo.

### Fase 6 — Sistema visual y motion

**Tareas**

1. Unificar tokens de diseño y componentes visuales.
2. Refinar tipografía, jerarquía, espaciado, superficies y estados.
3. Implementar el hero multimedia y sus alternativas.
4. Añadir transiciones y microinteracciones moderadas.
5. Adaptar todas las páginas a móvil, tablet y escritorio.
6. Implementar movimiento reducido y estados focus accesibles.

**Criterios de salida**

- Las cuatro páginas tienen una identidad coherente.
- No hay scroll horizontal inesperado ni controles inaccesibles en tamaños habituales.
- Las animaciones no bloquean las tareas y se pueden reducir.

### Fase 7 — QA, preview y preparación de lanzamiento

**Tareas**

1. Ejecutar lint, tests y build disponibles.
2. Probar rutas directas y navegación interna.
3. Probar un ciclo completo del Editor MP3 con archivos de prueba.
4. Probar búsqueda de canciones, artistas y álbumes.
5. Probar una canción con preview y otra sin preview, si es posible con los datos disponibles.
6. Probar el flujo buscador → editor.
7. Probar responsive, teclado, focus visible, modo de movimiento reducido y errores de red.
8. Revisar consola y solicitudes fallidas.
9. Comprobar el Preview Deployment de Vercel si está disponible.
10. Entregar un resumen de cambios y riesgos restantes.

**Criterios de salida**

- La compilación final funciona.
- No hay regresiones críticas conocidas.
- Las rutas directas están comprobadas en el entorno de preview.
- El despliegue de producción no se modifica sin autorización del propietario.

---

## 14. Protección de GitHub y Vercel

La URL de producción informada es `https://metapulse.falconit.xyz/`. Trátala como una aplicación real en uso.

- No cambies el dominio ni su configuración DNS.
- No alteres el proyecto de Vercel, sus variables o sus reglas de dominio salvo que sea indispensable, esté justificado y el propietario lo autorice.
- Antes de comenzar, inspecciona rama activa y estado de Git. No descartes cambios preexistentes del usuario.
- Trabaja en una rama de desarrollo cuando sea posible.
- No hagas force-push ni elimines ramas.
- No mezcles cambios no relacionados en un mismo paso.
- Comprueba si Vercel realiza despliegues automáticos desde una rama concreta.
- Prefiere un Preview Deployment antes de producción.
- Si añadir una regla de rewrite fuese necesario para las rutas SPA, revisa primero la configuración de Vercel actual y crea solo el cambio mínimo compatible.
- No publiques a producción ni fusiones con la rama de producción sin autorización expresa.
- Si el entorno de Google AI Studio no permite ramas, previews o controles suficientes, detén cualquier acción que pudiera desplegar cambios a producción y explica la limitación para acordar un procedimiento seguro.

---

## 15. Estrategia de pruebas y aceptación

### Pruebas de navegación

- Home abre en `/`.
- About abre en `/about`.
- Editor abre en `/editor`.
- Buscador abre en `/search`.
- Las rutas funcionan al pegarlas directamente en el navegador y al actualizar la página, tanto en desarrollo como en preview.
- La ruta desconocida muestra una página 404 útil.
- Los enlaces y botones del sitio llevan al destino correcto.

### Pruebas del Editor

- Se puede seleccionar un MP3 válido.
- Se rechaza o informa con claridad un tipo de archivo no admitido.
- Los campos actuales pueden mostrarse y editarse.
- Se puede elegir una coincidencia de metadatos si la función existe.
- Se puede descargar el archivo procesado.
- Una verificación posterior confirma que las etiquetas esperadas están en la descarga cuando las herramientas actuales lo permitan.
- El sistema maneja errores y cancelaciones sin dejar la pantalla bloqueada.

### Pruebas del Buscador

- Buscar una canción devuelve los resultados permitidos por la API.
- Los modos de artistas y álbumes conservan su comportamiento actual.
- La interfaz distingue carga, error y búsqueda sin resultados.
- Se pueden consultar los detalles admitidos por la fuente.
- La ausencia de preview no rompe la tarjeta ni el reproductor.
- Una respuesta lenta de una consulta anterior no reemplaza silenciosamente los resultados de una consulta más nueva.
- El traspaso de datos al Editor no guarda etiquetas automáticamente.

### Pruebas visuales y técnicas

- Escritorio, tablet y móvil.
- Navegación por teclado y focus visible.
- Contraste suficiente y movimiento reducido.
- Imágenes y vídeo no impiden ver el contenido esencial durante la carga.
- Consola sin errores nuevos relevantes.
- Sin secretos expuestos en el bundle del cliente.
- Build de producción exitoso y pruebas disponibles ejecutadas.

### Definición de terminado

El proyecto solo se considera terminado cuando:

1. Las cuatro páginas están separadas y accesibles.
2. Editor y Buscador conservan las funciones existentes.
3. El flujo entre resultados de búsqueda y edición funciona cuando se han encontrado datos compatibles.
4. El sistema visual está unificado, es responsive y respeta las preferencias de movimiento.
5. Las comprobaciones de build y las pruebas acordadas están completas.
6. El agente ha informado de limitaciones, deuda técnica y cambios pendientes.
7. El propietario puede revisar el preview antes de aprobar el despliegue de producción.

---

## 16. Forma de trabajo e informes por fase

Al terminar cada fase, presenta un informe con esta estructura:

```text
FASE COMPLETADA:

1. Objetivo y resultado:
2. Archivos creados o modificados:
3. Funcionalidades preservadas:
4. Pruebas ejecutadas y resultado:
5. Errores o regresiones encontrados:
6. Riesgos o limitaciones pendientes:
7. Próxima fase propuesta:
8. Estado de GitHub/Vercel (sin modificar producción sin permiso):
```

No afirmes que una prueba pasó si no se ejecutó. Si no hay un script de test, informa que no existe y utiliza las verificaciones disponibles. Si una tarea depende de credenciales, permisos de API o recursos que no están disponibles, deja la integración funcional existente intacta y explica qué falta.

---

## 17. Primera tarea que debes ejecutar ahora

**Empieza exclusivamente por la Fase 0 — Auditoría y línea base.**

No realices todavía el rediseño completo ni cambies el flujo principal. Primero entrega:

1. El mapa de la arquitectura actual del repositorio.
2. La ubicación del código de edición de metadatos y de búsqueda musical.
3. Las dependencias y scripts reales, indicando si React Router DOM ya está presente.
4. La descripción del flujo de datos entre búsqueda, proveedor, reproducción de preview y editor.
5. Los resultados reales de las comprobaciones de build, lint y tests disponibles.
6. Los puntos de riesgo para producción y la estrategia de rama/preview posible en este entorno.
7. Un plan de cambios ajustado a los archivos reales que se van a modificar en la Fase 1.

Después de presentar el informe, procede de forma incremental siguiendo las fases y criterios de este documento, siempre que el entorno permita trabajar de forma segura. No hagas un despliegue de producción sin autorización expresa.

**Resultado final esperado:** una MetaPulse con Home, About, Editor MP3 y Buscador musical independientes, una identidad visual moderna y consistente, efectos visuales optimizados y las funciones actuales preservadas, probadas y listas para revisión antes del lanzamiento.
