import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

function cors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY not set" });

  try {
    const { empresa, publico, objetivos, desafios, motivacoes, canais } = (req.body ?? {});

    const client = new OpenAI({ apiKey });

    const prompt = `
Você é um gerador de personas. Crie de 3 a 5 personas diferentes e realistas
(usando nomes brasileiros variados, como Carla, João, Francisco, Claiton, Maria),
com base nos dados:

Empresa/Projeto: ${empresa || "-"}
Público-alvo: ${publico || "-"}
Objetivos: ${objetivos || "-"}
Desafios: ${desafios || "-"}
Motivações: ${motivacoes || "-"}
Canais de comunicação: ${canais || "-"}

Formate a saída EXCLUSIVAMENTE como JSON válido:
{
  "personas": [
    {
      "nome": "Carla",
      "descricao": "…",
      "objetivos": ["…","…"],
      "desafios": ["…","…"],
      "motivacoes": ["…","…"],
      "canais": ["…","…"],
      "frase": "…"
    }
  ]
}
Sem texto fora do JSON.
`;

    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.8,
    });

    const text = resp.output_text || "";
    let jsonOut: any = null;
    try {
      jsonOut = JSON.parse(text);
    } catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) {
        jsonOut = JSON.parse(m[0]);
      } else {
        jsonOut = { personas: [] };
      }
    }

    if (!jsonOut || !Array.isArray(jsonOut.personas)) {
      jsonOut = { personas: [] };
    }

    return res.status(200).json(jsonOut);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Falha ao gerar personas" });
  }
}
