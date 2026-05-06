-- Migration: 012_update_research_dictionary
-- Updates the research dictionary with more comprehensive content derived from research.txt

DELETE FROM public.research_dictionary WHERE key = 'interaction_dictionary_v1';

INSERT INTO public.research_dictionary (key, content)
VALUES ('interaction_dictionary_v1', '{
  "core_philosophy": {
    "compatibility_paradox": "Compatibility is not a destination but a dynamic mechanism of interaction. Predictable tension (cognitive friction) exists when distinct processing systems collide.",
    "golden_pair_myth": "Longevity data suggests a shared function stack is no substitute for interpersonal skills. Complementary pairs can lead to higher divorce proneness if cognitive friction is left unmanaged."
  },
  "dimension_mechanisms": {
    "SN": {
      "mechanism": "Communication Style",
      "friction": "Sensors prioritize concrete/present; Intuitives prioritize abstract/possibilities. Similarity in S/N can predict divorce proneness in husbands due to rigid processing styles.",
      "translation": {
        "N_to_S": "Lead with the Concrete: Provide three specific facts before abstracting.",
        "S_to_N": "Allow the Reimagining: Grant five minutes of conceptual brainstorming before requiring a practical execution plan."
      }
    },
    "TF": {
      "mechanism": "Support & Validation",
      "friction": "T-types prioritize logical consistency/solving; F-types prioritize impact/emotional acknowledgment.",
      "translation": {
        "protocol": "The Vent vs. Solve Check: Ask Is this a time for logic and solutions, or do you need me to listen and validate your experience?"
      }
    },
    "EI": {
      "mechanism": "Energy Management",
      "friction": "Extraverts energized by social engagement; Introverts experience depletion (social battery asymmetry).",
      "translation": {
        "protocol": "The Shared Resource Protocol: Schedule mandatory recharge blocks for Introverts and external fulfillment for Extraverts without guilt."
      }
    },
    "JP": {
      "mechanism": "Lifestyle Structure",
      "friction": "J-types seek closure/systems; P-types value open options/spontaneity.",
      "translation": {
        "protocol": "Hard vs. Soft Deadlines: J partners provide soft windows for spontaneity; P partners commit to hard deadlines for high-stakes tasks."
      }
    }
  },
  "lifecycle_factors": {
    "midlife": {
      "conflict_domain": "Performance Domain Conflict",
      "issue": "High similarity in Conscientiousness/Extraversion leads to competition over how-to domains (finances, child-rearing).",
      "benefit": "Diversification reduces role strain through specialized labor."
    }
  },
  "compatibility_enhancers": {
    "emotional_intelligence": "EI accounts for 23.9% of marital satisfaction variance by allowing partners to bridge cognitive gaps.",
    "attachment_security": "The software that keeps the hardware (personality) from crashing during conflict."
  },
  "communication_protocols": [
    "The Vent vs. Solve Check",
    "The Concrete Detail Bridge",
    "The Social Battery Audit"
  ]
}'::jsonb);
