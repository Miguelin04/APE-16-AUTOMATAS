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

## Procedimiento / Metodología

Para el desarrollo de la práctica se implementó una arquitectura web (Cliente-Servidor) con un backend en Python (Flask) y un frontend en React (Vite). A continuación se detallan las actividades realizadas de acuerdo con la guía:

### Actividad 1: Instalar Stanford CoreNLP y configurarlo para español
Se instaló Java y se descargó el servidor oficial de Stanford CoreNLP junto con sus modelos en español (`es`). El servidor se ejecutó localmente para recibir peticiones HTTP desde el backend. Adicionalmente, se configuró un entorno virtual en Python con las librerías necesarias (`flask`, `spacy`, `requests`) y se implementó un servicio para procesar texto utilizando tanto Stanford CoreNLP como spaCy.

### Actividad 2: Analizar oraciones
Se implementó una interfaz en el frontend para ingresar oraciones y enviarlas al backend. Se analizaron las siguientes oraciones compuestas:
- María estudia porque mañana tiene un examen.
- Pedro llegó y Ana salió.
- Aunque llueve iremos al parque.
- Si estudias aprobarás.
- Juan cocina mientras Ana limpia.

El sistema fue capaz de extraer y visualizar en pantalla para cada oración el **Token**, **POS** (Part of Speech), las **Dependencias** y el **Árbol sintáctico** generados.

### Actividad 3: Analizar oraciones simples
Se ingresaron y procesaron las siguientes oraciones simples en el aplicativo:
- Pedro compró un automóvil.
- Ana cocina la cena.
- Luis juega fútbol.

Mediante el análisis de dependencias de Stanford CoreNLP, se pudo identificar automáticamente y responder los elementos clave en cada caso:
- **¿Quién es el sujeto?:** (ej. Pedro, Ana, Luis) identificado mediante la dependencia `nsubj`.
- **¿Cuál es el verbo principal?:** (ej. compró, cocina, juega) identificado como la raíz `root`.
- **¿Cuál es el objeto directo?:** (ej. automóvil, cena, fútbol) identificado mediante la dependencia `obj`.

### Actividad 4: Implementar reglas para identificar conectores
En el backend se implementó un conjunto de reglas en Python para identificar conectores de acuerdo con la siguiente tabla:
- **Coordinadas:** y, e, ni (Copulativas); o, u (Disyuntivas); pero, sin embargo (Adversativas).
- **Subordinadas:** porque, ya que, puesto que (Causales); si (Condicional); aunque (Concesiva); mientras, cuando (Temporales); para que (Final); por lo tanto (Consecutiva).

### Actividad 5: Clasificar automáticamente las oraciones
A partir de las reglas implementadas, el sistema clasificó automáticamente las oraciones analizadas de acuerdo al conector detectado.
Por ejemplo, al procesar "Pedro llegó y Ana salió.", el resultado generado por el sistema fue:
- **Tipo:** Compuesta Coordinada
- **Relación:** Copulativa

---

## Resultados Esperados y Visualización

A continuación, se describen las imágenes que deben ser adjuntadas como evidencia del funcionamiento del sistema web:

**1. Análisis Léxico**
* **[Imagen: analisis_lexico.png]** 
* **Descripción:** Captura de pantalla de la tabla en el frontend mostrando el desglose de cada oración. Se visualiza cada token alineado con su lema y su etiqueta POS (Part of Speech), generada por el modelo de Stanford CoreNLP.

**2. Árbol Sintáctico**
* **[Imagen: arbol_sintactico.png]** 
* **Descripción:** Captura de la visualización del árbol sintáctico en la interfaz. Muestra cómo las palabras se agrupan jerárquicamente a partir de la raíz de la oración, reflejando la estructura profunda del lenguaje detectada por Stanford CoreNLP.

**3. Dependencias**
* **[Imagen: dependencias.png]** 
* **Descripción:** Captura de la sección de relaciones gramaticales. Se evidencia la identificación automática de roles clave como el sujeto de la oración (`nsubj`), el verbo principal (`root`), y el objeto directo (`obj`).

**4. Clasificación semántica de las oraciones**
* **[Imagen: clasificacion_semantica.png]** 
* **Descripción:** Captura del panel de resultados de la clasificación. Se muestra una oración compuesta ingresada (ej. "Pedro llegó y Ana salió") junto al dictamen automático del sistema: Conector identificado (`y`), Tipo (`Compuesta Coordinada`) y Relación (`Copulativa`).

---

## Actividad 6: Comparación entre spaCy y Stanford CoreNLP

| Aspecto | spaCy | Stanford CoreNLP (Servidor Java) |
| :--- | :--- | :--- |
| **Tiempo de ejecución** | **Rápido.** Diseñado para entornos de producción y optimizado con Cython. | **Lento.** Requiere llamadas HTTP y procesamiento en un servidor externo (Java), lo que añade latencia en comparación con una librería nativa. |
| **Precisión POS** | Alta, muy eficiente en tareas generales. | **Muy Alta.** Sobresale en estructuras complejas y análisis lingüístico profundo. |
| **Árbol sintáctico** | Básico, centrado principalmente en dependencias (Dependency Parsing). | **Muy Detallado.** Soporta tanto dependencias como árboles de constituyentes (Constituency Parsing). |
| **Dependencias** | Claras, usa el estándar Universal Dependencies, excelente para extracción de entidades. | Jerárquicas y muy específicas, ideal para estudios académicos y lingüísticos. |
| **Facilidad de uso** | **Muy fácil.** Python nativo, API intuitiva e instalación sencilla de modelos. | **Moderada.** Requiere descargar, configurar y ejecutar un servidor Java independiente, además de establecer comunicación HTTP desde el backend, lo cual es más complejo que importar una librería. |
| **Consumo de memoria** | **Bajo - Moderado.** Mantiene una huella en RAM manejable. | **Alto.** Requiere considerable memoria RAM y procesador para cargar y utilizar sus redes neuronales en el servidor. |

---

## Preguntas de Control

**1. ¿Qué diferencias encontró entre spaCy y Stanford CoreNLP?**
La principal diferencia radica en su enfoque: spaCy está construido pensando en la velocidad y la integración en entornos de producción (software comercial), priorizando la eficiencia computacional. Stanford CoreNLP (ejecutado mediante su servidor Java) tiene un enfoque más académico y de investigación, ofreciendo una mayor precisión y un análisis lingüístico mucho más profundo (como resolución de correferencias y árboles de constituyentes completos), pero a costa de consumir más recursos y tiempo de procesamiento.

**2. ¿Cuál herramienta genera árboles sintácticos más detallados?**
Stanford CoreNLP genera árboles sintácticos mucho más detallados. Mientras que spaCy se enfoca en el análisis de dependencias (relaciones entre palabras), Stanford es capaz de generar árboles de constituyentes complejos que muestran la estructura jerárquica completa de las frases (sintagmas nominales, sintagmas verbales, etc.) tal como se estipula en la teoría lingüística formal.

**3. ¿Qué ventajas ofrece Stanford CoreNLP para el análisis lingüístico?**
Ofrece una suite de anotadores sumamente robusta basada en redes neuronales entrenadas con inmensos corpus (Treebanks). Sus ventajas incluyen una precisión superior en el etiquetado morfosintáctico (POS) en oraciones ambiguas, un soporte exhaustivo de múltiples idiomas y acceso a herramientas avanzadas que no están en todos los frameworks, como el análisis de sentimientos detallado, relaciones temporales y resolución de correferencias complejas.

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
[1] C. D. Manning, M. Surdeanu, J. Bauer, J. R. Finkel, S. Bethard, y D. McClosky, "The Stanford CoreNLP Natural Language Processing Toolkit," en Proceedings of 52nd Annual Meeting of the Association for Computational Linguistics: System Demonstrations, Baltimore, MD, USA, 2014, pp. 55–60.
[2] M. Honnibal y M. Johnson, "An Improved Non-monotonic Transition System for Dependency Parsing," en Proceedings of the 2015 Conference on Empirical Methods in Natural Language Processing, Lisbon, Portugal, 2015, pp. 1373–1378.
[3] M. Honnibal, I. Montani, S. Van Landeghem, y A. Boyd, "spaCy: Industrial-strength Natural Language Processing in Python," Zenodo, 2020, doi: 10.5281/zenodo.1212303.
[4] Materia semana 15. Guaman, Jose. 2026.
[5] Documentación oficial de Flask y React/Vite.
