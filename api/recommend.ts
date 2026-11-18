import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables from .env.local or .env for local testing
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

type Product = {
  id: string
  name: string
  category: string
  gender: string
  price: number
  color: string
  tags: string[]
  description: string
}

// Safely load products across all Node.js versions and bundling environments
function loadProducts(): Product[] {
  const cwd = process.cwd()
  const metaDir = typeof import.meta.dirname === 'string' ? import.meta.dirname : ''
  const possiblePaths = [
    path.resolve(cwd, 'src/data/products.json'),
    metaDir ? path.resolve(metaDir, '../src/data/products.json') : '',
    metaDir ? path.resolve(metaDir, './products.json') : '',
  ].filter(Boolean)

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf-8'))
      } catch (e) {
        console.error('Error parsing products.json at', p, e)
      }
    }
  }
  return []
}

const products: Product[] = loadProducts()

// Lightweight summary for AI prompt to optimize token usage & latency
const catalogSummary = products.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  gender: p.gender,
  price: p.price,
  color: p.color,
  tags: p.tags,
  desc: (p.description || '').slice(0, 100),
}))

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
  }

  const query = body?.query?.trim()
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' })
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured. Please add it to .env.local or Vercel Environment Variables.',
    })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const systemInstruction = `You are Wrecz, an expert Nike AI stylist and shopping assistant.
Given the product list and user preference, select 2 to 4 matching product IDs.

STRICT RULES:
1. Strict Budget: If the user mentions a price ceiling (e.g. "under $80", "less than 50", "< 100"), you MUST ONLY select products where price is less than or equal to that amount.
2. Category & Demographics: Match requested apparel types (shoes, hoodies, shorts, tops, jerseys, etc.) and gender/demographics (Men, Women, Kids, Unisex).
3. Valid IDs Only: You must ONLY return product IDs present in the provided catalogue (e.g. "nike-1", "nike-14").
4. Response Format: Return strictly JSON adhering to this schema:
{
  "recommendedIds": ["nike-1", "nike-2"],
  "note": "1-2 sentence friendly stylist explanation of why these items match the request."
}`

    const userPrompt = `Catalogue:\n${JSON.stringify(catalogSummary)}\n\nUser query: "${query}"`

    // Try gemini-3.5-flash-lite (fastest and most stable), then 3.5-flash, then 3.8-flash
    let response
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash']
    let lastErr: any = null

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction,
            temperature: 0.2,
          },
        })
        if (response?.text) break
      } catch (err) {
        lastErr = err
      }
    }

    if (!response?.text) {
      throw lastErr || new Error('No response from Gemini models')
    }

    const rawText = response.text
    const result = JSON.parse(rawText)

    // Validate returned IDs exist in catalog
    const validIds = (result.recommendedIds || []).filter((id: string) => products.some((p) => p.id === id))

    return res.status(200).json({
      recommendedIds: validIds,
      note: result.note || 'Here are your personalized picks from Wrecz.',
    })
  } catch (error: any) {
    console.error('Gemini Recommendation Error:', error)
    return res.status(500).json({
      error: error.message || 'Failed to generate recommendations from Gemini.',
    })
  }
}
