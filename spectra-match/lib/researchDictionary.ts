/**
 * Structured Interaction Dictionary derived from research.txt.
 * Used by Gemini to provide data-driven personality insights.
 */
export const INTERACTION_DICTIONARY = {
  core_philosophy: {
    compatibility_paradox: "Compatibility is not a destination but a dynamic mechanism of interaction. Predictable tension (cognitive friction) exists when distinct processing systems collide.",
    golden_pair_myth: "Longevity data suggests a shared function stack is no substitute for interpersonal skills. Complementary pairs can lead to higher divorce proneness if cognitive friction is left unmanaged."
  },
  dimension_mechanisms: {
    SN: {
      mechanism: "Communication Style",
      friction: "Sensors prioritize concrete/present; Intuitives prioritize abstract/possibilities. Similarity in S/N can predict divorce proneness in husbands due to rigid processing styles.",
      translation: {
        N_to_S: "Lead with the Concrete: Provide three specific facts before abstracting.",
        S_to_N: "Allow the Reimagining: Grant five minutes of conceptual brainstorming before requiring a practical execution plan."
      }
    },
    TF: {
      mechanism: "Support & Validation",
      friction: "T-types prioritize logical consistency/solving; F-types prioritize impact/emotional acknowledgment.",
      translation: {
        protocol: "The 'Vent vs. Solve' Check: Ask 'Is this a time for logic and solutions, or do you need me to listen and validate your experience?'"
      }
    },
    EI: {
      mechanism: "Energy Management",
      friction: "Extraverts energized by social engagement; Introverts experience depletion (social battery asymmetry).",
      translation: {
        protocol: "The Shared Resource Protocol: Schedule mandatory 'recharge blocks' for Introverts and external fulfillment for Extraverts without guilt."
      }
    },
    JP: {
      mechanism: "Lifestyle Structure",
      friction: "J-types seek closure/systems; P-types value open options/spontaneity.",
      translation: {
        protocol: "Hard vs. Soft Deadlines: J partners provide 'soft windows' for spontaneity; P partners commit to 'hard deadlines' for high-stakes tasks."
      }
    }
  },
  lifecycle_factors: {
    midlife_40s_50s: {
      conflict_domain: "Performance Domain Conflict",
      issue: "High similarity in Conscientiousness/Extraversion leads to competition over 'how-to' domains (finances, child-rearing).",
      benefit: "Diversification reduces role strain through specialized labor (one partner achievement-driven, one socially oriented)."
    },
    older_couples_60s_70s: {
      focus: "Emotional expression and companionship. Similarity trap diminishes as task division needs are replaced by shared emotional resonance."
    }
  },
  compatibility_enhancers: {
    emotional_intelligence: "EI accounts for 23.9% of marital satisfaction variance by allowing partners to bridge cognitive gaps.",
    attachment_security: "The 'software' that keeps the 'hardware' (personality) from crashing during conflict.",
    neuroticism_warning: "The single strongest predictor of relationship toxicity (10% of satisfaction variability)."
  },
  communication_protocols: [
    "The 'Vent vs. Solve' Check",
    "The 'Concrete Detail' Bridge",
    "The 'Social Battery' Audit"
  ],
  positive_illusions: "The perception of similarity is often more vital for satisfaction than actual type alignment."
};
