# 📄 Projeto: Guia do Cidadão (IA de Impacto Social)
**Escopo Técnico e Funcional para Desenvolvimento com Gemini 2.5 & Firebase**

---

## 💡 Visão Geral
Um aplicativo focado em democratizar o acesso à justiça no Brasil, traduzindo documentos jurídicos complexos em orientações simples e gerando documentos de defesa para pessoas de baixa renda.

## 🛠️ Stack Tecnológica
* **IA:** Gemini 2.5 Pro (Google AI API) - Selecionado pela alta capacidade de raciocínio e visão computacional.
* **Backend:** Firebase Cloud Functions (Node.js/Python).
* **Banco de Dados:** Cloud Firestore.
* **Storage:** Firebase Storage (para documentos e imagens).
* **Auth:** Firebase Authentication (Login por Telefone/SMS e Google).
* **Frontend:** Flutter ou React Native.

---

## 📋 Funcionalidades do MVP (Mínimo Produto Viável)

### 1. Módulo de Visão (Scanner de Direitos)
* **Input:** Foto de documento (multa, intimação, contrato, negativa de plano de saúde).
* **Processamento:** A Gemini 2.5 analisa a imagem, extrai o texto e identifica:
    * **Prazo Fatal:** Quantos dias o usuário ainda tem.
    * **Valor em Jogo:** Se houver multa ou cobrança.
    * **Tradução:** Explicação em português simples (nível fundamental).
* **Output:** Card resumido com "O que é isso?" e "O que eu faço agora?".

### 2. Gerador de Respostas Jurídicas
* **Interatividade:** A IA faz perguntas simples ao usuário (pode ser por voz) para entender o contexto.
* **Ação:** Geração de um PDF formatado (ex: Recurso de Multa, Pedido de Reconsideração ao SUS, Notificação de Cobrança Indevida).
* **Próximo Passo:** Indicação da Defensoria Pública ou Juizado Especial mais próximo via Geolocalização.

---

## 🏗️ Arquitetura do Sistema

1.  **Frontend:** Captura imagem -> Envia para `Firebase Storage`.
2.  **Trigger:** `Cloud Function` detecta novo arquivo.
3.  **Análise:**
    * A função chama a **Gemini 2.5 API**.
    * *System Instruction:* "Você é um assistente social e jurídico. Analise o documento em anexo. Extraia prazos, valores e explique para um leigo de forma acolhedora."
4.  **Notificação:** O resultado é salvo no `Firestore` e o usuário recebe um Push via `Firebase Cloud Messaging`.

---

## 📑 Configuração da IA (System Prompt Sugerido)

```text
Atue como o 'Guia do Cidadão'. 
Sua missão é ler documentos jurídicos brasileiros e extrair a essência para quem não entende de leis.
- Se houver prazos, destaque-os primeiro.
- Não use termos como 'supra-citado', 'outrossim' ou 'vênia'.
- Use termos como 'O juiz chamou', 'Você perdeu o prazo', 'Estão te cobrando'.
- Ao final, sugira sempre se o caso é para Defensoria Pública ou Juizado de Pequenas Causas.