# Web de documentación de Pepperoni

Sitio estático construido con [Hugo](https://gohugo.io/).

## Desarrollo local

Requiere Hugo y Go.

```
hugo server
```

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
