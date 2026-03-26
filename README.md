# Guia do Cidadão ⚖️

Sua missão é ler documentos jurídicos brasileiros e extrair a essência para quem não entende de leis. O **Guia do Cidadão** utiliza Inteligência Artificial (Gemini 2.0 Flash) para traduzir o "juridiquês" em linguagem simples, humana e direta.

## 🚀 Funcionalidades

- **Análise de Documentos:** Envie PDFs, DOCX ou fotos de processos e receba um resumo simplificado.
- **Destaque de Prazos:** Identifica automaticamente datas críticas e o que elas significam.
- **Aconselhamento Simples:** Explica se você tem um direito e qual o próximo passo recomendado (Defensoria, Juizado, etc).
- **Foco em Acessibilidade:** Linguagem sem termos técnicos difíceis.

## 🛠️ Tecnologias

- **Frontend:** React + Vite
- **Backend:** Firebase Cloud Functions (Node.js)
- **IA:** Google Gemini 2.0 Flash
- **Hospedagem:** Firebase Hosting
- **Banco de Dados/Storage:** Firestore & Firebase Storage

## 📦 Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Leosdc/Guia-do-Cidadao.git
   cd Guia-do-Cidadao
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Configure as variáveis de ambiente:**
   - Copie o arquivo `.env.example` para `.env.local`.
   - Preencha com suas credenciais do Firebase.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🔒 Segurança e Governança

Este projeto segue boas práticas de segurança:
- Chaves de API de IA são gerenciadas via **Google Cloud Secret Manager**.
- Validação de arquivos no backend (MimeType Whitelist).
- Firebase Security Rules configuradas para acesso autenticado.

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---
*Desenvolvido com foco na democratização do acesso à justiça.*
