# Web de documentación de Pepperoni

Sitio estático construido con [Hugo](https://gohugo.io/). No depende de ningún tema externo: el tema vive en `layouts/` y `assets/`.

## Desarrollo local

Requiere Hugo (versión estándar, no hace falta la *extended*; recomendado ≥ 0.128).

```
hugo server
```

## Compilar

```
hugo --minify
```

El resultado queda en `public/`.

## Estructura

| Ruta | Contenido |
| - | - |
| `content/_index.md` | Portada |
| `content/docs/` | Documentación. El orden del menú lateral sale de `weight` en el front matter |
| `content/docs/<tema>/index.md` | Páginas con imágenes propias (carpeta `assets/` junto al `index.md`) |
| `content/galeria.md` | Galería de vídeos |
| `layouts/shortcodes/` | `admonition`, `tabs`/`tab` y `yt` |
| `assets/css/main.css` | Estilos (modo claro/oscuro incluido) |
| `static/` | Archivos servidos tal cual (`img/`, favicon…) |

## Shortcodes

Aviso (equivale a `:::tip` de Docusaurus). Tipos: `note`, `tip`, `info`, `caution`, `danger`.

```
{{< admonition type="danger" title="Peligro" >}}
Texto en **markdown**.
{{< /admonition >}}
```

Pestañas (equivale a `<Tabs>` / `<TabItem>`):

```
{{< tabs >}}
{{< tab label="Paso 1" default="true" >}}
Texto y ![imagen](assets/foto.jpg)
{{< /tab >}}
{{< tab label="Paso 2" >}}
Otro texto
{{< /tab >}}
{{< /tabs >}}
```

Vídeo de YouTube:

```
{{< yt "ID_DEL_VIDEO" "Título accesible" >}}
```
