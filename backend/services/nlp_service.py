import stanza
import spacy
import time

class NLPService:
    def __init__(self):
        self.stanza_nlp = None
        self.spacy_nlp = None

    def initialize(self):
        if not self.stanza_nlp:
            try:
                print("Inicializando Stanza (CoreNLP)...")
                # Descarga silenciosa si no existe
                stanza.download('es', processors='tokenize,pos,lemma,depparse,constituency')
                self.stanza_nlp = stanza.Pipeline(lang='es', processors='tokenize,pos,lemma,depparse,constituency', use_gpu=False)
            except Exception as e:
                print(f"Error loading Stanza: {e}")
        if not self.spacy_nlp:
            try:
                print("Inicializando spaCy...")
                self.spacy_nlp = spacy.load("es_core_news_sm")
            except Exception as e:
                print(f"Error loading Spacy: {e}")

    def analyze(self, text: str):
        self.initialize()
        
        stanza_results = []
        spacy_results = []
        
        # Timing Stanza
        start_time = time.time()
        if self.stanza_nlp:
            doc_stanza = self.stanza_nlp(text)
            for sentence in doc_stanza.sentences:
                tokens = []
                for word in sentence.words:
                    tokens.append({
                        "id": word.id,
                        "text": word.text,
                        "pos": word.upos,
                        "head": word.head,
                        "deprel": word.deprel
                    })
                # Constituency parsing (syntactic tree)
                tree = str(sentence.constituency) if sentence.constituency else "Árbol no disponible"
                
                # Identify simple sentence elements (Subject, Verb, Object)
                sujeto = next((w.text for w in sentence.words if "subj" in w.deprel), None)
                # Encontrar el verbo principal (a menudo la raíz de la oración)
                verbo = next((w.text for w in sentence.words if w.upos == "VERB" and w.head == 0), None)
                if not verbo:
                     verbo = next((w.text for w in sentence.words if w.upos == "VERB"), None)
                objeto = next((w.text for w in sentence.words if "obj" in w.deprel), None)
                
                stanza_results.append({
                    "text": sentence.text,
                    "tokens": tokens,
                    "tree": tree,
                    "sujeto": sujeto or "No encontrado",
                    "verbo": verbo or "No encontrado",
                    "objeto": objeto or "No encontrado"
                })
        stanza_time = time.time() - start_time
        
        # Timing Spacy
        start_time = time.time()
        if self.spacy_nlp:
            doc_spacy = self.spacy_nlp(text)
            for sent in doc_spacy.sents:
                tokens = []
                for token in sent:
                    tokens.append({
                        "id": token.i,
                        "text": token.text,
                        "pos": token.pos_,
                        "head": token.head.i,
                        "deprel": token.dep_
                    })
                spacy_results.append({
                    "text": sent.text,
                    "tokens": tokens
                })
        spacy_time = time.time() - start_time
        
        classification = self.classify_sentence(text)
        
        return {
            "success": True,
            "stanza": {
                "results": stanza_results,
                "time": round(stanza_time, 4),
                "memory": "Alto (Modelos Neuronales)",
                "ease": "Requiere descargar modelos grandes",
                "precision_pos": "Muy Alta",
                "tree_detail": "Construcción completa de árbol constituyente",
                "deps": "Dependencias Universales (UD) detalladas"
            },
            "spacy": {
                "results": spacy_results,
                "time": round(spacy_time, 4),
                "memory": "Bajo (Modelos eficientes pequeños)",
                "ease": "Muy fácil (API amigable)",
                "precision_pos": "Alta",
                "tree_detail": "Solo árbol de dependencias, no constituyente",
                "deps": "Dependencias rápidas"
            },
            "classification": classification
        }

    def classify_sentence(self, text: str):
        text_lower = text.lower()
        
        conectores = {
            "Coordinada": {
                "Copulativa": [" y ", " e ", " ni "],
                "Disyuntiva": [" o ", " u "],
                "Adversativa": [" pero ", " sin embargo "]
            },
            "Subordinada": {
                "Causal": [" porque ", " ya que ", " puesto que "],
                "Condicional": [" si "],
                "Concesiva": [" aunque "],
                "Temporal": [" mientras ", " cuando "],
                "Final": [" para que "],
                "Consecutiva": [" por lo tanto "]
            }
        }
        
        pad_text = f" {text_lower} "
        if text_lower.startswith("si "):
            return {"type": "Compuesta Subordinada", "relation": "Condicional", "connector": "si"}
        
        if text_lower.startswith("aunque "):
            return {"type": "Compuesta Subordinada", "relation": "Concesiva", "connector": "aunque"}
            
        for main_type, subtypes in conectores.items():
            for relation, keywords in subtypes.items():
                for kw in keywords:
                    if kw in pad_text:
                        return {
                            "type": f"Compuesta {main_type}",
                            "relation": relation,
                            "connector": kw.strip()
                        }
        
        return {
            "type": "Oración Simple o No Clasificada",
            "relation": "Ninguna",
            "connector": "Ninguno"
        }
