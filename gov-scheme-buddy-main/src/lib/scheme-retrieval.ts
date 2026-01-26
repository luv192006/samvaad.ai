import { supabase } from "@/integrations/supabase/client";
import type { SchemeData } from "./eligibility-engine";

/**
 * Retrieve all government schemes from database
 */
export async function getAllSchemes(): Promise<SchemeData[]> {
  const { data, error } = await supabase
    .from('government_schemes')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching schemes:', error);
    return [];
  }
  
  return (data || []).map(scheme => ({
    id: scheme.id,
    name: scheme.name,
    name_hindi: scheme.name_hindi,
    category: scheme.category,
    scheme_type: scheme.scheme_type,
    state: scheme.state,
    description: scheme.description,
    benefits: scheme.benefits || [],
    eligibility_criteria: scheme.eligibility_criteria as any || {},
    required_documents: scheme.required_documents || [],
    official_website: scheme.official_website,
    application_process: scheme.application_process
  }));
}

/**
 * Retrieve schemes by category
 */
export async function getSchemesByCategory(category: string): Promise<SchemeData[]> {
  const { data, error } = await supabase
    .from('government_schemes')
    .select('*')
    .eq('category', category)
    .order('name');
  
  if (error) {
    console.error('Error fetching schemes by category:', error);
    return [];
  }
  
  return (data || []).map(scheme => ({
    id: scheme.id,
    name: scheme.name,
    name_hindi: scheme.name_hindi,
    category: scheme.category,
    scheme_type: scheme.scheme_type,
    state: scheme.state,
    description: scheme.description,
    benefits: scheme.benefits || [],
    eligibility_criteria: scheme.eligibility_criteria as any || {},
    required_documents: scheme.required_documents || [],
    official_website: scheme.official_website,
    application_process: scheme.application_process
  }));
}

/**
 * Retrieve scheme by ID
 */
export async function getSchemeById(id: string): Promise<SchemeData | null> {
  const { data, error } = await supabase
    .from('government_schemes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error || !data) {
    console.error('Error fetching scheme by ID:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    name_hindi: data.name_hindi,
    category: data.category,
    scheme_type: data.scheme_type,
    state: data.state,
    description: data.description,
    benefits: data.benefits || [],
    eligibility_criteria: data.eligibility_criteria as any || {},
    required_documents: data.required_documents || [],
    official_website: data.official_website,
    application_process: data.application_process
  };
}

/**
 * Search schemes by text query (keyword-based retrieval)
 */
export async function searchSchemesInDB(query: string): Promise<SchemeData[]> {
  // Use ilike for case-insensitive search across multiple fields
  const { data, error } = await supabase
    .from('government_schemes')
    .select('*')
    .or(`name.ilike.%${query}%,name_hindi.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
  
  if (error) {
    console.error('Error searching schemes:', error);
    return [];
  }
  
  return (data || []).map(scheme => ({
    id: scheme.id,
    name: scheme.name,
    name_hindi: scheme.name_hindi,
    category: scheme.category,
    scheme_type: scheme.scheme_type,
    state: scheme.state,
    description: scheme.description,
    benefits: scheme.benefits || [],
    eligibility_criteria: scheme.eligibility_criteria as any || {},
    required_documents: scheme.required_documents || [],
    official_website: scheme.official_website,
    application_process: scheme.application_process
  }));
}

/**
 * Get schemes relevant to user query using keyword extraction
 */
export async function retrieveRelevantSchemes(userQuery: string): Promise<SchemeData[]> {
  const queryLower = userQuery.toLowerCase();
  
  // Extract keywords for search
  const keywordMappings: Record<string, string[]> = {
    'health': ['health', 'ayushman', 'medical', 'hospital', 'doctor', 'medicine', 'स्वास्थ्य', 'इलाज'],
    'agriculture': ['farmer', 'kisan', 'agriculture', 'farming', 'crop', 'किसान', 'खेती', 'फसल'],
    'housing': ['house', 'home', 'awas', 'housing', 'घर', 'मकान', 'आवास'],
    'pension': ['pension', 'retirement', 'old age', 'senior', 'पेंशन', 'वृद्धा', 'बुजुर्ग'],
    'business': ['business', 'loan', 'mudra', 'entrepreneur', 'shop', 'व्यापार', 'लोन', 'उद्यम'],
    'insurance': ['insurance', 'bima', 'life cover', 'accident', 'बीमा', 'सुरक्षा'],
    'women': ['women', 'mahila', 'lady', 'behna', 'ladli', 'महिला', 'औरत', 'बहन'],
    'food': ['food', 'ration', 'anna', 'grain', 'राशन', 'अनाज', 'खाना'],
    'welfare': ['lpg', 'gas', 'ujjwala', 'cooking', 'cylinder', 'गैस', 'सिलेंडर'],
    'savings': ['savings', 'girl child', 'sukanya', 'daughter', 'बेटी', 'बचत'],
    'artisan': ['artisan', 'craftsman', 'vishwakarma', 'handicraft', 'शिल्पी', 'कारीगर']
  };
  
  // Find matching categories
  const matchingCategories: string[] = [];
  for (const [category, keywords] of Object.entries(keywordMappings)) {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      matchingCategories.push(category);
    }
  }
  
  // If specific categories found, filter by them
  if (matchingCategories.length > 0) {
    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .in('category', matchingCategories);
    
    if (!error && data && data.length > 0) {
      return data.map(scheme => ({
        id: scheme.id,
        name: scheme.name,
        name_hindi: scheme.name_hindi,
        category: scheme.category,
        scheme_type: scheme.scheme_type,
        state: scheme.state,
        description: scheme.description,
        benefits: scheme.benefits || [],
        eligibility_criteria: scheme.eligibility_criteria as any || {},
        required_documents: scheme.required_documents || [],
        official_website: scheme.official_website,
        application_process: scheme.application_process
      }));
    }
  }
  
  // Fallback: search by query text
  const searchResults = await searchSchemesInDB(userQuery);
  if (searchResults.length > 0) {
    return searchResults;
  }
  
  // If no specific match, return all schemes for general queries
  return getAllSchemes();
}

/**
 * Format scheme data for LLM context injection
 */
export function formatSchemesForContext(schemes: SchemeData[]): string {
  if (schemes.length === 0) {
    return "No relevant government schemes found in the official database.";
  }
  
  return schemes.map(scheme => `
---
SCHEME: ${scheme.name} ${scheme.name_hindi ? `(${scheme.name_hindi})` : ''}
TYPE: ${scheme.scheme_type === 'central' ? 'Central Government' : `State: ${scheme.state}`}
CATEGORY: ${scheme.category}
DESCRIPTION: ${scheme.description}
BENEFITS:
${scheme.benefits.map(b => `  • ${b}`).join('\n')}
ELIGIBILITY CRITERIA (JSON):
${JSON.stringify(scheme.eligibility_criteria, null, 2)}
REQUIRED DOCUMENTS:
${scheme.required_documents.map(d => `  • ${d}`).join('\n')}
OFFICIAL WEBSITE: ${scheme.official_website || 'Not available'}
APPLICATION PROCESS: ${scheme.application_process || 'Not available'}
---`).join('\n\n');
}
