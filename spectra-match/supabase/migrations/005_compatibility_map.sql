-- Migration: 005_compatibility_map
-- Compatibility map table seeded with all 16 MBTI types

CREATE TABLE IF NOT EXISTS public.compatibility_map (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mbti_type                TEXT NOT NULL UNIQUE CHECK (mbti_type ~ '^[EI][NS][TF][JP]$'),
  compatible_types         TEXT[] NOT NULL,
  compatibility_rationale  TEXT NOT NULL,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE public.compatibility_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read compatibility map"
  ON public.compatibility_map FOR SELECT
  TO authenticated
  USING (true);

-- Seed all 16 MBTI types
INSERT INTO public.compatibility_map (mbti_type, compatible_types, compatibility_rationale) VALUES
  ('INTJ', ARRAY['ENFP','ENTP','INFJ','ENTJ'],
   'INTJs are drawn to partners who can match their strategic thinking while bringing warmth and creativity. ENFPs and ENTPs challenge their assumptions, while INFJs share their depth.'),
  ('INTP', ARRAY['ENTJ','ENTP','INFJ','ENFJ'],
   'INTPs thrive with partners who structure their ideas and push them toward action. ENTJs and ENFJs help them translate thoughts into reality.'),
  ('ENTJ', ARRAY['INTP','INFP','INTJ','ENFP'],
   'ENTJs match well with introspective types who complement their drive with depth. INTPs offer intellectual rigor; INFPs bring humanity to their vision.'),
  ('ENTP', ARRAY['INFJ','INTJ','ENFJ','INTP'],
   'ENTPs are energized by partners who can keep up with their ideas and offer genuine depth. INFJs provide the mystery and substance ENTPs crave.'),
  ('INFJ', ARRAY['ENTP','ENFP','INTJ','INFP'],
   'INFJs seek partners with vision and authenticity. ENTPs and ENFPs offer lively energy; INTJs share their love of depth and long-term planning.'),
  ('INFP', ARRAY['ENFJ','ENTJ','INFJ','ENFP'],
   'INFPs flourish with partners who honor their values and nurture their growth. ENFJs are especially complementary, providing structure and warmth.'),
  ('ENFJ', ARRAY['INFP','ISFP','INFJ','INTP'],
   'ENFJs thrive when paired with introspective, values-driven types. INFPs and ISFPs bring authenticity; INTPs offer intellectual balance.'),
  ('ENFP', ARRAY['INTJ','INFJ','ENTJ','ENFJ'],
   'ENFPs are attracted to depth and substance. INTJs and INFJs provide grounding and mystery that ENFPs find irresistible.'),
  ('ISTJ', ARRAY['ESFP','ESTP','ISFJ','ESTJ'],
   'ISTJs pair well with spontaneous types who draw them out of their routine. ESFPs and ESTPs provide energy; ISFJs share their sense of duty.'),
  ('ISFJ', ARRAY['ESFP','ESTP','ISTJ','ESFJ'],
   'ISFJs connect deeply with expressive, present-focused partners. ESFPs bring joy; ESTPs add excitement to their stable foundation.'),
  ('ESTJ', ARRAY['ISFP','ISTP','ISTJ','ESFJ'],
   'ESTJs match well with types who ground them and add flexibility. ISFPs bring warmth; ISTPs offer practical problem-solving.'),
  ('ESFJ', ARRAY['ISFP','ISTP','ISTJ','ESTJ'],
   'ESFJs thrive with partners who appreciate their care and provide quiet, genuine affection. ISFPs and ISTPs complement their social nature.'),
  ('ISTP', ARRAY['ESFJ','ESTJ','ESTP','ISFJ'],
   'ISTPs are drawn to socially warm types who help them connect emotionally. ESFJs provide the warmth ISTPs often lack.'),
  ('ISFP', ARRAY['ENFJ','ESFJ','ESTJ','ENFP'],
   'ISFPs bloom with nurturing, expressive partners. ENFJs and ESFJs help them feel seen and supported in their gentle way.'),
  ('ESTP', ARRAY['ISFJ','ISTJ','ESFJ','ISTP'],
   'ESTPs pair well with grounded, steady types who appreciate their energy. ISFJs and ISTJs provide balance to their spontaneity.'),
  ('ESFP', ARRAY['ISFJ','ISTJ','ESFJ','ISFP'],
   'ESFPs thrive with warm, dependable partners who enjoy their enthusiasm. ISFJs offer the stability and care ESFPs love.')
ON CONFLICT (mbti_type) DO NOTHING;
