import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPPORTED_LANGUAGES: Record<string, { name: string; instruction: string }> = {
  en: { name: "English", instruction: "Respond in English." },
  hi: { name: "हिन्दी", instruction: "Respond in Hindi (हिन्दी में जवाब दें)." },
  bn: { name: "বাংলা", instruction: "Respond in Bengali (বাংলায় উত্তর দিন)." },
  ta: { name: "தமிழ்", instruction: "Respond in Tamil (தமிழில் பதிலளிக்கவும்)." },
  te: { name: "తెలుగు", instruction: "Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి)." },
  mr: { name: "मराठी", instruction: "Respond in Marathi (मराठीत उत्तर द्या)." },
  gu: { name: "ગુજરાતી", instruction: "Respond in Gujarati (ગુજરાતીમાં જવાબ આપો)." },
  kn: { name: "ಕನ್ನಡ", instruction: "Respond in Kannada (ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ)." },
  ml: { name: "മലയാളം", instruction: "Respond in Malayalam (മലയാളത്തിൽ മറുപടി നൽകുക)." },
  pa: { name: "ਪੰਜਾਬੀ", instruction: "Respond in Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ)." },
  or: { name: "ଓଡ଼ିଆ", instruction: "Respond in Odia (ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ)." },
  as: { name: "অসমীয়া", instruction: "Respond in Assamese (অসমীয়াত উত্তৰ দিয়ক)." },
};

// Keyword mappings for scheme retrieval
const KEYWORD_MAPPINGS: Record<string, string[]> = {
  'health': ['health', 'ayushman', 'medical', 'hospital', 'doctor', 'medicine', 'स्वास्थ्य', 'इलाज', 'bimar', 'बीमार'],
  'agriculture': ['farmer', 'kisan', 'agriculture', 'farming', 'crop', 'किसान', 'खेती', 'फसल', 'land', 'जमीन'],
  'housing': ['house', 'home', 'awas', 'housing', 'घर', 'मकान', 'आवास', 'ghar', 'room'],
  'pension': ['pension', 'retirement', 'old age', 'senior', 'पेंशन', 'वृद्धा', 'बुजुर्ग', 'budha', 'elderly'],
  'business': ['business', 'loan', 'mudra', 'entrepreneur', 'shop', 'व्यापार', 'लोन', 'उद्यम', 'dukan', 'दुकान'],
  'insurance': ['insurance', 'bima', 'life cover', 'accident', 'बीमा', 'सुरक्षा', 'death', 'मृत्यु'],
  'women': ['women', 'mahila', 'lady', 'behna', 'ladli', 'महिला', 'औरत', 'बहन', 'mother', 'माँ'],
  'food': ['food', 'ration', 'anna', 'grain', 'राशन', 'अनाज', 'खाना', 'wheat', 'rice', 'गेहूं', 'चावल'],
  'welfare': ['lpg', 'gas', 'ujjwala', 'cooking', 'cylinder', 'गैस', 'सिलेंडर', 'chulha'],
  'savings': ['savings', 'girl child', 'sukanya', 'daughter', 'बेटी', 'बचत', 'beti', 'ladki'],
  'artisan': ['artisan', 'craftsman', 'vishwakarma', 'handicraft', 'शिल्पी', 'कारीगर', 'carpenter', 'blacksmith', 'tailor', 'potter']
};

// Extract matching categories from user query
function extractCategories(query: string): string[] {
  const queryLower = query.toLowerCase();
  const matchingCategories: string[] = [];
  
  for (const [category, keywords] of Object.entries(KEYWORD_MAPPINGS)) {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      matchingCategories.push(category);
    }
  }
  
  return matchingCategories;
}

// RAG System Prompt - Strict grounding to retrieved data
const getRAGSystemPrompt = (language: string, retrievedSchemes: string, userProfileContext: string) => {
  const langInstruction = SUPPORTED_LANGUAGES[language]?.instruction || SUPPORTED_LANGUAGES.en.instruction;
  
  return `You are "SAMVAAD AI" (संवाद AI), an official AI assistant for Indian Government schemes.

${langInstruction}

🚨 CRITICAL RAG INSTRUCTIONS - YOU MUST FOLLOW THESE STRICTLY:

1. **DATA GROUNDING**: You MUST answer ONLY using the scheme data provided below. DO NOT use your general knowledge about government schemes.

2. **NO HALLUCINATION**: If information is not present in the retrieved scheme data, respond with:
   "This information is not available in official government records. Please visit the official portal or contact your nearest government office."

3. **ACCURACY OVER CREATIVITY**: Never invent eligibility rules, benefits, or document requirements. Only state what is explicitly provided in the context.

4. **ELIGIBILITY DECISIONS**: The eligibility check has already been performed by the system. Your job is to:
   - EXPLAIN the eligibility result clearly
   - List the benefits if eligible
   - Provide document requirements
   - Give application guidance
   - NEVER make up eligibility criteria

5. **RESPONSE FORMAT**: For each scheme mentioned, always provide:
   ✅ Eligibility Status (based on system check, not your judgment)
   📋 Required Documents (EXACTLY as listed in the data)
   💰 Benefits (EXACTLY as listed in the data)
   🔗 Official Website (EXACTLY as provided)
   📝 Application Process (EXACTLY as provided)

6. **SOURCE CITATION**: Always mention "Source: Official Government Portal" and provide the official_website URL from the scheme data.

7. **DOCUMENT LIST**: After explaining any scheme, ALWAYS provide the complete list of required documents in this format:
   📋 **आवश्यक दस्तावेज़ / Required Documents:**
   1. [Document] - [Brief description if needed]
   2. ...

============= RETRIEVED GOVERNMENT SCHEME DATA =============
${retrievedSchemes}
============= END OF RETRIEVED DATA =============

${userProfileContext ? `
============= USER PROFILE CONTEXT =============
${userProfileContext}
============= END OF USER PROFILE =============
` : ''}

REMEMBER: If the user asks about a scheme NOT in the retrieved data above, say:
"I don't have verified information about this scheme in my official database. Please check the official government portal at india.gov.in for accurate information."

Communication guidelines:
- Be respectful and use simple language
- Format responses clearly with bullet points
- Always cite official sources
- Be patient with all users
- Use appropriate emojis sparingly`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = "en", userProfile } = await req.json();
    const Samvaad_API_KEY = Deno.env.get("Samvaad_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!Samvaad_API_KEY) {
      throw new Error("Samvaad_API_KEY is not configured");
    }

    // Initialize Supabase client for retrieval
    const supabase = createClient(
      SUPABASE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Get the latest user message for retrieval
    const lastUserMessage = messages
      .filter((m: any) => m.role === 'user')
      .pop()?.content || '';

    // STEP 1: RETRIEVAL - Get relevant schemes based on user query
    const matchingCategories = extractCategories(lastUserMessage);
    
    let retrievedSchemes: any[] = [];
    
    if (matchingCategories.length > 0) {
      // Query by matching categories
      const { data, error } = await supabase
        .from('government_schemes')
        .select('*')
        .in('category', matchingCategories);
      
      if (!error && data) {
        retrievedSchemes = data;
      }
    }
    
    // If no category match, do text search
    if (retrievedSchemes.length === 0) {
      const searchTerms = lastUserMessage.split(/\s+/).filter((t: string) => t.length > 3).slice(0, 3);
      
      for (const term of searchTerms) {
        const { data, error } = await supabase
          .from('government_schemes')
          .select('*')
          .or(`name.ilike.%${term}%,name_hindi.ilike.%${term}%,description.ilike.%${term}%`);
        
        if (!error && data) {
          retrievedSchemes = [...retrievedSchemes, ...data];
        }
      }
      
      // Remove duplicates
      retrievedSchemes = retrievedSchemes.filter((scheme, index, self) =>
        index === self.findIndex(s => s.id === scheme.id)
      );
    }
    
    // If still no match, get top 5 most popular schemes
    if (retrievedSchemes.length === 0) {
      const { data, error } = await supabase
        .from('government_schemes')
        .select('*')
        .limit(5);
      
      if (!error && data) {
        retrievedSchemes = data;
      }
    }

    // STEP 2: FORMAT RETRIEVED DATA FOR CONTEXT INJECTION
    const formattedSchemes = retrievedSchemes.map(scheme => `
---
SCHEME NAME: ${scheme.name} ${scheme.name_hindi ? `(${scheme.name_hindi})` : ''}
SCHEME TYPE: ${scheme.scheme_type === 'central' ? 'Central Government Scheme' : `State Scheme - ${scheme.state}`}
CATEGORY: ${scheme.category}
DESCRIPTION: ${scheme.description}

BENEFITS:
${(scheme.benefits || []).map((b: string) => `  • ${b}`).join('\n')}

ELIGIBILITY CRITERIA (Official Rules):
${JSON.stringify(scheme.eligibility_criteria, null, 2)}

REQUIRED DOCUMENTS (Complete List):
${(scheme.required_documents || []).map((d: string, i: number) => `  ${i + 1}. ${d}`).join('\n')}

OFFICIAL WEBSITE: ${scheme.official_website || 'Not available'}
APPLICATION PROCESS: ${scheme.application_process || 'Contact nearest government office'}
---`).join('\n\n');

    // Format user profile if provided
    const userProfileContext = userProfile ? `
User Details:
- Age: ${userProfile.age || 'Not provided'}
- Gender: ${userProfile.gender || 'Not provided'}
- State: ${userProfile.state || 'Not provided'}
- Annual Income: ${userProfile.annualIncome ? `₹${userProfile.annualIncome}` : 'Not provided'}
- Category: ${userProfile.category?.join(', ') || 'Not provided'}
- Occupation: ${userProfile.isFarmer ? 'Farmer' : userProfile.isBusinessOwner ? 'Business Owner' : userProfile.isTraditionalArtisan ? 'Artisan' : 'Not specified'}
` : '';

    // STEP 3: GENERATION with RAG context
    const systemPrompt = getRAGSystemPrompt(language, formattedSchemes, userProfileContext);

    const response = await fetch("https://ai.gateway.Samvaad.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Samvaad_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
