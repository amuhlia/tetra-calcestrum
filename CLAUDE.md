# Tetra Calcestrum - Portal de Aplicaciones

## Descripción del Proyecto

Tetra Calcestrum es un portal web que agrupa múltiples aplicaciones independientes bajo una interfaz común. El proyecto está estructurado como un directorio principal que contiene varias sub-aplicaciones, accesibles desde el portal principal (`index.html`).

## Estructura del Proyecto

```
/tetra-calcestrum
├── index.html                 # Portal principal de acceso a las aplicaciones
├── favicon.ico                # Icono del sitio
├── apuesta/                   # Hipódromo Virtual
│   └── index.html             # Aplicación de carreras de caballos (migrada a anime.js)
├── casino/                    # Casino Lucky 7
│   └── index.html
├── inventario/                # Inventario Móvil
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
├── otra-app/                  # Juego Retro (Tetris 1990)
│   └── index.html
├── servicio/                  # Servicio a Domicilio
│   └── index.html
├── tienda/                    # Tienda Virtual (NovaMart)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js
│   ├── js/cart.js
│   ├── js/checkout.js
│   ├── js/products.js
│   └── sw.js                  # Service Worker para PWA
└── tetra-calcestrum.code-workspace # Espacio de trabajo de VS Code
```

## Tecnologías Utilizadas

- HTML5
- CSS3 (con variables CSS y gradients)
- JavaScript vanilla (sin frameworks)
- [anime.js](https://animejs.com/) - Para animaciones (implementado en apuesta/)
- Service Workers (en tienda/ para funcionalidad PWA)
- Diseño responsivo
- Audio Context API para efectos de sonido

## Características Principales

### Portal Principal (`index.html`)
- Interfaz moderna con gradientes y efectos visuales
- Tarjetas de aplicación con diseños neumorficos
- Sistema de contacto integrado con copia al portapap_copy al portapapeles
- Diseño responsivo para móvil y escritorio
- Botón de acceso a "Apps de Inteligencia Artificial" que redirecciona a https://adsapiensdoc.netlify.app/

### Hipódromo Virtual (`apuesta/`)
- Simulador de carreras de caballos con sistema de apuestas
- Animaciones mejoradas usando anime.js (versión migrada)
- **Sistema de imágenes de caballos dual**: 
  - Imagen estática (`caballo.png`) cuando no hay carrera en progreso
  - Sprite sheet animado (`caballo-sprite.png` con 8 frames) durante la carrera para movimiento realista de patas
  - Imagen de caballo en la línea de meta para mostrar las posiciones finales
- Sistema de wallet para gestionar fondos
- Apuestas a múltiples caballos con diferentes cuotas
- Posiciones en tiempo real y tabla de apuestas
- Efectos de sonido usando Web Audio API
- Resumen de carrera con podio y balance
- **Altura de la pista aumentada** para visualizar claramente los cinco carriles de caballos simultáneamente
- **Reinicio automático después de 5 segundos** al finalizar una carrera, conservando el saldo disponible para continuar jugando sin interrupciones

### Otras Aplicaciones
- **Tienda Virtual**: PWA completa con carrito, checkout y catálogo de productos
- **Servicio a Domicilio**: Interfaz para solicitar diversos servicios
- **Juego Retro**: Implementación de Tetris estilo 1990
- **Casino Lucky 7**: Máquina tragamonedas virtual
- **Inventario Móvil**: Sistema de captura de inventario con escaneo de códigos

## Mantenimiento y Desarrollo

### Principios de Diseño
- Consistencia visual entre todas las aplicaciones
- Uso de variables CSS para temas de color fácilmente modificables
- Diseño mobile-first con adaptabilidad a diferentes tamaños de pantalla
- Componentes reutilizables donde sea posible
- Comentarios claros en el código para facilitar el mantenimiento

### Directrices de Código
- Mantener el código JavaScript modular y bien organizado
- Usar funciones nombradas en lugar de funciones anónimas cuando sea posible
- Separar preocupaciones: estructura (HTML), presentación (CSS), lógica (JS)
- Evitar manipulación directa del DOM cuando sea posible (aunque el proyecto usa vanilla JS)
- Mantener los archivos de estilos y scripts organizeados por aplicación

### Animaciones (específico para apuesta/)
La aplicación de Hipódromo Virtual fue migrada para usar anime.js para las animaciones de las carreras:
- Cada caballo tiene su propia instancia de animación
- Las duraciones de animación se calculan basado en la velocidad del caballo
- Se agrega variación aleatoria (±20%) para hacer las carreras más impredecibles
- Las animaciones se limpian adecuadamente para prevenir fugas de memoria
- Se mantiene la renderización del canvas para el fondo de la pista y detalles visuales
- **Se implementó sistema de imágenes de caballos dual**:
  - Cuando no hay carrera: muestra imagen estática `caballo.png`
  - Durante la carrera: muestra sprite sheet animado `caballo-sprite.png` (8 frames horizontales) actualizado cada 100ms mediante el callback de update de anime.js
  - En la línea de meta: muestra imágenes de caballo para indicar las posiciones finales
- Este enfoque logra un efecto de galope fluido sin modificar la lógica subyacente de posicionamiento

## Cómo Contribuir

1. Familiarizarse con la estructura del proyecto
2. Entender la funcionalidad de cada sub-aplicación antes de hacer cambios
3. Mantener la consistencia en el estilo de código existente
4. Probar los cambios en todas las aplicaciones afectadas
5. Documentar cualquier nueva funcionalidad o cambio significativo

## Pruebas Locales

Para probar cualquiera de las aplicaciones localmente:

### Método 1: Servidor HTTP Simple
Desde la raíz del proyecto, puede usar cualquiera de estos comandos según lo que tenga disponible:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (si tiene http-server instalado)
npx http-server

# PHP (si tiene PHP instalado)
php -S localhost:8000
```

Luego abra su navegador en `http://localhost:8000` para acceder al portal principal.

### Método 2: Abrir archivos directamente
Algunas aplicaciones pueden funcionar abriendo directamente el archivo `index.html` en el navegador, pero tenga en cuenta que:
- Las aplicaciones que usan Service Workers (como la tienda) requerirán un servidor HTTP
- Las solicitudes AJAX/fetch pueden fallar debido a las políticas CORS del navegador
- Algunas características pueden no funcionar correctamente sin un servidor

### Pruebas Específicas por Aplicación

#### Portal Principal (`index.html`)
- Funciona bien abriendo directamente el archivo o a través de un servidor

#### Hipódromo Virtual (`apuesta/index.html`)
- Funciona tanto directamente como a través de servidor
- **Requiere conexión a internet** para cargar anime.js desde CDN (https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js)
- Todas las demás funcionalidades (sonidos, lógica de juego) son locales
- **Nota:** Para ver la animación de sprite sheet de los caballos, asegúrese de que el archivo `/apuesta/images/caballo-sprite.png` esté presente (8 frames horizontales, 512x512 cada uno).
- Para ver los caballos estáticos antes de iniciar una carrera, asegúrese de que `/apuesta/images/caballo.png` esté presente.

#### Tienda Virtual (`tienda/`)
- **Requiere un servidor HTTP** para funcionar correctamente debido al Service Worker
- También depende de archivos locales: manifest.json, íconos en /icons/, y múltiples archivos JS/CSS
- Pruebe la funcionalidad PWA (instalación, trabajo offline) sirviendo a través de localhost

#### Inventario Móvil (`inventario/`)
- Dependiente de la biblioteca ZXing-WASM en el directorio `vendor/zxing-wasm/`
- **Se recomienda usar un servidor HTTP** para evitar problemas de CORS al cargar recursos locales mediante fetch/XHR
- Puede funcionar abriendo directamente el archivo, pero algunas características relacionadas con el escaneo de códigos de barras podrían fallar

#### Otras Aplicaciones (`casino/`, `otra-app/`, `servicio/`)
- La mayoría funcionará abriendo directamente el archivo, pero se recomienda usar un servidor para probar todas las características y evitar posibles problemas con carga de recursos locales

### Consideraciones Importantes
1. **Recargar después de cambios**: Siempre recargue la página después de modificar archivos HTML/CSS/JS
2. **Consola de desarrollador**: Use la consola del navegador (F12) para verificar errores de JavaScript
3. **Cache de Service Worker**: Si está probando la tienda, puede que necesite desregistrar o actualizar los service workers al hacer cambios
4. **Diseño responsivo**: Pruebe en diferentes tamaños de pantalla o use las herramientas de diseño responsivo del navegador
5. **Depuración de animación de caballos**: 
   - Si no ve los sprites durante la carrera, revise la consola para mensajes de carga de imagen y asegúrese de que `horseFrameWidth` sea mayor que cero.
   - Si no ve los caballos estáticos antes de la carrera, verifique que `caballo.png` se cargue correctamente.
   - Si no ve los caballos en la línea de meta, verifique que la lógica de muestra de posición final funcione correctamente.

## Notas de Licencia y Créditos

Este proyecto fue desarrollado como una demostración de capacidades de desarrollo web full-stack utilizando tecnologías modernas pero accesibles.

---

*Documento actualizado para reflejar las últimas implementaciones (sistema de imágenes de caballos dual, altura de pista aumentada, corrección de índice de frame, ajustes recientes en hipodromo commit 85b61fb, adición de botón de Apps de Inteligencia Artificial y reinicio automático de carrera en hipodromo virtual).*