import { useState } from 'react'
import { MessageSquare, Send, Loader2, Scale, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeSituation } from '../services/gemini'
import './Advice.css'

export default function Advice() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleProcess = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    try {
      const response = await analyzeSituation(text)
      
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
        setError("Não conseguimos analisar seu relato. Tente descrever com mais detalhes.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="advice-container">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="input"
            className="input-section"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="advice-header">
              <MessageSquare size={48} className="icon" />
              <h2>Descreva seu problema</h2>
              <p>Traduza sua dúvida jurídica agora. Nossa IA analisará se existe uma base legal para o seu caso.</p>
            </div>

            <div className="textarea-wrapper">
              <textarea 
                placeholder="Ex: Aluguei um imóvel e o proprietário não quer consertar um vazamento grave..." 
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
              />
              <motion.button 
                className="send-btn" 
                onClick={handleProcess} 
                disabled={!text.trim() || loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <Loader2 className="spin" size={24} /> : <Send size={24} />}
                {loading ? 'Analisando seu relato...' : 'Pedir Orientação Jurídica'}
              </motion.button>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="error-msg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <AlertCircle size={20} /> {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            className="result-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="result-header">
              <Scale size={48} color="#10b981" />
              <h2>Análise do Especialista</h2>
            </div>
            
            <div className="result-grid">
              <motion.div className="result-card important" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <h4>⚖️ Possibilidade Jurídica</h4>
                <p>{result.analise}</p>
              </motion.div>
              
              <motion.div className="result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h4>🎯 Nossa Recomendação</h4>
                <p>{result.recomendacao}</p>
              </motion.div>

              <motion.div className="result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h4>📊 Chance de Êxito</h4>
                <p><strong>{result.probabilidade}</strong></p>
              </motion.div>

              <motion.div className="result-card action" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <h4>💡 O que fazer agora?</h4>
                <p>{result.proximo_passo}</p>
              </motion.div>

              {result.embasamento_legal && (
                <motion.div 
                  className="result-card legal" 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.5 }}
                >
                  <h4>⚖️ Base Legal e Técnica</h4>
                  <p>{result.embasamento_legal}</p>
                </motion.div>
              )}
            </div>

            <div className="legal-disclaimer">
              <AlertCircle size={14} />
              <p>Este conteúdo tem caráter meramente informativo e educacional. Não substitui a consulta a um advogado ou defensor público.</p>
            </div>

            <motion.button 
              className="reset-btn" 
              onClick={() => {setResult(null); setText('')}}
              whileHover={{ x: -5 }}
            >
              ← Descrever outra situação
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
