# Guía de Actividades Práctico-Experimentales Nro. 016

## Datos Generales
**Integrantes:**
- David Alexander Guaman Calva
- Miguel Angel Luna Yunga

**Asignatura:** Teoría de Autómatas y Computabilidad Avanzada
**Ciclo:** 6to
**Unidad:** Tres
**Práctica Nro:** 16
**Título de la Práctica:** Análisis Léxico, Sintáctico y Clasificación Semántica de Oraciones Compuestas utilizando Stanford CoreNLP
**Nombre del Docente:** José O. Guamán Q.
**Fecha:** Jueves 23 de julio de 2026 / Viernes 24 de julio de 2026
**Tiempo planificado en el Sílabo:** 4 horas

---

## Objetivo(s) de la Práctica
Implementar un analizador lingüístico utilizando Stanford CoreNLP para identificar la estructura léxica, sintáctica y las relaciones semánticas presentes en oraciones compuestas del idioma español.

## Objetivos Específicos
- Configurar Stanford CoreNLP para el procesamiento de texto en español.
- Analizar árboles sintácticos y dependencias generadas por CoreNLP.
- Clasificar automáticamente oraciones compuestas según sus conectores y relaciones semánticas.

## Materiales y reactivos
- PC con acceso a Internet.
- Documentación del estándar de tokens definida para el problema elegido.
- Diapositivas semana 15 y 16.

## Equipos y herramientas
- **Software:** Python 3.10+, Java (JDK), Stanford CoreNLP (Servidor Java), VS Code, librerías `flask`, `spacy`, `requests`, Node.js, React (Vite).
- **Hardware:** Procesador multinúcleo, 8 GB RAM.

---

## Procedimiento / Metodología (Enfoque Práctico Realizado)

Para llevar a cabo esta práctica y permitir la comparación solicitada, se adoptó un enfoque que integra ambas herramientas de Procesamiento de Lenguaje Natural: por un lado, **spaCy** (utilizada como librería nativa importada directamente en nuestro backend de Python) y por otro lado **Stanford CoreNLP** (para la cual se descargó y ejecutó su servidor oficial en Java, comunicándonos con él mediante peticiones HTTP desde el backend). 

Se desarrolló una arquitectura web (Cliente-Servidor) en lugar de una ejecución exclusiva en consola. Las actividades desarrolladas fueron las siguientes:

### Actividad 1: Desarrollo del API Backend (Procesamiento NLP multilib)
1. **Configuración del Entorno:** Se instaló Java y se descargó el servidor oficial de Stanford CoreNLP junto con sus modelos en español (`es`), dejándolo en ejecución en un puerto local de la máquina. Por la parte de Python, se creó un entorno virtual instalando dependencias como `flask`, `spacy` y `requests`.
2. **Descarga de Modelos Python:** Se descargaron los modelos preentrenados en español para la librería spaCy (`es_core_news_sm`).
3. **Desarrollo del Servicio NLP:** Se implementó una lógica en el backend (`NLPService`) que toma un texto y lo procesa utilizando ambas herramientas en paralelo: envía peticiones HTTP al servidor local de Stanford CoreNLP por un lado, y ejecuta el pipeline de la librería spaCy por el otro. De ambas formas se extraen: tokens, lemas, etiquetas POS (Parts of Speech), dependencias gramaticales y árboles sintácticos.
4. **Clasificación Semántica:** Se incorporó un sistema de reglas lógicas en Python (basado en listas de conectores coordinados y subordinados) para identificar el tipo de oración compuesta y su relación semántica (ej. Causal, Copulativa, Condicional).
5. **Creación de Endpoints:** Se expuso una ruta en Flask (`/api/nlp`) que recibe las oraciones en formato JSON y devuelve los resultados analizados.

### Actividad 2: Desarrollo del Frontend (Interfaz de Usuario)
1. **Inicialización:** Se creó un proyecto en React utilizando Vite para asegurar un empaquetado rápido y eficiente.
2. **Diseño de UI:** Se diseñó una interfaz interactiva donde el usuario puede ingresar oraciones (tanto las de prueba de la guía como nuevas).
3. **Integración con el API:** Se utilizó `fetch` para enviar el texto al backend y recibir la respuesta JSON.
4. **Visualización de Datos:** Se crearon componentes para renderizar:
   - Tablas detalladas para el Análisis Léxico (Token, Lema, POS).
   - Estructuras visuales para el Árbol Sintáctico y las Dependencias.
   - Un panel informativo con los resultados de la Clasificación Semántica (identificación del conector, tipo y subtipo).

### Actividad 3: Pruebas y Validación (Actividades 2, 3, 4 y 5 de la guía)
Se ingresaron las oraciones estipuladas en la guía a través del Frontend, verificando:
- **Oraciones compuestas:** (Ej. "María estudia porque mañana tiene un examen", "Pedro llegó y Ana salió"). Se validó la correcta extracción del conector y su clasificación.
- **Oraciones simples:** (Ej. "Pedro compró un automóvil"). Se verificó la correcta identificación del **sujeto** (Pedro), **verbo principal** (compró) y **objeto directo** (automóvil).

---

## Resultados Esperados y Visualización

A continuación, se describen las imágenes que deben ser adjuntadas como evidencia del funcionamiento del sistema web:

**1. Análisis Léxico**
* **[Imagen: analisis_lexico.png]** 
* **Descripción:** Captura de pantalla de la tabla en el frontend mostrando el desglose de cada oración. Se visualiza cada token alineado con su lema y su etiqueta POS (Part of Speech), generada por el modelo de Stanford CoreNLP.

**2. Árbol Sintáctico**
* **[Imagen: arbol_sintactico.png]** 
* **Descripción:** Captura de la visualización del árbol sintáctico en la interfaz. Muestra cómo las palabras se agrupan jerárquicamente a partir de la raíz de la oración, reflejando la estructura profunda del lenguaje detectada por Stanza.

**3. Dependencias**
* **[Imagen: dependencias.png]** 
* **Descripción:** Captura de la sección de relaciones gramaticales. Se evidencia la identificación automática de roles clave como el sujeto de la oración (`nsubj`), el verbo principal (`root`), y el objeto directo (`obj`).

**4. Clasificación semántica de las oraciones**
* **[Imagen: clasificacion_semantica.png]** 
* **Descripción:** Captura del panel de resultados de la clasificación. Se muestra una oración compuesta ingresada (ej. "Pedro llegó y Ana salió") junto al dictamen automático del sistema: Conector identificado (`y`), Tipo (`Compuesta Coordinada`) y Relación (`Copulativa`).

---

## Actividad 6: Comparación entre spaCy y Stanford CoreNLP

| Aspecto | spaCy | Stanford CoreNLP (Stanza) |
| :--- | :--- | :--- |
| **Tiempo de ejecución** | **Rápido.** Diseñado para entornos de producción y optimizado con Cython. | **Lento.** Los modelos neuronales son pesados y tardan más en inicializar e inferir. |
| **Precisión POS** | Alta, muy eficiente en tareas generales. | **Muy Alta.** Sobresale en estructuras complejas y análisis lingüístico profundo. |
| **Árbol sintáctico** | Básico, centrado principalmente en dependencias (Dependency Parsing). | **Muy Detallado.** Soporta tanto dependencias como árboles de constituyentes (Constituency Parsing). |
| **Dependencias** | Claras, usa el estándar Universal Dependencies, excelente para extracción de entidades. | Jerárquicas y muy específicas, ideal para estudios académicos y lingüísticos. |
| **Facilidad de uso** | **Muy fácil.** Python nativo, API intuitiva e instalación sencilla de modelos. | **Moderada.** Su versión original requiere Java. Con `stanza` es más fácil en Python, pero los modelos ocupan mucho espacio. |
| **Consumo de memoria** | **Bajo - Moderado.** Mantiene una huella en RAM manejable. | **Alto.** Requiere considerable memoria RAM y procesador para cargar y utilizar sus redes neuronales. |

---

## Preguntas de Control

**1. ¿Qué diferencias encontró entre spaCy y Stanford CoreNLP?**
La principal diferencia radica en su enfoque: spaCy está construido pensando en la velocidad y la integración en entornos de producción (software comercial), priorizando la eficiencia computacional. Stanford CoreNLP (y su wrapper Stanza) tiene un enfoque más académico y de investigación, ofreciendo una mayor precisión y un análisis lingüístico mucho más profundo (como resolución de correferencias y árboles de constituyentes completos), pero a costa de consumir más recursos y tiempo de procesamiento.

**2. ¿Cuál herramienta genera árboles sintácticos más detallados?**
Stanford CoreNLP genera árboles sintácticos mucho más detallados. Mientras que spaCy se enfoca en el análisis de dependencias (relaciones entre palabras), Stanford es capaz de generar árboles de constituyentes complejos que muestran la estructura jerárquica completa de las frases (sintagmas nominales, sintagmas verbales, etc.) tal como se estipula en la teoría lingüística formal.

**3. ¿Qué ventajas ofrece Stanford CoreNLP para el análisis lingüístico?**
Ofrece una suite de anotadores sumamente robusta basada en redes neuronales entrenadas con inmensos corpus (Treebanks). Sus ventajas incluyen una precisión superior en el etiquetado morfosintáctico (POS) en oraciones ambiguas, un soporte exhaustivo de idiomas (a través de Stanza) y acceso a herramientas avanzadas que no están en todos los frameworks, como el análisis de sentimientos detallado, relaciones temporales y resolución de correferencias complejas.

**4. ¿Qué limitaciones presenta el enfoque basado en reglas para el análisis semántico?**
El enfoque basado en reglas (if-else con listas de conectores) es rígido y no escala bien. Sus limitaciones incluyen:
*   **Falta de contexto:** No entiende la semántica real; si una palabra actúa como conector en un contexto pero como sustantivo en otro, la regla fallará.
*   **Mantenimiento:** El lenguaje natural es vasto e irregular. Cubrir todas las excepciones, modismos o variaciones gramaticales requiere un código interminablemente largo y difícil de mantener.
*   **Errores con oraciones anidadas:** Falla al analizar oraciones subordinadas complejas o múltiples conectores en la misma frase, ya que las reglas estáticas no pueden manejar estructuras dinámicas de forma eficiente.

**5. ¿Qué mejoras implementaría para aumentar la precisión del clasificador?**
Para mejorar la precisión, se debería abandonar el enfoque netamente basado en reglas y adoptar un enfoque de Machine Learning o Híbrido:
*   **Modelos Clasificadores:** Entrenar un modelo (como SVM o redes neuronales recurrentes) proporcionándole un corpus de oraciones previamente etiquetadas para que aprenda a inferir la clasificación por contexto.
*   **Modelos de Lenguaje (LLMs):** Hacer fine-tuning a modelos pre-entrenados como BERT (o variantes en español como BETO) para la tarea específica de clasificación de relaciones discursivas.
*   **Uso del Árbol de Dependencias:** Mejorar las reglas actuales integrándolas con el árbol de dependencias generado por CoreNLP, asegurándose de que la palabra identificada como "conector" actúe efectivamente como el nodo raíz que une dos oraciones (ej. comprobando la etiqueta `mark` o `cc`), y no mediante una simple búsqueda de texto.

---

## Declaratoria de Uso de Inteligencia Artificial
Durante el desarrollo de esta práctica, se hizo uso de asistentes de Inteligencia Artificial como apoyo para las siguientes tareas:
- Generación y estructuración de la documentación técnica y metodológica del proyecto en base a los lineamientos de la guía de la asignatura.
- Apoyo en la depuración de código y resolución de errores de integración entre el backend de Flask y el frontend de React.
- Asesoramiento en la comparación técnica entre las herramientas spaCy y Stanford CoreNLP, facilitando la comprensión de sus modelos subyacentes, ventajas y desventajas.

---

## Bibliografía
- Materia semana 15. Guaman, Jose. 2026.
- Qi, P., Zhang, Y., Zhang, Y., Bolton, J., & Manning, C. D. (2020). Stanza: A Python Natural Language Processing Toolkit for Many Human Languages.
- Documentación oficial de Flask y React/Vite.
