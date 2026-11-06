# Web de documentación de Pepperoni

Sitio estático construido con [Hugo](https://gohugo.io/).

## Desarrollo local

### Solo web

Requiere Hugo y Go.

```
hugo server
```

### Web y tema

Requiere Hugo y Go.

```
HUGO_MODULE_REPLACEMENTS="github.com/kikeelectronico/hugo-docs-theme -> ../../hugo-docs-theme" hugo server
```
### Actualizar versión del tema

hugo mod get github.com/kikeelectronico/hugo-docs-theme@v0.2.0

## Buildear

```
hugo --minify
```

El resultado se genera en `public/`.

## Shortcodes

### Aviso

Tipos: `note`, `tip`, `info`, `caution`, `danger`.

```
{{< admonition type="danger" title="Peligro" >}}
Texto en **markdown**.
{{< /admonition >}}
```

### Pestañas

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

### Vídeo de YouTube

```
{{< yt "ID_DEL_VIDEO" "Título accesible" >}}
```
