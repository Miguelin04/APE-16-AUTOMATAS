import { useState } from 'react'
import './App.css'

function App() {
  const [code, setCode] = useState('María estudia porque mañana tiene un gato.')
  const [resultData, setResultData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)

  const analyzeCode = async (textToAnalyze = code) => {
    if (!textToAnalyze.trim()) return

    setIsLoading(true)
    setErrorMsg('')
    setResultData(null)
    const startTime = performance.now()

    try {
      const response = await fetch('http://127.0.0.1:8001/api/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: textToAnalyze.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success === false) {
           setErrorMsg(data.error_message || 'Fallo interno al analizar la oración.');
           setIsLoading(false);
           return;
        }
        setResultData(data)
      } else {
        setErrorMsg(`Error del servidor: ${response.status}`)
      }
    } catch (error) {
      setErrorMsg('Error de conexión. Asegúrate de que el backend Flask esté ejecutándose.')
    } finally {
      const endTime = performance.now()
      setExecutionTime(((endTime - startTime) / 1000).toFixed(2))
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') analyzeCode(code)
  }

  const generarInterpretacion = (semantico, oracionCompleta) => {
    if (!semantico || !oracionCompleta) return "Interpretación no disponible.";
    const { sujeto, verbo, clasificacion } = semantico;
    const { tipo, relacion, conector } = clasificacion || {};

    let sujetoText = sujeto && sujeto !== "No encontrado" ? sujeto : "Alguien (sujeto implícito)";
    let verboText = verbo && verbo !== "No encontrado" ? verbo : "realiza una acción";

    if (!tipo || tipo.includes("Simple") || tipo.includes("No Clasificada")) {
      return `${sujetoText} realiza la acción de '${verboText}'.`;
    }

    return `La oración es ${tipo.toLowerCase()} con relación ${relacion?.toLowerCase() || ''} a través del conector "${conector}". ${sujetoText} realiza la acción de '${verboText}'.`;
  };

  const renderStars = (level) => {
    return null;
  };

  const parseSexp = (str) => {
    if (!str) return null;
    let pos = 0;
    const parse = () => {
        while (str[pos] === ' ') pos++;
        if (str[pos] === '(') {
            pos++;
            let nodeStr = "";
            while (str[pos] !== ' ' && str[pos] !== '(' && str[pos] !== ')') {
                nodeStr += str[pos];
                pos++;
            }
            let children = [];
            while (str[pos] !== ')') {
                if (str[pos] === ' ') pos++;
                else if (str[pos] === '(') children.push(parse());
                else {
                    let word = "";
                    while (str[pos] !== ')' && str[pos] !== '(' && str[pos] !== ' ') {
                        word += str[pos];
                        pos++;
                    }
                    children.push(word);
                }
            }
            pos++;
            return { node: nodeStr, children };
        }
        return null;
    };
    return parse();
  };

  const TreeRenderer = ({ data }) => {
    if (typeof data === 'string') return <span style={{fontWeight: 'bold', color: '#1e293b', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px', margin: '2px 0', display: 'inline-block'}}>{data}</span>;
    if (!data) return null;
    return (
      <div style={{ marginLeft: '15px', position: 'relative', borderLeft: '2px solid #e2e8f0', paddingLeft: '12px', marginTop: '6px' }}>
        <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>{data.node}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {data.children && data.children.map((child, i) => <TreeRenderer key={i} data={child} />)}
        </div>
      </div>
    );
  };

  const renderTree = (treeString) => {
    if (!treeString || treeString === "Árbol no disponible") return <div style={{padding: '20px', color: '#94a3b8', textAlign: 'center'}}>Árbol no disponible</div>;
    try {
      const tree = parseSexp(treeString);
      return (
        <div style={{ overflowX: 'auto', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '150px', display: 'flex', justifyContent: 'flex-start' }}>
          <TreeRenderer data={tree} />
        </div>
      );
    } catch (e) {
      return <div style={{padding: '20px', color: '#ef4444'}}>Error renderizando el árbol.</div>;
    }
  };

  return (
    <div style={{backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'}}>
      
      {/* NAVBAR */}
      <header style={{backgroundColor: 'white', padding: '12px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', padding: '6px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px'}}>NLP</div>
          <div>
            <h1 style={{margin: 0, fontSize: '16px', color: '#0f172a'}}>Analizador Avanzado – Práctica 16</h1>
            <span style={{fontSize: '11px', color: '#64748b'}}>David Guaman & Miguel Luna</span>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <div style={{padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0'}}>
            <span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669'}}></span>
            Clasificación Reglas (Rápido)
          </div>
          <div style={{color: '#f59e0b', fontSize: '18px'}}>☀️</div>
        </div>
      </header>

      {/* HEADER SECTION (INPUT + TIMERS) */}
      <section style={{padding: '20px 30px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
        
        <div style={{flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
          <div style={{fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase'}}>Oración de Entrada</div>
          <div style={{display: 'flex', gap: '10px'}}>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none'}}
            />
            <button onClick={() => analyzeCode(code)} disabled={isLoading} style={{padding: '0 20px', backgroundColor: '#6366f1', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              {isLoading ? 'Analizando...' : 'Analizar'}
            </button>
          </div>
        </div>

        {resultData && (
          <div style={{display: 'flex', gap: '15px'}}>
            <div style={{backgroundColor: '#fef2f2', padding: '15px 20px', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '15px', minWidth: '200px'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div>
                <div style={{fontSize: '10px', fontWeight: 'bold', color: '#ef4444', textTransform: 'uppercase'}}>{resultData.debug?.usando_java ? 'Tiempo Servidor Java' : 'Tiempo Stanza (Python)'}</div>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#7f1d1d'}}>{resultData.metricas?.stanza_time_ms} ms</div>
              </div>
            </div>

            <div style={{backgroundColor: '#eff6ff', padding: '15px 20px', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '15px', minWidth: '200px'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <div>
                <div style={{fontSize: '10px', fontWeight: 'bold', color: '#3b82f6', textTransform: 'uppercase'}}>Tiempo spaCy</div>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a'}}>{resultData.metricas?.spacy_time_ms} ms</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* DASHBOARD COLUMNS */}
      {resultData && resultData.success && (
        <main style={{maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '20px', padding: '0 30px 40px'}}>
          
          {/* LADO IZQUIERDO: STANFORD */}
          <div style={{flex: 1, backgroundColor: 'white', borderRadius: '12px', border: '1px solid #fecaca', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '25px', display: 'flex', flexDirection: 'column', gap: '25px'}}>
            
            <h2 style={{margin: 0, color: '#e11d48', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <span style={{fontSize: '22px'}}>🌺</span> STANFORD CORENLP ({resultData.debug?.usando_java ? 'SERVIDOR JAVA 9000' : 'STANZA PYTHON'})
            </h2>
            <div style={{fontSize: '12px', color: '#64748b', marginTop: '-20px'}}>
              Análisis profundo y completo usando el motor: <strong style={{color: '#e11d48'}}>{resultData.metricas?.motor_stanford}</strong>
            </div>

            {/* 1 LÉXICO */}
            <div>
              <div style={{backgroundColor: '#e11d48', color: 'white', display: 'inline-block', width: '20px', height: '20px', borderRadius: '4px', textAlign: 'center', lineHeight: '20px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px'}}>1</div>
              <strong style={{color: '#e11d48', fontSize: '13px'}}>LÉXICO (TOKENS Y POS)</strong>
              
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px'}}>
                {resultData.lexico?.map((item, i) => (
                  <div key={i} style={{backgroundColor: '#fff1f2', border: '1px solid #fecaca', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', minWidth: '60px'}}>
                    <div style={{padding: '8px 12px', color: '#1f2937', fontWeight: 'bold', fontSize: '13px'}}>{item.token}</div>
                    <div style={{backgroundColor: '#fb7185', color: 'white', width: '100%', textAlign: 'center', fontSize: '9px', padding: '3px 0', fontWeight: 'bold'}}>{item.pos}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 SINTÁCTICO */}
            <div>
              <div style={{backgroundColor: '#3b82f6', color: 'white', display: 'inline-block', width: '20px', height: '20px', borderRadius: '4px', textAlign: 'center', lineHeight: '20px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px'}}>2</div>
              <strong style={{color: '#3b82f6', fontSize: '13px'}}>SINTÁCTICO (ÁRBOL Y DEPENDENCIAS)</strong>
              
              <div style={{display: 'flex', gap: '20px', marginTop: '15px'}}>
                {/* DEPENDENCIAS */}
                <div style={{flex: 1}}>
                  <div style={{fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px'}}>Dependencias (UD)</div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                    {resultData.sintactico?.dependencias?.map((dep, i) => (
                      <div key={i} style={{fontSize: '12px', display: 'flex', gap: '8px'}}>
                        <span style={{width: '60px', color: '#1f2937'}}>{dep.palabra}</span>
                        <span style={{color: '#94a3b8'}}>→</span>
                        <span style={{color: '#3b82f6', fontWeight: 'bold'}}>{dep.rel}</span>
                        <span style={{color: '#64748b'}}>({dep.head})</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* ÁRBOL */}
                <div style={{flex: 2}}>
                  <div style={{fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px'}}>Árbol Sintáctico (Constituyente)</div>
                  {renderTree(resultData.sintactico?.arbol)}
                </div>
              </div>
            </div>

            {/* 3 SEMÁNTICO */}
            <div>
              <div style={{backgroundColor: '#10b981', color: 'white', display: 'inline-block', width: '20px', height: '20px', borderRadius: '4px', textAlign: 'center', lineHeight: '20px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px'}}>3</div>
              <strong style={{color: '#10b981', fontSize: '13px'}}>ANÁLISIS SEMÁNTICO</strong>
              
              <div style={{marginTop: '15px'}}>
                
                <div style={{backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0'}}>
                  <div style={{fontSize: '11px', color: '#047857', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px'}}>CLASIFICACIÓN DE ORACIÓN (Actividades 4 y 5)</div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px'}}>
                    <div style={{display: 'flex'}}><strong style={{width: '140px'}}>Tipo de oración:</strong> <span style={{color: '#065f46'}}>{resultData.semantico?.clasificacion?.tipo}</span></div>
                    <div style={{display: 'flex'}}><strong style={{width: '140px'}}>Relación:</strong> <span style={{color: '#065f46'}}>{resultData.semantico?.clasificacion?.relacion}</span></div>
                    <div style={{display: 'flex'}}><strong style={{width: '140px'}}>Conector:</strong> <span style={{color: '#065f46', fontWeight: 'bold'}}>{resultData.semantico?.clasificacion?.conector}</span></div>
                    <div style={{display: 'flex'}}><strong style={{width: '140px'}}>Oración principal:</strong> <span style={{color: '#065f46'}}>{resultData.semantico?.clasificacion?.oracion_principal}</span></div>
                    <div style={{display: 'flex'}}><strong style={{width: '140px'}}>Oración subord.:</strong> <span style={{color: '#065f46'}}>{resultData.semantico?.clasificacion?.oracion_subordinada}</span></div>
                  </div>
                </div>
              </div>

              {/* INTERPRETACIÓN */}
              <div style={{marginTop: '15px', backgroundColor: '#ecfdf5', padding: '15px', borderRadius: '8px', border: '1px solid #a7f3d0'}}>
                <div style={{fontSize: '12px', color: '#047857', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  INTERPRETACIÓN HUMANA
                </div>
                <div style={{fontSize: '13px', color: '#065f46'}}>
                  {generarInterpretacion(resultData.semantico, resultData.oracion)}
                </div>
              </div>
            </div>

          </div>

          {/* LADO DERECHO: SPACY Y TABLA */}
          <div style={{flex: '0 0 450px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            
            {/* SPACY LIVE */}
            <div style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #bfdbfe', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '25px'}}>
              <h2 style={{margin: 0, color: '#2563eb', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <span style={{fontSize: '20px'}}>✍️</span> ANÁLISIS spaCy EN VIVO (COMPARATIVO)
              </h2>
              <div style={{fontSize: '11px', color: '#64748b', marginTop: '2px', marginBottom: '20px'}}>Resultados del modelo spaCy</div>

              {/* TOKENS SPACY */}
              <div style={{backgroundColor: '#3b82f6', color: 'white', display: 'inline-block', width: '20px', height: '20px', borderRadius: '4px', textAlign: 'center', lineHeight: '20px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px'}}>1</div>
              <strong style={{color: '#3b82f6', fontSize: '12px'}}>TOKENS Y POS (spaCy)</strong>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '15px 0 20px 0'}}>
                {resultData.spacy?.lexico?.map((item, i) => (
                  <div key={i} style={{backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', minWidth: '50px'}}>
                    <div style={{padding: '4px 8px', color: '#1e3a8a', fontWeight: 'bold', fontSize: '11px'}}>{item.token}</div>
                    <div style={{backgroundColor: '#60a5fa', color: 'white', width: '100%', textAlign: 'center', fontSize: '9px', padding: '2px 0'}}>{item.pos}</div>
                  </div>
                ))}
              </div>

              {/* DEPENDENCIAS SPACY */}
              <div style={{backgroundColor: '#3b82f6', color: 'white', display: 'inline-block', width: '20px', height: '20px', borderRadius: '4px', textAlign: 'center', lineHeight: '20px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px'}}>2</div>
              <strong style={{color: '#3b82f6', fontSize: '12px'}}>DEPENDENCIAS (spaCy)</strong>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '15px'}}>
                {resultData.spacy?.dependencias?.map((dep, i) => (
                  <div key={i} style={{fontSize: '11px', display: 'flex', gap: '6px', color: '#1e3a8a'}}>
                    <span style={{width: '50px'}}>{dep.palabra}</span>
                    <span style={{color: '#94a3b8'}}>→</span>
                    <span style={{color: '#3b82f6'}}>{dep.rel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TABLA ACT 6 */}
            <div style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '25px'}}>
              <h2 style={{margin: '0 0 15px 0', color: '#0f172a', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                ACTIVIDAD 6: TABLA COMPARATIVA
              </h2>
              <table style={{width: '100%', fontSize: '11px', borderCollapse: 'collapse', textAlign: 'left'}}>
                <thead>
                  <tr style={{backgroundColor: '#f8fafc'}}>
                    <th style={{padding: '10px 8px', borderBottom: '1px solid #cbd5e1', color: '#64748b'}}>Aspecto</th>
                    <th style={{padding: '10px 8px', borderBottom: '1px solid #cbd5e1', color: '#e11d48'}}>Stanford CoreNLP</th>
                    <th style={{padding: '10px 8px', borderBottom: '1px solid #cbd5e1', color: '#2563eb'}}>spaCy</th>
                    <th style={{padding: '10px 8px', borderBottom: '1px solid #cbd5e1', color: '#64748b'}}>Ganador</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9'}}>Tiempo proc.</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>{resultData.metricas?.stanza_time_ms} ms</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>{resultData.metricas?.spacy_time_ms} ms</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>spaCy ⚡</td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9'}}>Precisión POS</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Excelente</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Buena</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Stanford 🎯</td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9'}}>Árbol Sintáctico</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Completo</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>No disponible</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Stanford 🌳</td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9'}}>Relaciones sem.</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Profundas</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Básicas</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Stanford 🧠</td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9'}}>Facilidad uso</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Media</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>Alta</td>
                    <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9', color: '#475569'}}>spaCy ✅</td>
                  </tr>
                  <tr>
                    <td style={{padding: '8px'}}>Memoria</td>
                    <td style={{padding: '8px', color: '#475569'}}>Mayor</td>
                    <td style={{padding: '8px', color: '#475569'}}>Menor</td>
                    <td style={{padding: '8px', color: '#475569'}}>spaCy ✅</td>
                  </tr>
                </tbody>
              </table>

              <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe'}}>
                <h4 style={{margin: '0 0 8px 0', fontSize: '11px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '5px'}}>🏆 CONCLUSIÓN COMPARATIVA</h4>
                <p style={{margin: 0, fontSize: '11px', color: '#1e40af', lineHeight: '1.4'}}>
                  Stanford CoreNLP ofrece un análisis lingüístico más profundo y completo (árbol sintáctico, relaciones semánticas), mientras que spaCy destaca por su velocidad, eficiencia y facilidad de integración.
                </p>
              </div>
            </div>

          </div>

        </main>
      )}

      {/* FOOTER */}
      <footer style={{backgroundColor: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          Práctica 16 – Teoría de Autómatas
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Docente: José O. Guamán Q.
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          Universidad / Facultad de Ingeniería en Sistemas
        </div>
      </footer>
    </div>
  )
}

export default App
