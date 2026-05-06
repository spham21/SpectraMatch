import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.21.0'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    console.log('--- Edge Function Started ---')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const geminiKey = Deno.env.get('GEMINI_API_KEY')

    console.log('Environment Check:', { 
      url: !!supabaseUrl, 
      key: !!serviceKey, 
      gemini: !!geminiKey 
    })

    if (!supabaseUrl || !serviceKey || !geminiKey) {
      throw new Error('Missing environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY.')
    }

    const supabase = createClient(supabaseUrl, serviceKey)
    let user: any = null

    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      try {
        const userToken = authHeader.replace('Bearer ', '')
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(userToken)
        if (!authError && authUser) user = authUser
      } catch (e) {
        console.warn('Auth check failed:', e.message)
      }
    }

    const { sessionId, answers, anonymousUserId } = await req.json()
    const targetUserId = user?.id || anonymousUserId

    console.log('User Identity:', { targetUserId, isAuth: !!user })

    if (!targetUserId) throw new Error('No valid user identity provided')

    // 1. Scoring Logic
    const byDimension: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] }
    for (const a of answers) {
      const dim = a.questionId.split('-')[0]
      if (dim in byDimension) byDimension[dim].push(a.score)
    }

    const scores: any = {}
    for (const [dim, vals] of Object.entries(byDimension)) {
      const sum = vals.reduce((a, b) => a + b, 0)
      const min = 15, max = 105
      const normalized = ((sum - min) / (max - min)) * 100
      scores[dim] = Math.round(normalized)
    }

    const mbtiType = [
      scores.EI >= 50 ? 'E' : 'I',
      scores.SN >= 50 ? 'N' : 'S',
      scores.TF >= 50 ? 'F' : 'T',
      scores.JP >= 50 ? 'P' : 'J'
    ].join('')

    // 2. Fetch Research Dictionary & Context
    const { data: dictionary } = await supabase
      .from('research_dictionary')
      .select('content')
      .eq('key', 'interaction_dictionary_v1')
      .single()

    const researchContext = dictionary?.content 
      ? `Use this Interaction Dictionary for deep insights: ${JSON.stringify(dictionary.content)}`
      : ''

    // 3. AI Generation
    const genAI = new GoogleGenerativeAI(geminiKey)
    
    // Model Discovery List (Prioritizing Flash for high quota on free tier)
    const MODEL_ALIASES = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash']
    let activeModel: any = null
    let modelError: string = ''

    // Try to find a working model on the v1 API by actually "pinging" it
    for (const alias of MODEL_ALIASES) {
      try {
        console.log(`Testing quota for: ${alias}...`)
        const testModel = genAI.getGenerativeModel({ model: alias }, { apiVersion: 'v1' })
        // Verifying access with a tiny metadata call
        await testModel.countTokens("test")
        activeModel = testModel
        console.log(`Successfully verified: ${alias}`)
        break 
      } catch (e) {
        console.warn(`Model ${alias} quota/access check failed:`, e.message)
        modelError = e.message
      }
    }

    if (!activeModel) {
      throw new Error(`AI Access Denied. Google says: ${modelError}. Please check your AI Studio quota.`)
    }

    const generationConfig = {
      temperature: 0.7, // Increased for more fluid, natural language synthesis
      topP: 0.95,
    }

    const { data: prompts } = await supabase.from('excerpt_prompts').select('*').eq('is_active', true)
    const { data: compatData } = await supabase.from('compatibility_map').select('*').eq('mbti_type', mbtiType).single()

    const personalityPrompt = prompts?.find(p => p.prompt_type === 'personality' && p.mbti_type === mbtiType)
    const compatibilityPrompt = prompts?.find(p => p.prompt_type === 'compatibility')

    let personalityExcerpt = '', compatibilityExcerpt = ''

    // Strict Grounding & Human Translation Instructions
    const groundingInstructions = `
      CRITICAL INSTRUCTIONS:
      1. You are a SYNTHESIS ENGINE & HUMAN INTERPRETER. 
      2. ALL insights must be derived STRICTLY from the provided "Interaction Dictionary" and "Research Context".
      3. HUMAN TRANSLATION PROTOCOL: Do not use technical jargon or academic terms (e.g., avoid "Cognitive Friction" or "SN dimension"). 
      4. Instead, INTERPRET these mechanisms into everyday life scenarios. 
         - Example: If the dictionary mentions "S/N friction", explain it as a difference between someone who loves the concrete details of a shared meal vs. someone who is excited by the abstract conversation and future dreams.
      5. Focus on how these traits manifest in dating, home life, and communication.
      6. Use sophisticated, fluid, and natural language. The tone should feel like a wise, observant mentor, not a data report.
    `

    // Robust Research Summary to ground the AI
    const researchSummary = `
      RESEARCH CONTEXT (PRIMARY SOURCE):
      - Compatibility is a dynamic "mechanism of interaction", not a destination.
      - "Cognitive Friction" is the predictable tension when distinct processing systems collide.
      - Lifecycle factors: Midlife similarity in Conscientiousness/Extraversion leads to "Performance Domain Conflict".
    `

    if (!personalityPrompt || !compatibilityPrompt) {
      console.error('Missing active prompts in excerpt_prompts table')
      throw new Error('System configuration error: Excerpt prompts not found.')
    }

    personalityExcerpt = `As an ${mbtiType}, your spectral signature shows a unique alignment of energy.`
    compatibilityExcerpt = `In relationships, you seek a connection that resonates with your core values.`

    try {
      console.log(`Generating with discovered model...`)
      if (personalityPrompt) {
        const result = await activeModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: `${personalityPrompt.system_prompt}\n\n${groundingInstructions}\n\nDATABASE CONTEXT:\n${researchContext}\n\n${researchSummary}\n\nUser Profile: Type ${mbtiType}, Scores: ${JSON.stringify(scores)}. Synthesize a deep analysis using ONLY the provided dictionary mechanisms.` }] }],
          generationConfig
        })
        personalityExcerpt = result.response.text()
      }

      if (compatibilityPrompt && compatData) {
        const result = await activeModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: `${compatibilityPrompt.system_prompt}\n\n${groundingInstructions}\n\nDATABASE CONTEXT:\n${researchContext}\n\n${researchSummary}\n\nUser Profile: Type ${mbtiType}, Matches: ${compatData.compatible_types.join(', ')}. Synthesize the chemistry rationale using ONLY the dictionary's interaction mechanisms and translation protocols.` }] }],
          generationConfig
        })
        compatibilityExcerpt = result.response.text()
      }
    } catch (genErr: any) {
      console.error('AI Generation Failed:', genErr.message)
      personalityExcerpt = `AI Generation Error: ${genErr.message}.`
      compatibilityExcerpt = `AI Generation Error.`
    }

    // 4. Save results
    await supabase.from('personality_profiles').update({ is_current: false }).eq('user_id', targetUserId)
    
    const { data: profile, error: saveError } = await supabase.from('personality_profiles').insert({
      user_id: targetUserId,
      mbti_type: mbtiType,
      ei_score: scores.EI, sn_score: scores.SN, tf_score: scores.TF, jp_score: scores.JP,
      personality_excerpt: personalityExcerpt,
      compatibility_excerpt: compatibilityExcerpt,
      is_current: true
    }).select().single()

    if (saveError) {
      console.error('Error saving personality profile:', saveError)
      throw new Error(`Database error: ${saveError.message}`)
    }

    return new Response(JSON.stringify({ mbtiType, scores, profileId: profile?.id }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    console.error('Edge Function Crash:', err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    })
  }
})
