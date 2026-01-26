-- Create government schemes table with structured eligibility data
CREATE TABLE public.government_schemes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_hindi TEXT,
    category TEXT NOT NULL, -- health, agriculture, housing, pension, education, women, etc.
    scheme_type TEXT NOT NULL DEFAULT 'central', -- central or state
    state TEXT, -- NULL for central schemes
    description TEXT NOT NULL,
    benefits TEXT[] NOT NULL DEFAULT '{}',
    eligibility_criteria JSONB NOT NULL DEFAULT '{}',
    required_documents TEXT[] NOT NULL DEFAULT '{}',
    official_website TEXT,
    application_process TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (schemes are public information)
CREATE POLICY "Government schemes are publicly readable" 
ON public.government_schemes 
FOR SELECT 
USING (true);

-- Create eligibility checks table to store user eligibility check history
CREATE TABLE public.eligibility_checks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    scheme_id UUID REFERENCES public.government_schemes(id) ON DELETE CASCADE,
    user_profile JSONB NOT NULL DEFAULT '{}',
    is_eligible BOOLEAN NOT NULL,
    eligibility_details JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own eligibility checks
CREATE POLICY "Users can view their own eligibility checks" 
ON public.eligibility_checks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own eligibility checks" 
ON public.eligibility_checks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on schemes
CREATE TRIGGER update_government_schemes_updated_at
BEFORE UPDATE ON public.government_schemes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial scheme data (MVP: 15 major schemes)
INSERT INTO public.government_schemes (name, name_hindi, category, scheme_type, state, description, benefits, eligibility_criteria, required_documents, official_website, application_process) VALUES

-- PM Kisan Samman Nidhi
('PM Kisan Samman Nidhi', 'पीएम किसान सम्मान निधि', 'agriculture', 'central', NULL,
'Income support scheme for small and marginal farmers providing Rs. 6,000 per year in three installments.',
ARRAY['Rs. 6,000 per year in 3 installments of Rs. 2,000 each', 'Direct bank transfer', 'No middlemen involved'],
'{"farmer": true, "land_holding": {"max_hectares": 2}, "excluded": ["income_tax_payer", "government_employee", "professional_license_holder"]}',
ARRAY['Aadhaar Card', 'Land Records (Khasra/Khatauni)', 'Bank Account with IFSC', 'Mobile Number'],
'https://pmkisan.gov.in',
'Apply online at pmkisan.gov.in or visit nearest CSC center'),

-- Ayushman Bharat (PM-JAY)
('Ayushman Bharat - PM-JAY', 'आयुष्मान भारत - पीएम-जय', 'health', 'central', NULL,
'Health insurance scheme providing coverage of Rs. 5 lakhs per family per year for secondary and tertiary hospitalization.',
ARRAY['Rs. 5 lakh health coverage per family per year', 'Cashless treatment at empanelled hospitals', 'Covers pre and post hospitalization expenses', 'No cap on family size or age'],
'{"income": {"annual_max": 300000}, "category": ["bpl", "secc_deprived"], "excluded": ["income_tax_payer", "government_employee"]}',
ARRAY['Aadhaar Card', 'Ration Card', 'SECC-2011 data verification', 'Mobile Number'],
'https://pmjay.gov.in',
'Check eligibility at mera.pmjay.gov.in and get Ayushman card at nearest CSC'),

-- PM Awas Yojana (Urban)
('PM Awas Yojana (Urban)', 'पीएम आवास योजना (शहरी)', 'housing', 'central', NULL,
'Affordable housing scheme for urban poor providing interest subsidy on home loans.',
ARRAY['Interest subsidy up to Rs. 2.67 lakh on home loans', 'Affordable housing for EWS, LIG, MIG categories', 'Women co-ownership mandatory'],
'{"income": {"ews_max": 300000, "lig_max": 600000, "mig1_max": 1200000, "mig2_max": 1800000}, "no_pucca_house": true, "urban_resident": true}',
ARRAY['Aadhaar Card', 'Income Certificate', 'Bank Account Details', 'Address Proof', 'Caste Certificate (if applicable)', 'Property Documents'],
'https://pmaymis.gov.in',
'Apply through local Urban Local Body or online at pmaymis.gov.in'),

-- PM Awas Yojana (Gramin)
('PM Awas Yojana (Gramin)', 'पीएम आवास योजना (ग्रामीण)', 'housing', 'central', NULL,
'Housing for rural poor providing financial assistance for construction of pucca houses.',
ARRAY['Rs. 1.20 lakh in plain areas', 'Rs. 1.30 lakh in hilly/difficult areas', 'Additional Rs. 12,000 for toilet under SBM'],
'{"rural_resident": true, "no_pucca_house": true, "category": ["bpl", "sc", "st", "minorities", "freed_bonded_labour"]}',
ARRAY['Aadhaar Card', 'BPL Certificate or SECC data', 'Bank Account with IFSC', 'Land Documents', 'Caste Certificate (if applicable)'],
'https://pmayg.nic.in',
'Apply through Gram Panchayat or Block Development Office'),

-- Ujjwala Yojana
('PM Ujjwala Yojana', 'पीएम उज्ज्वला योजना', 'welfare', 'central', NULL,
'Free LPG connections to women from BPL households to provide clean cooking fuel.',
ARRAY['Free LPG connection', 'First refill free', 'Stove provided (in some cases)', 'Subsidy on refills'],
'{"gender": "female", "age": {"min": 18}, "category": ["bpl", "sc", "st", "pmay_beneficiary", "antyodaya", "forest_dweller", "tea_garden", "river_island"]}',
ARRAY['Aadhaar Card', 'BPL Ration Card', 'Bank Account with IFSC', 'Passport Size Photo', 'Address Proof'],
'https://www.pmuy.gov.in',
'Apply at nearest LPG distributor or through CSC'),

-- Atal Pension Yojana
('Atal Pension Yojana', 'अटल पेंशन योजना', 'pension', 'central', NULL,
'Pension scheme for unorganized sector workers guaranteeing minimum pension of Rs. 1,000 to Rs. 5,000.',
ARRAY['Guaranteed pension of Rs. 1,000 to Rs. 5,000 per month after 60 years', 'Government co-contribution for eligible subscribers', 'Spouse continues to receive pension after subscriber death'],
'{"age": {"min": 18, "max": 40}, "bank_account": true, "not_income_tax_payer": true, "not_government_employee": true}',
ARRAY['Aadhaar Card', 'Bank Account', 'Mobile Number', 'Nominee Details'],
'https://www.npscra.nsdl.co.in/atal-pension-yojana.php',
'Apply through any bank branch where you have savings account'),

-- Sukanya Samriddhi Yojana
('Sukanya Samriddhi Yojana', 'सुकन्या समृद्धि योजना', 'savings', 'central', NULL,
'Savings scheme for girl child with high interest rate and tax benefits.',
ARRAY['High interest rate (currently 8.2%)', 'Tax benefits under 80C', 'Partial withdrawal allowed for education after age 18', 'Maturity at age 21'],
'{"beneficiary_gender": "female", "beneficiary_age": {"max": 10}, "parent_guardian": true, "max_accounts_per_family": 2}',
ARRAY['Birth Certificate of girl child', 'Identity proof of parent/guardian', 'Address proof', 'Passport size photos of girl and guardian'],
'https://www.nsiindia.gov.in',
'Open account at any post office or authorized bank'),

-- PM Mudra Yojana
('PM Mudra Yojana', 'पीएम मुद्रा योजना', 'business', 'central', NULL,
'Loans for micro and small enterprises without collateral.',
ARRAY['Shishu: Loans up to Rs. 50,000', 'Kishor: Loans from Rs. 50,001 to Rs. 5 lakh', 'Tarun: Loans from Rs. 5 lakh to Rs. 10 lakh', 'No collateral required', 'Low interest rates'],
'{"business_owner": true, "non_corporate": true, "non_farm_sector": true, "manufacturing_trading_services": true}',
ARRAY['Identity Proof (Aadhaar/Voter ID/Passport)', 'Address Proof', 'Business Plan', 'Proof of Business (if existing)', 'Bank Statements', 'Passport Size Photos'],
'https://www.mudra.org.in',
'Apply at any bank, NBFC, or MFI'),

-- National Pension System
('National Pension System', 'राष्ट्रीय पेंशन प्रणाली', 'pension', 'central', NULL,
'Voluntary retirement savings scheme with tax benefits and flexible investment options.',
ARRAY['Tax benefits up to Rs. 2 lakh under 80C and 80CCD', 'Choice of fund managers and investment options', 'Portable across jobs and locations', 'Annuity purchase at retirement'],
'{"age": {"min": 18, "max": 70}, "kyc_compliant": true}',
ARRAY['Aadhaar Card', 'PAN Card', 'Bank Account', 'Passport Size Photo', 'Address Proof'],
'https://www.npscra.nsdl.co.in',
'Register through eNPS portal, banks, or Point of Presence'),

-- PM Garib Kalyan Anna Yojana
('PM Garib Kalyan Anna Yojana', 'पीएम गरीब कल्याण अन्न योजना', 'food', 'central', NULL,
'Free food grains distribution to poor families covered under NFSA.',
ARRAY['5 kg free food grains per person per month', 'Rice, wheat, and coarse grains', 'Available through ration shops'],
'{"nfsa_beneficiary": true, "ration_card": ["aay", "phh"]}',
ARRAY['Ration Card (AAY or PHH)', 'Aadhaar Card', 'Family details linked to ration card'],
'https://nfsa.gov.in',
'Collect from designated Fair Price Shop using ration card'),

-- PM Vishwakarma Yojana
('PM Vishwakarma Yojana', 'पीएम विश्वकर्मा योजना', 'artisan', 'central', NULL,
'Support scheme for traditional artisans and craftspeople with training and credit.',
ARRAY['Recognition as Vishwakarma through certificate and ID card', 'Skill training with stipend', 'Collateral-free loans up to Rs. 3 lakh', 'Digital and marketing support'],
'{"traditional_artisan": true, "trade": ["carpenter", "blacksmith", "goldsmith", "potter", "sculptor", "cobbler", "tailor", "basket_weaver", "doll_maker", "barber", "garland_maker", "washerman", "fishing_net_maker", "locksmith", "armourer", "boat_maker", "hammer_tool_kit_maker"], "age": {"min": 18}, "family_registration": true}',
ARRAY['Aadhaar Card', 'Bank Account', 'Mobile Number', 'Skill/Trade Certificate (if any)', 'Caste Certificate (if applicable)'],
'https://pmvishwakarma.gov.in',
'Register through CSC or pmvishwakarma.gov.in with Aadhaar verification'),

-- Ladli Behna Yojana (MP)
('Ladli Behna Yojana', 'लाडली बहना योजना', 'women', 'state', 'Madhya Pradesh',
'Monthly financial assistance to women of Madhya Pradesh.',
ARRAY['Rs. 1,250 per month (increased from Rs. 1,000)', 'Direct bank transfer', 'No income proof required'],
'{"gender": "female", "age": {"min": 21, "max": 60}, "state": "Madhya Pradesh", "married": true, "annual_family_income": {"max": 250000}, "not_income_tax_payer": true}',
ARRAY['Samagra ID', 'Aadhaar Card', 'Bank Account linked to Aadhaar', 'Mobile Number', 'Passport Size Photo'],
'https://cmladlibahna.mp.gov.in',
'Apply online at cmladlibahna.mp.gov.in or at Gram Panchayat camps'),

-- PM Suraksha Bima Yojana
('PM Suraksha Bima Yojana', 'पीएम सुरक्षा बीमा योजना', 'insurance', 'central', NULL,
'Accident insurance scheme with coverage of Rs. 2 lakh at just Rs. 20 per year.',
ARRAY['Rs. 2 lakh for accidental death or total disability', 'Rs. 1 lakh for partial disability', 'Premium of just Rs. 20 per year'],
'{"age": {"min": 18, "max": 70}, "bank_account": true}',
ARRAY['Aadhaar Card', 'Bank Account', 'Nomination Details'],
'https://www.jansuraksha.gov.in',
'Enroll through any bank where you have savings account'),

-- PM Jeevan Jyoti Bima Yojana
('PM Jeevan Jyoti Bima Yojana', 'पीएम जीवन ज्योति बीमा योजना', 'insurance', 'central', NULL,
'Life insurance scheme with coverage of Rs. 2 lakh at Rs. 436 per year.',
ARRAY['Rs. 2 lakh life cover', 'Coverage from June 1 to May 31 each year', 'Premium of Rs. 436 per year'],
'{"age": {"min": 18, "max": 50}, "bank_account": true}',
ARRAY['Aadhaar Card', 'Bank Account', 'Nomination Details', 'Health Declaration'],
'https://www.jansuraksha.gov.in',
'Enroll through any bank where you have savings account'),

-- Stand Up India
('Stand Up India', 'स्टैंड अप इंडिया', 'business', 'central', NULL,
'Bank loans between Rs. 10 lakh to Rs. 1 crore for SC/ST and women entrepreneurs.',
ARRAY['Loans from Rs. 10 lakh to Rs. 1 crore', 'For greenfield enterprises in manufacturing, services, or trading', 'Composite loan covering term loan and working capital'],
'{"category": ["sc", "st", "woman"], "age": {"min": 18}, "first_time_entrepreneur": true, "enterprise_type": "greenfield"}',
ARRAY['Identity Proof (Aadhaar/Voter ID)', 'Caste Certificate (for SC/ST)', 'Address Proof', 'Business Plan', 'Proof of Category', 'Bank Account'],
'https://www.standupmitra.in',
'Apply at any scheduled commercial bank or standupmitra.in portal');