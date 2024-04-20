# Aprende DDD paso a paso, usando las cartas de "The DDD universe"

## El poder de los "Value objects"

## Punto de partida

### Recapitulación

<details>
  <summary><b>Click para expandir</b></summary>

Mostraremos a los asistentes una pequeña presentación hablando de los beneficios de DDD y su objetivo.

Acto seguido, les daremos acceso al repositorio y les explicamos los puntos clave.

- Es código plano
- Simula un framework
- Hay tests a nivel de controlador para asegurar que no rompemos nada

```
TODO: Link a presentación.
TODO: Repositorio con todos los lenguajes soportados
 - PHP
 - Kotlin
 - Typescript
```
</details>

### Nuevo requerimiento

Nos han comentado que los passwords que guardamos en base de datos tienen un cifrado reversible y por temas legales debemos actualizar nuestro desarrollo.

Como los anuncios tienen un cifrado, aunque sea débil, no podemos actualizarlos todos, con lo que como solución de compromiso haremos lo siguiente.

- Sabemos que cada mes se debe renovar el anuncio introduciendo el identificador y password.
- Aprovecharemos ese momento y cambiaremos el password obsoleto por el nuevo con un cifrado más robusto.
- Mirando cómo hacerlo con DDD, creemos que la mejor forma es encapsular la lógica en un "Value Object" para lidiar con esta casuística.

### Dinámica

- Presentamos el Value object y sus características
- Buscaremos un plan en el que el encargado de manejar la complejidad de los passwords sea un Value Object

### [Actividad en Canva](https://www.canva.com/design/DAF6VDIfdkE/jBve6kYf6zX9ly9tyEToNA/edit?utm_content=DAF6VDIfdkE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

![introduciendo-value-objects](introduciendo-value-objects.webp)

## Solución final

<details>
  <summary><b>Click para expandir</b></summary>

![introduciendo-value-objects-2](introduciendo-value-objects-2.webp)
</details>

### Fase 1: Aprendiendo a identificar un value object

El objetivo es identificar si el código que veremos es un Value object y si cumple las especificaciones de la carta que lo define.



### Fase 2: Dinámica con código

- Para empezar, damos por sentado que las capas son las del dibujo y su distribución. Les pediremos que imiten con sus cartas esa figura. Dejando sin colocar las cartas tapadas.
- Hablaremos de los requerimientos y el código.
- Miraremos cómo está en el proyecto inicial y en el distribuido en Arquitectura hexagonal.

```
TODO: Link al código y rama.
```

