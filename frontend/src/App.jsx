import { useState } from 'react'
import './App.css'

function App() {
  const [code, setCode] = useState('María estudia porque mañana tiene un examen.')
  const [resultData, setResultData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)
  
  const [history, setHistory] = useState([])
  const [activeModal, setActiveModal] = useState(null)
  const [activeTab, setActiveTab] = useState('analysis') // 'analysis' or 'comparison'

  const examples = [
    "María estudia porque mañana tiene un examen.",
    "Pedro llegó y Ana salió.",
    "Aunque llueve iremos al parque.",
    "Si estudias aprobarás.",
    "Juan cocina mientras Ana limpia.",
    "Pedro compró un automóvil."
  ]

  const analyzeCode = async (textToAnalyze = code) => {
    if (!textToAnalyze.trim()) return

    setIsLoading(true)
    setErrorMsg('')
    setResultData(null)
    const startTime = performance.now()

    try {
      // Changed to use the new NLP endpoint
      const response = await fetch('http://127.0.0.1:8001/api/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: textToAnalyze.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setResultData(data)
        
        // Save to history
        setHistory(prev => [{
          query: textToAnalyze.trim(),
          success: data.success,
          solution: data.classification?.type || 'Procesado',
          time: new Date().toLocaleTimeString()
        }, ...prev])
      } else {
        setErrorMsg(`Error del servidor: ${response.status}`)
      }
    } catch (error) {
      setErrorMsg('Error de conexión. Asegúrate de que el backend Flask esté ejecutándose en http://127.0.0.1:8001')
    } finally {
      const endTime = performance.now()
      setExecutionTime(((endTime - startTime) / 1000).toFixed(2))
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') analyzeCode(code)
  }

  const handleExampleClick = (example) => {
    setCode(example)
    analyzeCode(example)
  }

  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`layout-container ${isDarkMode ? 'dark-theme' : ''}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">NLP</div>
          <div className="logo-text">
            <h2>Analizador NLP</h2>
            <span>Práctica Nro. 16</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Análisis</span>
          </div>

          <div className={`nav-item ${activeTab === 'comparison' ? 'active' : ''}`} onClick={() => setActiveTab('comparison')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span>Comparación Modelos</span>
          </div>

          <div className="nav-section-title">PIPELINE NLP</div>
          
          <div className="nav-step">
            <div className="step-icon pink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className="step-text">
              <div className="step-name pink-text">01 Léxico</div>
              <div className="step-desc">Tokens & POS</div>
            </div>
          </div>

          <div className="nav-step">
            <div className="step-icon blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <div className="step-text">
              <div className="step-name blue-text">02 Sintáctico</div>
              <div className="step-desc">Árbol & Dependencias</div>
            </div>
          </div>

          <div className="nav-step">
            <div className="step-icon green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="step-text">
              <div className="step-name green-text">03 Semántico</div>
              <div className="step-desc">Clasificación & Sujeto</div>
            </div>
          </div>

          <div className="nav-divider"></div>

          <div className="nav-item" onClick={() => setActiveModal('history')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <div className="step-text">
              <div className="step-name">Historial</div>
              <div className="step-desc">Consultas anteriores</div>
            </div>
          </div>

          <div className="nav-item" onClick={() => setActiveModal('about')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <div className="step-text">
              <div className="step-name">Acerca de</div>
              <div className="step-desc">Práctica 16 NLP</div>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="ai-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path></svg>
            <div>
              <strong>Stanford CoreNLP</strong>
              <span>+ spaCy Integration</span>
            </div>
          </div>
          <div className="system-status">
            <span className="status-dot"></span> Modelos Cargados
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content" style={{ overflowY: 'auto' }}>
        <header className="top-header">
          <div className="header-titles">
            <h1>Analizador Lingüístico (Práctica 16)</h1>
            <p>Estructura léxica, sintáctica y relaciones semánticas en oraciones.</p>
          </div>
          <div className="header-actions">
            <button className="mode-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                  Modo Oscuro
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>
                  Modo Claro
                </>
              )}
            </button>
          </div>
        </header>

        {activeTab === 'analysis' && (
          <>
            <section className="input-section">
              <div className="input-container">
                <div className="input-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: Pedro llegó y Ana salió."
                />
                <button className="submit-btn" onClick={() => analyzeCode(code)} disabled={isLoading}>
                  {isLoading ? <div className="spinner"></div> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>}
                </button>
              </div>
              
              <div className="examples-container">
                <span className="examples-label">Actividad 2 y 3:</span>
                <div className="examples-scroll">
                  {examples.map((ex, idx) => (
                    <button key={idx} className="example-chip" onClick={() => handleExampleClick(ex)}>
                      {ex.length > 30 ? ex.substring(0, 30) + "..." : ex}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {errorMsg && (
              <div className="error-global">
                <p>{errorMsg}</p>
              </div>
            )}

            {resultData && resultData.stanza?.results?.length > 0 && (
              <>
                <section className="pipeline-results">
                  {/* LÉXICO CARD */}
                  <div className="pipeline-card pink-card">
                    <div className="card-header">
                      <div className="header-title">
                        <span className="step-num">01 LÉXICO</span>
                        <span className="status-badge success">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Completado
                        </span>
                      </div>
                      <div className="step-desc">Tokens y Etiquetas (POS)</div>
                    </div>
                    
                    <div className="card-body">
                      <div className="corrections-list">
                        {resultData.stanza.results[0].tokens.map((token, i) => (
                          <div key={i} className="correction-row-full" style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
                            <div className="token-info">
                              <span className="good-token" style={{fontWeight: 'bold', fontSize: '14px', width: '120px', display: 'inline-block'}}>{token.text}</span>
                              <span className="error-type-badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>{token.pos}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      Motor: Stanford CoreNLP (Stanza)
                    </div>
                  </div>

                  <div className="arrow-divider"><svg width="24" height="24" viewBox="0 0 24 24" fill="#cbd5e1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>

                  {/* SINTÁCTICO CARD */}
                  <div className="pipeline-card blue-card">
                    <div className="card-header">
                      <div className="header-title">
                        <span className="step-num">02 SINTÁCTICO</span>
                        <span className="status-badge success">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Completado
                        </span>
                      </div>
                      <div className="step-desc">Dependencias Universales & Árbol Constituyente</div>
                    </div>
                    
                    <div className="card-body" style={{ overflowX: 'auto' }}>
                      <div className="section-label">Dependencias (DepRel):</div>
                      <div className="corrections-list" style={{marginBottom: '1rem'}}>
                        {resultData.stanza.results[0].tokens.map((token, i) => (
                          <div key={i} className="correction-row-full" style={{ padding: '6px' }}>
                            <span style={{width: '100px', display: 'inline-block'}}>{token.text}</span> 
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            <span style={{color: 'var(--secondary)', fontWeight: 'bold', marginLeft: '10px'}}>{token.deprel}</span>
                            <span style={{color: '#64748b', fontSize: '12px', marginLeft: '10px'}}>Head: {token.head}</span>
                          </div>
                        ))}
                      </div>

                      <div className="section-label">Árbol Sintáctico (Stanza):</div>
                      <div className="tree-box" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
                        {resultData.stanza.results[0].tree}
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      Actividad 2 Completada
                    </div>
                  </div>

                  <div className="arrow-divider"><svg width="24" height="24" viewBox="0 0 24 24" fill="#cbd5e1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>

                  {/* SEMÁNTICO CARD */}
                  <div className="pipeline-card green-card">
                    <div className="card-header">
                      <div className="header-title">
                        <span className="step-num">03 SEMÁNTICO</span>
                        <span className="status-badge success">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Completado
                        </span>
                      </div>
                      <div className="step-desc">Clasificación & Elementos</div>
                    </div>
                    
                    <div className="card-body">
                      {/* Elementos Oración Simple (Actividad 3) */}
                      <div className="section-label">Componentes de Oración:</div>
                      <div style={{ backgroundColor: 'var(--bg-light)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
                        <p style={{ margin: '5px 0' }}><strong>Sujeto:</strong> <span style={{color: 'var(--success)'}}>{resultData.stanza.results[0].sujeto}</span></p>
                        <p style={{ margin: '5px 0' }}><strong>Verbo Principal:</strong> <span style={{color: 'var(--success)'}}>{resultData.stanza.results[0].verbo}</span></p>
                        <p style={{ margin: '5px 0' }}><strong>Objeto Directo:</strong> <span style={{color: 'var(--success)'}}>{resultData.stanza.results[0].objeto}</span></p>
                      </div>

                      {/* Clasificación (Actividad 5) */}
                      <div className="section-label">Clasificación por Conectores:</div>
                      <div className="solution-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <strong>Tipo: </strong> 
                          <span style={{color: 'var(--primary)'}}>{resultData.classification?.type}</span>
                        </div>
                        <div>
                          <strong>Relación: </strong> 
                          <span className="sol-badge">{resultData.classification?.relation}</span>
                        </div>
                        {resultData.classification?.connector !== 'Ninguno' && (
                          <div>
                            <strong>Conector Identificado: </strong> 
                            <span style={{ fontStyle: 'italic', color: '#64748b' }}>"{resultData.classification?.connector}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      Actividad 3 y 5 Completadas
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {/* COMPARISON TAB */}
        {activeTab === 'comparison' && resultData && (
          <section className="comparison-section" style={{ padding: '20px', animation: 'fadeIn 0.3s ease-out' }}>
            <h2 style={{ marginBottom: '20px', color: 'var(--text-dark)' }}>Actividad 6: Comparación de Herramientas NLP</h2>
            <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-light)', borderRadius: '12px', padding: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Aspecto</th>
                    <th style={{ padding: '12px', color: 'var(--primary)' }}>spaCy</th>
                    <th style={{ padding: '12px', color: 'var(--secondary)' }}>Stanford CoreNLP (Stanza)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>Tiempo de ejecución</td>
                    <td style={{ padding: '12px' }}>{resultData.spacy?.time} seg</td>
                    <td style={{ padding: '12px' }}>{resultData.stanza?.time} seg</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>Precisión POS</td>
                    <td style={{ padding: '12px' }}>{resultData.spacy?.precision_pos}</td>
                    <td style={{ padding: '12px' }}>{resultData.stanza?.precision_pos}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>Árbol sintáctico</td>
                    <td style={{ padding: '12px' }}>{resultData.spacy?.tree_detail}</td>
                    <td style={{ padding: '12px' }}>{resultData.stanza?.tree_detail}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>Dependencias</td>
                    <td style={{ padding: '12px' }}>{resultData.spacy?.deps}</td>
                    <td style={{ padding: '12px' }}>{resultData.stanza?.deps}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>Facilidad de uso</td>
                    <td style={{ padding: '12px' }}>{resultData.spacy?.ease}</td>
                    <td style={{ padding: '12px' }}>{resultData.stanza?.ease}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>Consumo de memoria</td>
                    <td style={{ padding: '12px' }}>{resultData.spacy?.memory}</td>
                    <td style={{ padding: '12px' }}>{resultData.stanza?.memory}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px', backgroundColor: 'var(--bg-light)', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '10px' }}>Preguntas de Control (Guía):</h3>
              <p><strong>1. ¿Qué diferencias encontró entre spaCy y Stanford CoreNLP?</strong><br/>spaCy es generalmente más rápido y fácil de integrar al no requerir Java, mientras que Stanford CoreNLP ofrece análisis más profundos (como el árbol constituyente completo).</p>
              <p><strong>2. ¿Cuál herramienta genera árboles sintácticos más detallados?</strong><br/>Stanford CoreNLP. Genera un árbol de circunscripción (Constituency Tree) completo detallando nodos frasales (NP, VP, etc), mientras que spaCy por defecto se enfoca solo en el árbol de dependencias de palabras.</p>
              <p><strong>3. ¿Qué ventajas ofrece Stanford CoreNLP para el análisis lingüístico?</strong><br/>Ofrece una cobertura académica mucho mayor (lematización avanzada, resolución de correferencias y múltiples tipos de parsers en más de 60 lenguajes a través de Stanza).</p>
            </div>
          </section>
        )}
        
        <footer className="app-footer">
          <div className="footer-left">
            Tecnología: React + Vite • Flask API • Stanza (CoreNLP) • spaCy
          </div>
          <div className="footer-right">
            Práctica 16 - Teoría de Autómatas
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </footer>
      </main>

      {/* MODALS */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{activeModal === 'history' ? 'Historial de Consultas' : 'Acerca del Proyecto'}</h2>
              <button className="close-btn" onClick={() => setActiveModal(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="modal-body">
              {activeModal === 'history' && (
                <div className="history-list">
                  {history.length === 0 ? (
                    <div className="empty-history">No hay consultas anteriores aún.</div>
                  ) : (
                    history.map((h, i) => (
                      <div key={i} className="history-item">
                        <div className="hist-query">{h.query}</div>
                        <div className="hist-details">
                          <span className={h.success ? "success-text" : "error-text"}>{h.solution}</span>
                          <span className="hist-time">{h.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {activeModal === 'about' && (
                <div className="about-content">
                  <h3>Práctica 16: Análisis Léxico, Sintáctico y Semántico (Stanford CoreNLP)</h3>
                  <p><strong>Materia:</strong> Teoría de Autómatas</p>
                  <p>Este sistema implementa el análisis de oraciones usando modelos de PLN reales:</p>
                  <ul>
                    <li><strong>Análisis Léxico:</strong> Tokenización y etiquetado (POS) de cada palabra.</li>
                    <li><strong>Análisis Sintáctico:</strong> Identificación de dependencias y generación de árbol constituyente.</li>
                    <li><strong>Análisis Semántico:</strong> Clasificación de conectores y determinación de oración compuesta.</li>
                  </ul>
                  <p style={{marginTop: '1rem'}}>El frontend envía el requerimiento al backend Flask, el cual utiliza la librería Stanza (wrapper oficial de Stanford CoreNLP para Python) para resolverlo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
