import { useState } from 'react'
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { analyzeDocument } from '../services/gemini'
import './Scanner.css'

export default function Scanner() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      if (selected.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selected))
      } else {
        setPreview('file') // Flag to show icon
      }
      setResult(null)
      setError(null)
    }
  }

  const handleProcess = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const response = await analyzeDocument(file)
      
      // Robust extraction: find content between first { and last }
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Formato de resposta inválido");
      
      const parsed = JSON.parse(jsonMatch[0]);
      setResult(parsed)
    } catch (err) {
      console.error(err)
      if (err.message?.includes('429')) {
        setError("O servidor está um pouco ocupado. Por favor, aguarde alguns segundos e tente novamente.")
      } else {
        setError("Não conseguimos analisar este documento. Verifique o arquivo e tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="scanner-container">
      {!result ? (
        <div className="upload-section">
          <div className={`drop-zone ${preview ? 'has-preview' : ''}`}>
            {preview ? (
              preview === 'file' ? (
                <div className="file-preview">
                  <FileText size={64} className="icon" />
                  <p>{file.name}</p>
                </div>
              ) : (
                <img src={preview} alt="Preview" className="preview-img" />
              )
            ) : (
              <div className="placeholder">
                <Camera size={48} className="icon" />
                <p>Clique para tirar foto, anexar PDF/DOC ou arraste o documento</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="actions">
            <button 
              className="process-btn" 
              onClick={handleProcess} 
              disabled={!file || loading}
            >
              {loading ? <Loader2 className="spin" /> : <Upload />}
              {loading ? 'Analisando...' : 'Analisar Agora'}
            </button>
          </div>
          {error && <div className="error-msg"><AlertCircle size={18} /> {error}</div>}
        </div>
      ) : (
        <div className="result-section">
          <div className="result-header">
            <CheckCircle2 size={32} color="#10b981" />
            <h2>Análise Concluída</h2>
          </div>
          
          <div className="result-grid">
            <div className="result-card important">
              <h4>🎯 O que é isso?</h4>
              <p>{result.resumo}</p>
            </div>
            
            <div className="result-card urgent">
              <h4>📅 Prazos Fatais</h4>
              <p>{result.prazos}</p>
            </div>

            <div className="result-card">
              <h4>💰 Valores</h4>
              <p>{result.valores}</p>
            </div>

            <div className="result-card action">
              <h4>💡 O que fazer agora?</h4>
              <p>{result.acao}</p>
            </div>

            {result.embasamento_legal && (
              <div className="result-card legal">
                <h4>⚖️ Embasamento Legal</h4>
                <p>{result.embasamento_legal}</p>
              </div>
            )}
          </div>

          <div className="next-steps">
            <p><strong>Dica:</strong> {result.proximo_passo}</p>
          </div>

          <div className="legal-disclaimer">
            <AlertCircle size={14} />
            <p>Este conteúdo tem caráter meramente informativo e educacional. Não substitui a consulta a um advogado ou defensor público.</p>
          </div>

          <button className="reset-btn" onClick={() => {setResult(null); setFile(null); setPreview(null)}}>
            Analisar Outro Documento
          </button>
        </div>
      )}
    </div>
  )
}
