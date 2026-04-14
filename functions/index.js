const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const mammoth = require("mammoth");

admin.initializeApp();

async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Retry on 429 (Rate Limit) or 5xx (Server Error)
      if (response.status === 429 || (response.status >= 500 && response.status <= 599)) {
        console.warn(`Gemini API returned ${response.status}. Attempt ${attempt + 1} of ${maxRetries}. Retrying in background...`);
        
        if (attempt < maxRetries - 1) {
          // Exponential backoff: 1s, 2s, 4s... plus some jitter
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      return response;
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, error.message);
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}


// Define the secret
const geminiApiKey = defineSecret("GEMINI_API_KEY");

// Prompts are hidden here in the backend
const DOCUMENT_PROMPT = `Analise o documento em anexo. 
Atue como o 'Guia do Cidadão'. 
Sua missão é ler documentos jurídicos brasileiros e extrair a essência para quem não entende de leis.
- Se houver prazos, destaque-os primeiro.
- Não use termos como 'supra-citado', 'outrossim' ou 'vênia'.
- Use termos como 'O juiz chamou', 'Você perdeu o prazo', 'Estão te cobrando'.
- Responda em formato JSON com os seguintes campos:
  - resumo: (Explicação simples do que é o documento)
  - prazos: (Quais os prazos fatais identificados)
  - valores: (Valores em jogo, multas ou cobranças)
  - acao: (O que o usuário deve fazer agora)
  - proximo_passo: (Dica de Defensoria ou Juizado)
  - embasamento_legal: (Citação das leis e artigos brasileiros que fundamentam esta análise. Se não houver fundamentação legal clara no Direito Brasileiro atual, retorne este campo vazio. NUNCA invente leis ou normas.)`;

const ADVICE_PROMPT = (text) => `Atue como o 'Guia do Cidadão'. 
O usuário descreveu a seguinte situação: "${text}"
Analise se há direitos que podem ser buscados na justiça ou via advogados.
- Use linguagem simples e acolhedora.
- Explique se a pessoa tem realmente um direito (possibilidade jurídica).
- Sugira se o caso é para Defensoria Pública, Juizado Civil ou Advogado Particular.
- Importante: Sua resposta tem caráter meramente informativo e educacional.
- Responda em formato JSON com os seguintes campos:
  - analise: (Explicação simples se há direito ou não)
  - recomendacao: (O que fazer: procurar advogado, defensoria, etc)
  - probabilidade: (Baixa, Média ou Alta de sucesso baseado no relato)
  - proximo_passo: (Ação imediata recomendada)
  - embasamento_legal: (Qual lei, artigo ou código do ordenamento jurídico brasileiro se aplica. Se a situação for inconclusiva ou não tiver fundamentação explícita, retorne este campo vazio. NUNCA invente nomes de leis.)`;

exports.analyzeDocument = onRequest({ 
  secrets: [geminiApiKey],
  memory: "512MiB",
  region: "us-central1",
  cors: ['https://leosdc.github.io', 'http://localhost:5173']
}, async (req, res) => {
  console.log("Analyze request received. Method:", req.method);

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const { imageBase64, fileBase64, mimeType, userText, textOnly } = req.body;
    
    // Whitelist de tipos permitidos para segurança
    const ALLOWED_MIME_TYPES = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!textOnly && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      console.warn("Unauthorized mimeType attempt:", mimeType);
      return res.status(400).json({ error: "Tipo de arquivo não permitido." });
    }

    const finalData = fileBase64 || imageBase64;
    
    let API_KEY;
    try {
      API_KEY = geminiApiKey.value();
    } catch (e) {
      console.error("FATAL ERROR: Secret GEMINI_API_KEY is not configured or not accessible.", e);
      return res.status(500).json({ error: "API Key Error", details: "Check Secret Manager configuration." });
    }

    const MODEL_NAME = "gemini-2.0-flash";

    let contents = [];
    if (textOnly) {
      contents = [{ parts: [{ text: ADVICE_PROMPT(userText) }] }];
    } else {
      let documentContent;
      
      // Handle different types for better stability
      if (mimeType.includes("wordprocessingml") || mimeType.includes("msword")) {
        // Extract text from DOCX
        const buffer = Buffer.from(finalData, 'base64');
        const result = await mammoth.extractRawText({ buffer });
        documentContent = { text: `${DOCUMENT_PROMPT}\n\nCONTEÚDO DO DOCUMENTO (DOCX):\n${result.value}` };
      } else if (mimeType === "text/plain") {
        // Handle TXT directly as text
        const text = Buffer.from(finalData, 'base64').toString('utf8');
        documentContent = { text: `${DOCUMENT_PROMPT}\n\nCONTEÚDO DO DOCUMENTO (TXT):\n${text}` };
      } else {
        // Handle PDF and Images via inline_data
        documentContent = [
          { text: DOCUMENT_PROMPT },
          { inline_data: { mime_type: mimeType, data: finalData } }
        ];
      }

      contents = [{
        parts: Array.isArray(documentContent) ? documentContent : [documentContent]
      }];
    }

    const apiResponse = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents,
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("Gemini API Error Response:", errorText);
        return res.status(apiResponse.status).send(errorText);
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});
