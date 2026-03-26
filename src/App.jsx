import { useState } from 'react'
import { Scale, FileText, Shield, Info, ArrowLeft, Gavel, Users, Zap, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Scanner from './components/Scanner'
import Advice from './components/Advice'
import './App.css'

function App() {
  const [view, setView] = useState('home')

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <motion.div 
          className="logo" 
          onClick={() => setView('home')} 
          style={{cursor: 'pointer'}}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Scale className="icon" size={32} />
          <h1>Guia do Cidadão</h1>
        </motion.div>
        <nav>
          <motion.button 
            className="nav-btn"
            onClick={() => setView('about')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Info size={18} /> Sobre
          </motion.button>
        </nav>
      </header>

      <main className="app-main">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <section className="hero">
                <h2>Seus direitos em <br/> português simples.</h2>
                <p>O que você deseja fazer hoje?</p>
                <div className="hero-actions" style={{display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                  <motion.button 
                    className="primary-btn" 
                    onClick={() => setView('scanner')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText size={22} /> Escanear Documento
                  </motion.button>
                  <motion.button 
                    className="primary-btn" 
                    style={{background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', boxShadow: 'none'}}
                    onClick={() => setView('advice')}
                    whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle size={22} /> Tirar Dúvida
                  </motion.button>
                </div>
              </section>

              <section className="features">
                <motion.div className="feature-card" whileHover={{ y: -5 }}>
                  <div className="icon-wrapper">
                    <Shield size={28} />
                  </div>
                  <h3>Proteção Total</h3>
                  <p>Identificamos prazos críticos e valores para garantir que você nunca perca seus direitos por falta de entendimento.</p>
                </motion.div>
                <motion.div className="feature-card" whileHover={{ y: -5 }} transition={{ delay: 0.1 }}>
                  <div className="icon-wrapper">
                    <Zap size={28} />
                  </div>
                  <h3>Resposta Instantânea</h3>
                  <p>Nossa IA analisa documentos complexos em segundos, extraindo a essência jurídica de forma clara e objetiva.</p>
                </motion.div>
                <motion.div className="feature-card" whileHover={{ y: -5 }} transition={{ delay: 0.2 }}>
                  <div className="icon-wrapper">
                    <Users size={28} />
                  </div>
                  <h3>Democratização</h3>
                  <p>O conhecimento jurídico deve ser para todos. Traduzimos o 'juridiquês' para a linguagem do dia a dia.</p>
                </motion.div>
              </section>
            </motion.div>
          )}

          {view === 'about' && (
            <motion.div
              key="about"
              className="app-view about-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button className="back-btn" onClick={() => setView('home')}>
                <ArrowLeft size={18} /> Voltar para o início
              </button>
              <div className="about-content">
                <h2>Nossa Missão</h2>
                <p>O <strong>Guia do Cidadão</strong> nasceu para democratizar o acesso à justiça no Brasil. Sabemos que o sistema jurídico pode ser uma barreira invisível para quem não entende suas complexidades. <br/><br/>Utilizamos uma <strong>complexa rede de inteligência artificial treinada para auxiliar</strong>, traduzindo documentos burocráticos em orientações simples, humanas e acolhedoras.</p>
                
                <div className="privacy-card">
                  <div className="icon-wrapper">
                    <Shield size={32} />
                  </div>
                  <h3>Sua Privacidade é Nossa Prioridade</h3>
                  <p>Como padrão fundamental de segurança, <strong>todos os documentos enviados são apagados permanentemente do nosso sistema a cada 24 horas.</strong> Não armazenamos dados para histórico ou treinamento.</p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'scanner' && (
            <motion.div
              key="scanner"
              className="app-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button className="back-btn" onClick={() => setView('home')}>
                <ArrowLeft size={18} /> Voltar
              </button>
              <Scanner />
            </motion.div>
          )}

          {view === 'advice' && (
            <motion.div
              key="advice"
              className="app-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button className="back-btn" onClick={() => setView('home')}>
                <ArrowLeft size={18} /> Voltar
              </button>
              <Advice />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Guia do Cidadão &bull; IA de Impacto Social para Democratização Jurídica</p>
      </footer>
    </div>
  )
}

export default App
