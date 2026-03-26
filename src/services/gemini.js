// Google Gemini 2.5 API Integration Service (Secure Proxy via Cloud Functions)

// Prompts and API Key are SECURELY handled in the backend.
const CLOUD_FUNCTION_URL = "/api"; 

export async function analyzeDocument(imageFile) {
  const base64Data = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => resolve(reader.result.split(',')[1]);
  });

  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileBase64: base64Data,
        mimeType: imageFile.type,
        textOnly: false
      })
    });

    if (!response.ok) {
       const errorData = await response.text();
       throw new Error(`Proxy error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    throw error;
  }
}

export async function analyzeSituation(text) {
  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userText: text,
        textOnly: true
      })
    });

    if (!response.ok) {
       const errorData = await response.text();
       throw new Error(`Proxy error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    throw error;
  }
}


