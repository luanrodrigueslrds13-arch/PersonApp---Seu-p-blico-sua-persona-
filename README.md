# PersonApp — Vercel IA Ready (Frontend + Backend)

## Deploy (Vercel)
1. Faça login em https://vercel.com e clique **Add New → Project**.
2. Importe este projeto (GitHub) **ou** use **Vercel CLI** para subir esta pasta.
3. Vá em **Settings → Environment Variables** e crie:
   - `OPENAI_API_KEY` = **sua chave** da OpenAI (https://platform.openai.com)
4. **Deploy**.

> Endpoint: `/api/generate-persona`.

## Como usar
- Preencha as 6 etapas → **Gerar persona 🤖**.
- A IA retorna 3–5 personas; a primeira abre em tela e todas ficam em **Minhas personas**.
- **Exportar**: PNG e PDF (A4).

## Avatares
- `CONFIG.AVATAR_MODE = "initials"` (iniciais com gradiente, local).
- `"dicebear"` (ilustrado) usa `https://api.dicebear.com/8.x/bottts/svg?seed=Nome`.

## Observações
- A IA real requer internet.
- Os dados salvos ficam no `localStorage` do visitante.
