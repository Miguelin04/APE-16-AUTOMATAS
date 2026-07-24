# Guía de Actividades Práctico-Experimentales Nro. 016

## Datos Generales

**Asignatura:** Teoría de Autómatas y Computabilidad Avanzada
**Integrantes:** 
- David Alexander Guaman Calva
- Miguel Angel Luna Yunga
- Stalin Joel Tapia Pinta
**Ciclo:** 6to
**Unidad:** Tres
**Resultado de aprendizaje de la unidad:** 
R5. Explica los aspectos más importantes del análisis léxico en el proceso de construcción de sistemas computacionales, bajo los principios de solidaridad, transparencia, responsabilidad y honestidad. 
R6. Argumenta los procedimientos para aplicar el análisis sintáctico en la construcción de sistemas computacionales, bajo los principios de solidaridad, transparencia, responsabilidad y honestidad. 
R7. Desarrolla programas que apliquen análisis semántico en la construcción de sistemas computacionales, bajo los principios de solidaridad, transparencia, responsabilidad y honestidad.
**Práctica Nro.:** 16
**Título de la Práctica:** Análisis Léxico, Sintáctico y Clasificación Semántica de Oraciones Compuestas utilizando Stanford CoreNLP
**Nombre del Docente:** José O. Guamán Q.
**Fecha:** 23 de julio de 2026 / 24 de julio de 2026
**Horario:** Jueves 09h30 – 11h30 Viernes 11h30 – 13h30
**Lugar:** Aula
**Tiempo planificado en el Sílabo:** 4 horas

---

## Objetivo(s) de la Práctica:
- Implementar un analizador lingüístico utilizando Stanford CoreNLP para identificar la estructura léxica, sintáctica y las relaciones semánticas presentes en oraciones compuestas del idioma español.
- Configurar Stanford CoreNLP para el procesamiento de texto en español.
- Analizar árboles sintácticos y dependencias generadas por CoreNLP.
- Clasificar automáticamente oraciones compuestas según sus conectores y relaciones semánticas.

## Materiales y reactivos:
- PC con acceso a Internet.
- Documentación del estándar de tokens definida para el problema elegido.
- Diapositivas semana 15 y 16.

**Recursos**
- **Hardware:** Procesador multinúcleo, 8 GB RAM.
- **Software:** Python 3.10+, Java (JDK), Stanford CoreNLP (Servidor Java), VS Code, librerías `flask`, `spacy`, `requests`, Node.js, React (Vite).

---

## Metodología/procedimiento:

Para el desarrollo de la práctica se implementó una arquitectura web (Cliente-Servidor) con un backend en Python (Flask) y un frontend en React (Vite). A continuación se detallan los pasos realizados:

**Paso 1. Instalar Stanford CoreNLP y configurarlo para español**
Se instaló Java y se descargó el servidor oficial de Stanford CoreNLP junto con sus modelos en español (`es`). El servidor se ejecutó localmente para recibir peticiones HTTP desde el backend. Adicionalmente, se configuró un entorno virtual en Python con las librerías necesarias (`flask`, `spacy`, `requests`) y se implementó un servicio para procesar texto utilizando tanto Stanford CoreNLP como spaCy.
*Referencia: Resultado 1. Análisis Léxico y Resultado 2. Árbol Sintáctico.*

**Paso 2. Analizar oraciones compuestas**
Se implementó una interfaz en el frontend para ingresar oraciones y enviarlas al backend. Se analizaron las oraciones compuestas sugeridas en la guía (ej. "María estudia porque mañana tiene un examen"). El sistema extrajo el Token, POS, Dependencias y Árbol sintáctico.
*Referencia: Resultado 3. Dependencias.*

**Paso 3. Analizar oraciones simples**
Se ingresaron y procesaron oraciones simples (ej. "Pedro compró un automóvil"). Mediante el análisis de dependencias de Stanford CoreNLP, se identificó automáticamente el sujeto (`nsubj`), el verbo principal (`root`), y el objeto directo (`obj`).

**Paso 4. Implementar reglas para identificar conectores**
En el backend se implementó un conjunto de reglas en Python para identificar conectores de acuerdo con sus categorías: coordinadas (y, o, pero) y subordinadas (porque, si, aunque).

**Paso 5. Clasificar automáticamente las oraciones**
A partir de las reglas implementadas, el sistema clasificó automáticamente las oraciones analizadas de acuerdo al conector detectado (ej. "Pedro llegó y Ana salió." -> Compuesta Coordinada, Relación Copulativa).
*Referencia: Resultado 4. Clasificación semántica de las oraciones.*

**Paso 6. Comparación entre spaCy y Stanford CoreNLP**
Se compararon los resultados obtenidos entre ambas herramientas documentando el tiempo de ejecución, precisión POS, detalle del árbol sintáctico, tipo de dependencias, facilidad de uso y consumo de memoria.
*Referencia: Resultado 5. Tabla comparativa.*

---

## Resultados esperados:

**Resultado 1. Análisis Léxico**
Captura de pantalla de la tabla en el frontend mostrando el desglose de cada oración. Se visualiza cada token alineado con su lema y su etiqueta POS (Part of Speech), generada por el modelo de Stanford CoreNLP.
*[Imagen: analisis_lexico.png]*

**Resultado 2. Árbol Sintáctico**
Captura de la visualización del árbol sintáctico en la interfaz. Muestra cómo las palabras se agrupan jerárquicamente a partir de la raíz de la oración, reflejando la estructura profunda del lenguaje detectada por Stanford CoreNLP.
*[Imagen: arbol_sintactico.png]*

**Resultado 3. Dependencias**
Captura de la sección de relaciones gramaticales. Se evidencia la identificación automática de roles clave como el sujeto de la oración (`nsubj`), el verbo principal (`root`), y el objeto directo (`obj`).
*[Imagen: dependencias.png]*

**Resultado 4. Clasificación semántica de las oraciones**
Captura del panel de resultados de la clasificación. Se muestra una oración compuesta ingresada (ej. "Pedro llegó y Ana salió") junto al dictamen automático del sistema: Conector identificado (`y`), Tipo (`Compuesta Coordinada`) y Relación (`Copulativa`).
*[Imagen: clasificacion_semantica.png]*

**Resultado 5. Tabla comparativa**

| Aspecto | spaCy | Stanford CoreNLP (Servidor Java) |
| :--- | :--- | :--- |
| **Tiempo de ejecución** | **Rápido.** Diseñado para entornos de producción y optimizado con Cython. | **Lento.** Requiere llamadas HTTP y procesamiento en un servidor externo (Java), lo que añade latencia en comparación con una librería nativa. |
| **Precisión POS** | Alta, muy eficiente en tareas generales. | **Muy Alta.** Sobresale en estructuras complejas y análisis lingüístico profundo. |
| **Árbol sintáctico** | Básico, centrado principalmente en dependencias (Dependency Parsing). | **Muy Detallado.** Soporta tanto dependencias como árboles de constituyentes (Constituency Parsing). |
| **Dependencias** | Claras, usa el estándar Universal Dependencies, excelente para extracción de entidades. | Jerárquicas y muy específicas, ideal para estudios académicos y lingüísticos. |
| **Facilidad de uso** | **Muy fácil.** Python nativo, API intuitiva e instalación sencilla de modelos. | **Moderada.** Requiere descargar, configurar y ejecutar un servidor Java independiente, además de establecer comunicación HTTP desde el backend, lo cual es más complejo que importar una librería. |
| **Consumo de memoria** | **Bajo - Moderado.** Mantiene una huella en RAM manejable. | **Alto.** Requiere considerable memoria RAM y procesador para cargar y utilizar sus redes neuronales en el servidor. |

---

## Preguntas de Control:

**1. ¿Qué diferencias encontró entre spaCy y Stanford CoreNLP?**
La principal diferencia radica en su enfoque: spaCy está construido pensando en la velocidad y la integración en entornos de producción (software comercial), priorizando la eficiencia computacional. Stanford CoreNLP (ejecutado mediante su servidor Java) tiene un enfoque más académico y de investigación, ofreciendo una mayor precisión y un análisis lingüístico mucho más profundo (como resolución de correferencias y árboles de constituyentes completos), pero a costa de consumir más recursos y tiempo de procesamiento.

**2. ¿Cuál herramienta genera árboles sintácticos más detallados?**
Stanford CoreNLP genera árboles sintácticos mucho más detallados. Mientras que spaCy se enfoca en el análisis de dependencias (relaciones entre palabras), Stanford es capaz de generar árboles de constituyentes complejos que muestran la estructura jerárquica completa de las frases (sintagmas nominales, sintagmas verbales, etc.) tal como se estipula en la teoría lingüística formal.

**3. ¿Qué ventajas ofrece Stanford CoreNLP para el análisis lingüístico?**
Ofrece una suite de anotadores sumamente robusta basada en redes neuronales entrenadas con inmensos corpus (Treebanks). Sus ventajas incluyen una precisión superior en el etiquetado morfosintáctico (POS) en oraciones ambiguas, un soporte exhaustivo de múltiples idiomas y acceso a herramientas avanzadas que no están en todos los frameworks, como el análisis de sentimientos detallado, relaciones temporales y resolución de correferencias complejas.

**4. ¿Qué limitaciones presenta el enfoque basado en reglas para el análisis semántico?**
El enfoque basado en reglas (if-else con listas de conectores) es rígido y no escala bien. Sus limitaciones incluyen la falta de contexto (no entiende la semántica real), difícil mantenimiento (cubrir todas las excepciones requiere mucho código) y errores con oraciones anidadas (falla al analizar oraciones subordinadas complejas).

**5. ¿Qué mejoras implementaría para aumentar la precisión del clasificador?**
Para mejorar la precisión, se debería adoptar un enfoque de Machine Learning o Híbrido, como el uso de Modelos Clasificadores (SVM o redes neuronales), Modelos de Lenguaje tipo LLMs haciendo fine-tuning a BERT/BETO, o integrando las reglas actuales con el árbol de dependencias generado por CoreNLP para asegurar que el conector actúe como nodo raíz en la estructura.

---

## Conclusiones:
Se logró implementar de manera exitosa un analizador lingüístico utilizando Stanford CoreNLP mediante su servidor Java, integrándolo en una arquitectura web.
El análisis comparativo permitió evidenciar que mientras spaCy es altamente eficiente para tareas de extracción rápida y entornos de producción, Stanford CoreNLP provee un nivel de detalle sintáctico y semántico superior, indispensable para investigaciones lingüísticas profundas.
La clasificación semántica mediante reglas estáticas funcionó correctamente para los casos de prueba de la guía, pero se identificó la necesidad de aplicar inteligencia artificial para lograr una generalización efectiva.

---

## Recomendaciones:
Considerar el uso de equipos con al menos 8GB de RAM, ya que la inicialización de los modelos neuronales del servidor de Stanford CoreNLP en Java demanda bastantes recursos de memoria.
Para futuros proyectos con necesidades de NLP en tiempo real, priorizar el uso de spaCy, y reservar CoreNLP para procesos en diferido (batch processing) o cuando se requiera extrema precisión gramatical.

---

## Bibliografía:
[1] C. D. Manning, M. Surdeanu, J. Bauer, J. R. Finkel, S. Bethard, y D. McClosky, "The Stanford CoreNLP Natural Language Processing Toolkit," en Proceedings of 52nd Annual Meeting of the Association for Computational Linguistics: System Demonstrations, Baltimore, MD, USA, 2014, pp. 55–60.
[2] M. Honnibal y M. Johnson, "An Improved Non-monotonic Transition System for Dependency Parsing," en Proceedings of the 2015 Conference on Empirical Methods in Natural Language Processing, Lisbon, Portugal, 2015, pp. 1373–1378.
[3] M. Honnibal, I. Montani, S. Van Landeghem, y A. Boyd, "spaCy: Industrial-strength Natural Language Processing in Python," Zenodo, 2020, doi: 10.5281/zenodo.1212303.
[4] Materia semana 15. Guaman, Jose. 2026.
[5] Documentación oficial de Flask y React/Vite.

---

## Anexos

### Anexo 1. Declaración de Uso de IA
**1. Herramienta utilizada:** Gemini.

**2. Descripción del uso:** 
Gemini fue empleado para apoyar en la generación y estructuración de la documentación técnica, así como para asesorar en la comparación técnica entre las herramientas spaCy y Stanford CoreNLP. No generó el código fuente de los algoritmos ni elaboró las tablas de comparación de forma autónoma.

**3. Limitaciones de la IA y revisión humana:** 
La información proporcionada por Gemini fue revisada, depurada y adaptada manualmente para ajustarse a los requerimientos específicos de la guía de actividades.

**4. Compromiso ético:** 
Como estudiantes de la Universidad Nacional de Loja, declaramos que la inteligencia artificial fue utilizada únicamente como una herramienta de apoyo, respetando los principios de honestidad académica y uso responsable de las herramientas.

### Anexo 2. Repositorio Git
**REPOSITORIO:** [Por agregar]
