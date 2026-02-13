# Instituto Tecnológico de Pachuca
## Ingeniería en Tecnologías de la Información y Comunicaciones
### Interacción Humano-Computadora
### Práctica: **1.3 Reconocimiento de voz**
### Autor: **Ortega Olvera Juan Fernando**
### Fecha: **12 de febrero de 2026**

---

## 🧠 Descripción

Esta aplicación web implementa un sistema de **reconocimiento de voz en tiempo real** utilizando la **Web Speech API del navegador** y las **APIs de OpenAI** para interpretar órdenes habladas.

El sistema funciona mediante una **wake word** (palabra clave) similar a asistentes virtuales como Alexa o Google Assistant.  
Cuando la aplicación entra en estado suspendido, el usuario debe decir:

> **"Atenea"**

para activar el reconocimiento de órdenes.

Una vez activo, el sistema escucha instrucciones por voz y devuelve **únicamente** una de las siguientes órdenes válidas:

- avanzar
- retroceder
- detener
- vuelta derecha
- vuelta izquierda
- 90° derecha
- 90° izquierda
- 360° derecha
- 360° izquierda

Si la frase no coincide con ninguna orden válida, el sistema responde:

> **Orden no reconocida**

---

## ⚙️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Web Speech API (Reconocimiento de voz del navegador)
- OpenAI API
- Async / Await / Fetch

---

## 🔄 Funcionamiento del sistema

La aplicación maneja dos estados:

| Estado | Descripción |
|---|---|
| 🔴 Suspendido | Espera la palabra clave "Atenea" |
| 🟢 Escuchando órdenes | Procesa las instrucciones habladas |

### Flujo de uso

1. La página inicia escuchando.
2. Si no detecta voz durante algunos segundos, se suspende.
3. El usuario dice **"Atenea"**.
4. El sistema cambia a modo escucha.
5. El usuario dice una orden.
6. La orden es interpretada por OpenAI y mostrada en pantalla.
7. Tras unos segundos sin hablar, vuelve a estado suspendido.