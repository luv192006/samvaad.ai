// Rule-based eligibility engine for government schemes
// This engine performs deterministic eligibility checks - NOT the LLM

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  annualIncome?: number;
  state?: string;
  category?: string[]; // sc, st, obc, general, bpl, etc.
  isMarried?: boolean;
  isFarmer?: boolean;
  landHoldingHectares?: number;
  hasBankAccount?: boolean;
  isIncomeTaxPayer?: boolean;
  isGovernmentEmployee?: boolean;
  hasRationCard?: string; // aay, phh, etc.
  isUrbanResident?: boolean;
  isRuralResident?: boolean;
  hasPuccaHouse?: boolean;
  isBusinessOwner?: boolean;
  isTraditionalArtisan?: boolean;
  trade?: string;
  childGender?: 'female' | 'male';
  childAge?: number;
}

export interface EligibilityCriteria {
  age?: { min?: number; max?: number };
  gender?: string;
  income?: { max?: number; annual_max?: number; ews_max?: number; lig_max?: number; mig1_max?: number; mig2_max?: number };
  annual_family_income?: { max?: number };
  state?: string | string[];
  category?: string[];
  excluded?: string[];
  farmer?: boolean;
  land_holding?: { max_hectares?: number };
  bank_account?: boolean;
  not_income_tax_payer?: boolean;
  not_government_employee?: boolean;
  ration_card?: string[];
  nfsa_beneficiary?: boolean;
  urban_resident?: boolean;
  rural_resident?: boolean;
  no_pucca_house?: boolean;
  business_owner?: boolean;
  traditional_artisan?: boolean;
  trade?: string[];
  married?: boolean;
  beneficiary_gender?: string;
  beneficiary_age?: { max?: number; min?: number };
  parent_guardian?: boolean;
  first_time_entrepreneur?: boolean;
  enterprise_type?: string;
  family_registration?: boolean;
  kyc_compliant?: boolean;
  non_corporate?: boolean;
  non_farm_sector?: boolean;
  manufacturing_trading_services?: boolean;
}

export interface EligibilityResult {
  isEligible: boolean;
  matchedCriteria: string[];
  failedCriteria: string[];
  partialMatch: boolean;
  confidenceScore: number; // 0-100
  eligibilityDetails: string;
}

export interface SchemeData {
  id: string;
  name: string;
  name_hindi?: string;
  category: string;
  scheme_type: string;
  state?: string;
  description: string;
  benefits: string[];
  eligibility_criteria: EligibilityCriteria;
  required_documents: string[];
  official_website?: string;
  application_process?: string;
}

/**
 * Check eligibility for a specific scheme based on user profile
 * This is a DETERMINISTIC rule-based check - NO LLM involvement
 */
export function checkEligibility(
  userProfile: UserProfile,
  scheme: SchemeData
): EligibilityResult {
  const criteria = scheme.eligibility_criteria;
  const matchedCriteria: string[] = [];
  const failedCriteria: string[] = [];
  
  // Age check
  if (criteria.age) {
    if (userProfile.age !== undefined) {
      const ageValid = 
        (criteria.age.min === undefined || userProfile.age >= criteria.age.min) &&
        (criteria.age.max === undefined || userProfile.age <= criteria.age.max);
      
      if (ageValid) {
        matchedCriteria.push(`Age requirement met (${criteria.age.min || 0}-${criteria.age.max || 'no limit'} years)`);
      } else {
        failedCriteria.push(`Age must be between ${criteria.age.min || 0} and ${criteria.age.max || 'no limit'} years`);
      }
    }
  }
  
  // Gender check
  if (criteria.gender && userProfile.gender) {
    if (userProfile.gender === criteria.gender) {
      matchedCriteria.push(`Gender requirement met (${criteria.gender})`);
    } else {
      failedCriteria.push(`This scheme is for ${criteria.gender} applicants only`);
    }
  }
  
  // Income check
  if (criteria.income) {
    if (userProfile.annualIncome !== undefined) {
      const maxIncome = criteria.income.max || criteria.income.annual_max || criteria.income.mig2_max;
      if (maxIncome && userProfile.annualIncome <= maxIncome) {
        matchedCriteria.push(`Income requirement met (up to ₹${maxIncome.toLocaleString()})`);
      } else if (maxIncome) {
        failedCriteria.push(`Annual income must be up to ₹${maxIncome.toLocaleString()}`);
      }
    }
  }
  
  if (criteria.annual_family_income?.max) {
    if (userProfile.annualIncome !== undefined) {
      if (userProfile.annualIncome <= criteria.annual_family_income.max) {
        matchedCriteria.push(`Family income requirement met`);
      } else {
        failedCriteria.push(`Annual family income must be up to ₹${criteria.annual_family_income.max.toLocaleString()}`);
      }
    }
  }
  
  // State check
  if (criteria.state) {
    if (userProfile.state) {
      const validStates = Array.isArray(criteria.state) ? criteria.state : [criteria.state];
      if (validStates.includes(userProfile.state)) {
        matchedCriteria.push(`State requirement met (${userProfile.state})`);
      } else {
        failedCriteria.push(`This scheme is only for residents of: ${validStates.join(', ')}`);
      }
    }
  }
  
  // Category check (SC/ST/OBC/BPL etc.)
  if (criteria.category && criteria.category.length > 0) {
    if (userProfile.category && userProfile.category.length > 0) {
      const matchingCategories = userProfile.category.filter(c => 
        criteria.category!.includes(c.toLowerCase())
      );
      if (matchingCategories.length > 0) {
        matchedCriteria.push(`Category requirement met (${matchingCategories.join(', ')})`);
      } else {
        failedCriteria.push(`Requires one of these categories: ${criteria.category.join(', ')}`);
      }
    }
  }
  
  // Exclusion check
  if (criteria.excluded && criteria.excluded.length > 0) {
    const exclusions: string[] = [];
    
    if (criteria.excluded.includes('income_tax_payer') && userProfile.isIncomeTaxPayer) {
      exclusions.push('Income tax payers are not eligible');
    }
    if (criteria.excluded.includes('government_employee') && userProfile.isGovernmentEmployee) {
      exclusions.push('Government employees are not eligible');
    }
    
    if (exclusions.length > 0) {
      failedCriteria.push(...exclusions);
    } else {
      matchedCriteria.push('Not in excluded categories');
    }
  }
  
  // Farmer check
  if (criteria.farmer === true) {
    if (userProfile.isFarmer) {
      matchedCriteria.push('Farmer status verified');
      
      // Land holding check
      if (criteria.land_holding?.max_hectares && userProfile.landHoldingHectares !== undefined) {
        if (userProfile.landHoldingHectares <= criteria.land_holding.max_hectares) {
          matchedCriteria.push(`Land holding requirement met (up to ${criteria.land_holding.max_hectares} hectares)`);
        } else {
          failedCriteria.push(`Land holding must be up to ${criteria.land_holding.max_hectares} hectares`);
        }
      }
    } else {
      failedCriteria.push('This scheme is for farmers only');
    }
  }
  
  // Bank account check
  if (criteria.bank_account === true) {
    if (userProfile.hasBankAccount) {
      matchedCriteria.push('Bank account requirement met');
    } else {
      failedCriteria.push('Bank account is required');
    }
  }
  
  // Not income tax payer check
  if (criteria.not_income_tax_payer === true) {
    if (!userProfile.isIncomeTaxPayer) {
      matchedCriteria.push('Not an income tax payer');
    } else {
      failedCriteria.push('Income tax payers are not eligible');
    }
  }
  
  // Not government employee check  
  if (criteria.not_government_employee === true) {
    if (!userProfile.isGovernmentEmployee) {
      matchedCriteria.push('Not a government employee');
    } else {
      failedCriteria.push('Government employees are not eligible');
    }
  }
  
  // Ration card check
  if (criteria.ration_card && criteria.ration_card.length > 0) {
    if (userProfile.hasRationCard && criteria.ration_card.includes(userProfile.hasRationCard.toLowerCase())) {
      matchedCriteria.push(`Ration card requirement met (${userProfile.hasRationCard})`);
    } else if (userProfile.hasRationCard) {
      failedCriteria.push(`Requires ration card type: ${criteria.ration_card.join(' or ')}`);
    }
  }
  
  // Urban/Rural check
  if (criteria.urban_resident === true) {
    if (userProfile.isUrbanResident) {
      matchedCriteria.push('Urban resident requirement met');
    } else {
      failedCriteria.push('This scheme is for urban residents only');
    }
  }
  
  if (criteria.rural_resident === true) {
    if (userProfile.isRuralResident) {
      matchedCriteria.push('Rural resident requirement met');
    } else {
      failedCriteria.push('This scheme is for rural residents only');
    }
  }
  
  // Pucca house check
  if (criteria.no_pucca_house === true) {
    if (!userProfile.hasPuccaHouse) {
      matchedCriteria.push('No pucca house - eligible for housing scheme');
    } else {
      failedCriteria.push('Already owns a pucca house - not eligible');
    }
  }
  
  // Business owner check
  if (criteria.business_owner === true) {
    if (userProfile.isBusinessOwner) {
      matchedCriteria.push('Business owner requirement met');
    } else {
      failedCriteria.push('This scheme is for business owners only');
    }
  }
  
  // Traditional artisan check
  if (criteria.traditional_artisan === true) {
    if (userProfile.isTraditionalArtisan) {
      matchedCriteria.push('Traditional artisan status verified');
      
      // Trade check
      if (criteria.trade && criteria.trade.length > 0 && userProfile.trade) {
        if (criteria.trade.includes(userProfile.trade.toLowerCase())) {
          matchedCriteria.push(`Trade verified (${userProfile.trade})`);
        } else {
          failedCriteria.push(`Trade must be one of: ${criteria.trade.slice(0, 5).join(', ')}...`);
        }
      }
    } else {
      failedCriteria.push('This scheme is for traditional artisans only');
    }
  }
  
  // Marriage check
  if (criteria.married !== undefined) {
    if (userProfile.isMarried === criteria.married) {
      matchedCriteria.push(criteria.married ? 'Married status verified' : 'Unmarried status verified');
    } else {
      failedCriteria.push(criteria.married ? 'This scheme is for married applicants' : 'This scheme is for unmarried applicants');
    }
  }
  
  // Beneficiary checks (for schemes like SSY where beneficiary is different from applicant)
  if (criteria.beneficiary_gender && userProfile.childGender) {
    if (userProfile.childGender === criteria.beneficiary_gender) {
      matchedCriteria.push(`Beneficiary gender requirement met (${criteria.beneficiary_gender})`);
    } else {
      failedCriteria.push(`Beneficiary must be ${criteria.beneficiary_gender}`);
    }
  }
  
  if (criteria.beneficiary_age) {
    if (userProfile.childAge !== undefined) {
      const ageValid = 
        (criteria.beneficiary_age.min === undefined || userProfile.childAge >= criteria.beneficiary_age.min) &&
        (criteria.beneficiary_age.max === undefined || userProfile.childAge <= criteria.beneficiary_age.max);
      
      if (ageValid) {
        matchedCriteria.push(`Beneficiary age requirement met`);
      } else {
        failedCriteria.push(`Beneficiary age must be up to ${criteria.beneficiary_age.max || 'no limit'} years`);
      }
    }
  }
  
  // Calculate eligibility
  const totalCriteria = matchedCriteria.length + failedCriteria.length;
  const isEligible = failedCriteria.length === 0 && matchedCriteria.length > 0;
  const partialMatch = matchedCriteria.length > 0 && failedCriteria.length > 0;
  const confidenceScore = totalCriteria > 0 
    ? Math.round((matchedCriteria.length / totalCriteria) * 100)
    : 0;
  
  // Generate eligibility details text
  let eligibilityDetails = '';
  if (isEligible) {
    eligibilityDetails = `✅ ELIGIBLE: You meet all the verified criteria for ${scheme.name}.`;
  } else if (partialMatch) {
    eligibilityDetails = `⚠️ PARTIALLY ELIGIBLE: You meet some criteria but not all. Please verify the failed criteria.`;
  } else if (failedCriteria.length > 0) {
    eligibilityDetails = `❌ NOT ELIGIBLE: You do not meet the eligibility criteria for ${scheme.name}.`;
  } else {
    eligibilityDetails = `ℹ️ INSUFFICIENT DATA: Please provide more information to check eligibility.`;
  }
  
  return {
    isEligible,
    matchedCriteria,
    failedCriteria,
    partialMatch,
    confidenceScore,
    eligibilityDetails
  };
}

/**
 * Search schemes by keyword matching
 * Returns schemes that match the search query
 */
export function searchSchemes(schemes: SchemeData[], query: string): SchemeData[] {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter(k => k.length > 2);
  
  // Category mapping for common search terms
  const categoryMap: Record<string, string[]> = {
    'farmer': ['agriculture', 'kisan'],
    'health': ['health', 'ayushman', 'medical', 'hospital'],
    'house': ['housing', 'awas', 'home'],
    'pension': ['pension', 'retirement', 'old age'],
    'business': ['business', 'mudra', 'loan', 'entrepreneur'],
    'insurance': ['insurance', 'bima', 'suraksha'],
    'women': ['women', 'mahila', 'behna', 'ladli'],
    'food': ['food', 'anna', 'ration'],
    'lpg': ['lpg', 'gas', 'ujjwala', 'cooking'],
    'girl': ['girl', 'sukanya', 'beti'],
    'artisan': ['artisan', 'vishwakarma', 'craft']
  };
  
  return schemes.filter(scheme => {
    const searchableText = [
      scheme.name,
      scheme.name_hindi || '',
      scheme.description,
      scheme.category,
      ...scheme.benefits
    ].join(' ').toLowerCase();
    
    // Direct keyword match
    const directMatch = keywords.some(keyword => searchableText.includes(keyword));
    
    // Category mapping match
    const categoryMatch = keywords.some(keyword => {
      for (const [key, values] of Object.entries(categoryMap)) {
        if (keyword.includes(key) || key.includes(keyword)) {
          return values.some(v => searchableText.includes(v));
        }
      }
      return false;
    });
    
    return directMatch || categoryMatch;
  });
}

/**
 * Extract user profile information from chat message
 * Uses NLP-like pattern matching
 */
export function extractUserProfile(message: string): Partial<UserProfile> {
  const profile: Partial<UserProfile> = {};
  const messageLower = message.toLowerCase();
  
  // Age extraction
  const ageMatch = message.match(/(\d{1,3})\s*(years?\s*old|yrs|वर्ष|साल)/i) ||
                   message.match(/age\s*[:\-]?\s*(\d{1,3})/i) ||
                   message.match(/उम्र\s*[:\-]?\s*(\d{1,3})/i);
  if (ageMatch) {
    const age = parseInt(ageMatch[1]);
    if (age > 0 && age < 150) {
      profile.age = age;
    }
  }
  
  // Gender extraction
  if (/\b(female|woman|महिला|women|lady|औरत|स्त्री)\b/i.test(messageLower)) {
    profile.gender = 'female';
  } else if (/\b(male|man|पुरुष|आदमी)\b/i.test(messageLower)) {
    profile.gender = 'male';
  }
  
  // Income extraction
  const incomeMatch = message.match(/(?:income|आय|कमाई)[:\s]*(?:rs\.?|₹|rupees?)?\s*(\d[\d,]*)/i) ||
                      message.match(/(?:rs\.?|₹|rupees?)\s*(\d[\d,]*)\s*(?:per\s*(?:year|annum|month)|सालाना|महीना)/i);
  if (incomeMatch) {
    let income = parseInt(incomeMatch[1].replace(/,/g, ''));
    // Convert monthly to annual if mentioned
    if (/month|महीना/i.test(incomeMatch[0])) {
      income *= 12;
    }
    profile.annualIncome = income;
  }
  
  // State extraction
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];
  for (const state of states) {
    if (messageLower.includes(state.toLowerCase())) {
      profile.state = state;
      break;
    }
  }
  
  // Category extraction
  const categories: string[] = [];
  if (/\b(sc|scheduled\s*caste|अनुसूचित\s*जाति)\b/i.test(messageLower)) categories.push('sc');
  if (/\b(st|scheduled\s*tribe|अनुसूचित\s*जनजाति)\b/i.test(messageLower)) categories.push('st');
  if (/\b(obc|other\s*backward|अन्य\s*पिछड़ा)\b/i.test(messageLower)) categories.push('obc');
  if (/\b(bpl|below\s*poverty|गरीबी\s*रेखा)\b/i.test(messageLower)) categories.push('bpl');
  if (/\b(general|सामान्य)\b/i.test(messageLower)) categories.push('general');
  if (categories.length > 0) profile.category = categories;
  
  // Farmer status
  if (/\b(farmer|kisan|किसान|खेती|agriculture|farming)\b/i.test(messageLower)) {
    profile.isFarmer = true;
  }
  
  // Marriage status
  if (/\b(married|विवाहित|शादीशुदा)\b/i.test(messageLower)) {
    profile.isMarried = true;
  } else if (/\b(unmarried|single|अविवाहित|कुंवारा|कुंवारी)\b/i.test(messageLower)) {
    profile.isMarried = false;
  }
  
  // Urban/Rural
  if (/\b(urban|city|शहर|शहरी|नगर)\b/i.test(messageLower)) {
    profile.isUrbanResident = true;
    profile.isRuralResident = false;
  } else if (/\b(rural|village|गांव|ग्रामीण|देहात)\b/i.test(messageLower)) {
    profile.isRuralResident = true;
    profile.isUrbanResident = false;
  }
  
  // Business owner
  if (/\b(business|व्यापार|entrepreneur|उद्यमी|shop|दुकान)\b/i.test(messageLower)) {
    profile.isBusinessOwner = true;
  }
  
  // Artisan
  if (/\b(artisan|craftsman|शिल्पकार|कारीगर|carpenter|blacksmith|potter|tailor)\b/i.test(messageLower)) {
    profile.isTraditionalArtisan = true;
  }
  
  // Income tax payer
  if (/\b(income\s*tax|आयकर|itr)\b/i.test(messageLower)) {
    profile.isIncomeTaxPayer = true;
  }
  
  // Government employee
  if (/\b(government\s*(employee|job)|सरकारी\s*(नौकरी|कर्मचारी))\b/i.test(messageLower)) {
    profile.isGovernmentEmployee = true;
  }
  
  return profile;
}
