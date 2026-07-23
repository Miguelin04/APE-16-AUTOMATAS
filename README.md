# Analisis Lexico, Sintactico y Clasificacion Semantica de Oraciones Compuestas

**Practica Nro. 16** - Teoria de Automatas y Computabilidad

## Descripcion

Sistema que implementa analisis lingüistico utilizando Stanford CoreNLP (Stanza) y spaCy para identificar la estructura lexica, sintactica y relaciones semanticas en oraciones compuestas del idioma espanol.

## Arquitectura

1. **Frontend (React + Vite):** Interfaz web con input de texto, chips de oraciones de ejemplo, visualizacion del pipeline NLP y tabla de comparacion Stanza vs spaCy.
2. **Backend (Python + Flask):** API REST que ejecuta el analisis NLP usando Stanza (wrapper de Stanford CoreNLP) y spaCy.

## Actividades implementadas

- **Actividad 1:** Configuracion de Stanford CoreNLP para espanol via Stanza
- **Actividad 2:** Analisis de oraciones (Token, POS, Dependencias, Arbol sintactico)
- **Actividad 3:** Identificacion de sujeto, verbo y objeto directo en oraciones simples
- **Actividad 4:** Reglas de identificacion de conectores (coordinadas y subordinadas)
- **Actividad 5:** Clasificacion automatica de oraciones compuestas
- **Actividad 6:** Comparacion de resultados entre spaCy y Stanford CoreNLP

## Requisitos

- Python 3.10+
- Node.js 16+
- Java JDK 11+ (para Stanza)

## Instalacion y Ejecucion

### Backend

```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 app.py
```

El servidor Flask se iniciara en `http://127.0.0.1:8001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`.

## API

**POST /api/nlp** - Analisis NLP completo

```json
{
  "source": "Pedro llego y Ana salio."
}
```

Respuesta: tokens, POS, dependencias, arbol constituyente, clasificacion y comparacion Stanza vs spaCy.
