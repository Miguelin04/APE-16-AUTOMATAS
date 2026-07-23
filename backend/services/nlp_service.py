import stanza
import spacy
import time
import requests
import re


class NLPService:
    def __init__(self):
        self.stanza_nlp = None
        self.spacy_nlp = None
        self.stanza_error = None
        self.spacy_error = None

    def initialize(self):
        if not self.stanza_nlp:
            try:
                print("Inicializando Stanza (CoreNLP)...")
                stanza.download('es', processors='tokenize,pos,lemma,depparse,constituency')
                self.stanza_nlp = stanza.Pipeline(lang='es', processors='tokenize,pos,lemma,depparse,constituency', use_gpu=False)
                self.stanza_error = None
            except Exception as e:
                print(f"Error loading Stanza: {e}")
                self.stanza_error = str(e)
        if not self.spacy_nlp:
            try:
                print("Inicializando spaCy...")
                self.spacy_nlp = spacy.load("es_core_news_sm")
                self.spacy_error = None
            except Exception as e:
                print(f"Error loading Spacy: {e}")
                self.spacy_error = str(e)

    def analyze(self, text: str):
        self.initialize()

        lexico = []
        dependencias = []
        arbol = ""
        sujeto = None
        verbo = None
        objeto = None

        start_time = time.time()
        usando_servidor_java = False

        try:
            java_url = 'http://localhost:9000/?properties={"annotators":"tokenize,ssplit,pos,parse,depparse","outputFormat":"json","pipelineLanguage":"es"}'
            response = requests.post(java_url, data=text.encode('utf-8'), timeout=10.0)
            if response.status_code == 200:
                java_data = response.json()
                usando_servidor_java = True
                if java_data.get("sentences"):
                    sentence = java_data["sentences"][0]
                    for token in sentence.get("tokens", []):
                        lexico.append({
                            "token": token.get("word", ""),
                            "pos": token.get("pos", "")
                        })
                    for dep in sentence.get("basicDependencies", []):
                        dependencias.append({
                            "palabra": dep.get("dependentGloss", ""),
                            "rel": dep.get("dep", ""),
                            "head": dep.get("governorGloss", "root")
                        })
                    arbol = sentence.get("parse", "Árbol no disponible")

                    sujeto = next((d["dependentGloss"] for d in sentence.get("basicDependencies", []) if "subj" in d.get("dep", "")), None)
                    verbo = next((d["dependentGloss"] for d in sentence.get("basicDependencies", []) if d.get("governorGloss") == "ROOT"), None)
                    objeto = next((d["dependentGloss"] for d in sentence.get("basicDependencies", []) if "obj" in d.get("dep", "")), None)
        except Exception:
            usando_servidor_java = False

        if not usando_servidor_java and self.stanza_nlp:
            doc_stanza = self.stanza_nlp(text)
            for sentence in doc_stanza.sentences:
                for word in sentence.words:
                    lexico.append({
                        "token": word.text,
                        "pos": word.upos
                    })
                    head_word = "root" if word.head == 0 else sentence.words[word.head - 1].text
                    dependencias.append({
                        "palabra": word.text,
                        "rel": word.deprel,
                        "head": head_word
                    })

                arbol = str(sentence.constituency) if sentence.constituency else "Árbol no disponible"
                sujeto = next((w.text for w in sentence.words if "subj" in w.deprel), None)
                verbo = next((w.text for w in sentence.words if w.upos == "VERB" and w.head == 0), None)
                if not verbo:
                    verbo = next((w.text for w in sentence.words if w.upos == "VERB"), None)
                objeto = next((w.text for w in sentence.words if "obj" in w.deprel), None)

        stanza_time = int((time.time() - start_time) * 1000)

        start_time = time.time()
        spacy_lexico = []
        spacy_dependencias = []
        if self.spacy_nlp:
            doc_spacy = self.spacy_nlp(text)
            for token in doc_spacy:
                spacy_lexico.append({
                    "token": token.text,
                    "pos": token.pos_
                })
                spacy_dependencias.append({
                    "palabra": token.text,
                    "rel": token.dep_,
                    "head": token.head.text
                })
        spacy_time = int((time.time() - start_time) * 1000)

        verbs_count = sum(1 for item in lexico if item["pos"] == "VERB")

        classification = self.classify_sentence(text, verbs_count)

        oracion_principal = text
        oracion_subordinada = "N/A (Oración simple)"
        conector_hallado = classification.get("conector", "Ninguno")

        if conector_hallado != "Ninguno":
            partes = re.split(rf'\b{re.escape(conector_hallado)}\b', text, maxsplit=1, flags=re.IGNORECASE)
            if len(partes) > 1:
                oracion_principal = partes[0].strip()
                oracion_subordinada = partes[1].strip()

        classification["oracion_principal"] = oracion_principal
        classification["oracion_subordinada"] = oracion_subordinada

        if self.stanza_error:
            return {
                "success": False,
                "error_message": f"Error cargando Stanza: {self.stanza_error}"
            }

        return {
            "success": True,
            "oracion": text,
            "lexico": lexico,
            "sintactico": {
                "dependencias": dependencias,
                "arbol": arbol
            },
            "semantico": {
                "sujeto": sujeto or "No encontrado",
                "verbo": verbo or "No encontrado",
                "objeto": objeto or "No encontrado",
                "clasificacion": classification
            },
            "metricas": {
                "stanza_time_ms": stanza_time,
                "spacy_time_ms": spacy_time,
                "motor_stanford": "Servidor Java CoreNLP (Puerto 9000)" if usando_servidor_java else "Stanza (Python Nativo)"
            },
            "spacy": {
                "lexico": spacy_lexico,
                "dependencias": spacy_dependencias
            }
        }

    def classify_sentence(self, text: str, verbs_count: int = 0):
        text_lower = text.lower()

        conectores = {
            "porque": {"tipo": "Compuesta Subordinada", "relacion": "Causal"},
            "ya que": {"tipo": "Compuesta Subordinada", "relacion": "Causal"},
            "puesto que": {"tipo": "Compuesta Subordinada", "relacion": "Causal"},
            "y": {"tipo": "Compuesta Coordinada", "relacion": "Copulativa"},
            "e": {"tipo": "Compuesta Coordinada", "relacion": "Copulativa"},
            "ni": {"tipo": "Compuesta Coordinada", "relacion": "Copulativa"},
            "o": {"tipo": "Compuesta Coordinada", "relacion": "Disyuntiva"},
            "u": {"tipo": "Compuesta Coordinada", "relacion": "Disyuntiva"},
            "pero": {"tipo": "Compuesta Coordinada", "relacion": "Adversativa"},
            "sin embargo": {"tipo": "Compuesta Coordinada", "relacion": "Adversativa"},
            "si": {"tipo": "Compuesta Subordinada", "relacion": "Condicional"},
            "aunque": {"tipo": "Compuesta Subordinada", "relacion": "Concesiva"},
            "mientras": {"tipo": "Compuesta Subordinada", "relacion": "Temporal"},
            "cuando": {"tipo": "Compuesta Subordinada", "relacion": "Temporal"},
            "para que": {"tipo": "Compuesta Subordinada", "relacion": "Final"},
            "por lo tanto": {"tipo": "Compuesta Subordinada", "relacion": "Consecutiva"}
        }

        pad_text = f" {text_lower} "

        if text_lower.startswith("si "):
            return {"tipo": conectores["si"]["tipo"], "relacion": conectores["si"]["relacion"], "conector": "si", "fuente": "reglas"}

        if text_lower.startswith("aunque "):
            return {"tipo": conectores["aunque"]["tipo"], "relacion": conectores["aunque"]["relacion"], "conector": "aunque", "fuente": "reglas"}

        for c, rel in conectores.items():
            if f" {c} " in pad_text:
                return {
                    "tipo": rel["tipo"],
                    "relacion": rel["relacion"],
                    "conector": c,
                    "fuente": "reglas"
                }

        if verbs_count <= 1:
            return {
                "tipo": "Oración Simple",
                "relacion": "Ninguna",
                "conector": "Ninguno",
                "fuente": "reglas"
            }

        return {
            "tipo": "Compuesta (sin conector explícito)",
            "relacion": "No determinada",
            "conector": "Ninguno",
            "fuente": "reglas"
        }
