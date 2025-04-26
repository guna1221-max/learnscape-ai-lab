
import { processQuery } from './nlpProcessor';

// Knowledge base for educational content
const knowledgeBase = {
  physics: {
    pendulum: {
      concept: "A simple pendulum consists of a mass (bob) attached to a lightweight string suspended from a fixed point. When displaced from equilibrium and released, it swings back and forth with periodic motion.",
      formula: "The period of a pendulum T = 2π√(L/g), where L is the length and g is the gravitational acceleration.",
      factors: "The period depends primarily on the length of the pendulum and the gravitational field strength. For small angles, the period is approximately independent of the amplitude.",
      experiment: "To conduct a pendulum experiment, vary the length of the string and measure the time it takes for a complete oscillation (back and forth). Plot length vs. period squared to verify the relationship."
    },
    gravity: {
      concept: "Gravity is a force that attracts objects with mass toward each other. On Earth, it's the force that pulls objects toward the center of the planet.",
      formula: "The gravitational force F = G(m₁m₂)/r², where G is the gravitational constant, m₁ and m₂ are the masses, and r is the distance between centers.",
      application: "Gravity affects everything from the motion of planets to the behavior of pendulums and projectiles."
    },
    newton_laws: {
      first: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.",
      second: "The force acting on an object is equal to the mass of that object times its acceleration (F = ma).",
      third: "For every action, there is an equal and opposite reaction."
    },
    waves: {
      concept: "Waves transfer energy from one place to another without transferring matter. Key types include mechanical waves (requiring a medium) and electromagnetic waves (which don't).",
      properties: "Waves are characterized by amplitude, wavelength, frequency, period, speed, and direction of propagation.",
      interference: "When two waves meet, they can undergo constructive interference (amplitudes add) or destructive interference (amplitudes subtract)."
    }
  },
  chemistry: {
    chemical_reactions: {
      concept: "Chemical reactions involve the breaking and forming of bonds between atoms, resulting in the transformation of substances.",
      types: "Types include synthesis, decomposition, single replacement, double replacement, and combustion reactions.",
      factors: "Reaction rates are affected by temperature, concentration, pressure, surface area, and catalysts."
    },
    elements: {
      concept: "An element is a pure substance consisting of only one type of atom. The periodic table organizes all known elements based on their properties.",
      states: "Elements can exist as solids, liquids, or gases at room temperature, depending on their atomic structure and bonding patterns."
    },
    solutions: {
      concept: "A solution is a homogeneous mixture where one substance (solute) is dissolved in another (solvent).",
      concentration: "Concentration can be expressed as molarity (moles of solute per liter of solution), molality (moles of solute per kg of solvent), or percent composition."
    }
  },
  biology: {
    cell: {
      concept: "Cells are the basic structural and functional units of all living organisms. They come in two main types: prokaryotic (no nucleus) and eukaryotic (with nucleus).",
      organelles: "Eukaryotic cells contain specialized structures including the nucleus, mitochondria, endoplasmic reticulum, Golgi apparatus, lysosomes, and more.",
      membrane: "The cell membrane is a selectively permeable barrier that controls what enters and leaves the cell through various transport mechanisms."
    },
    dna: {
      concept: "DNA (deoxyribonucleic acid) is a molecule that carries genetic instructions for the development, functioning, growth, and reproduction of all known organisms.",
      structure: "DNA consists of two strands coiled around each other in a double helix, with base pairs (A-T and G-C) forming the rungs of the ladder.",
      replication: "DNA replication is the process of producing two identical replicas of DNA from one original DNA molecule, essential for cell division."
    },
    evolution: {
      concept: "Evolution is the process by which populations of organisms change over successive generations through natural selection of heritable traits.",
      natural_selection: "Natural selection is the differential survival and reproduction of individuals due to differences in phenotype, leading to adaptation to the environment.",
      evidence: "Evidence for evolution includes fossil records, comparative anatomy, molecular biology, and direct observation of evolutionary changes."
    }
  },
  general: {
    scientific_method: {
      steps: [
        "Observation/Question - Notice something interesting or identify a problem to solve",
        "Research - Gather information related to your question",
        "Hypothesis - Propose a testable explanation",
        "Experiment - Design and perform tests to confirm or refute the hypothesis",
        "Analysis - Examine the data collected from experiments",
        "Conclusion - Determine if the hypothesis is supported or not",
        "Communication - Share findings with others"
      ],
      importance: "The scientific method provides a systematic approach to acquiring new knowledge and solving problems. It's self-correcting, as new evidence can refine or replace previous theories."
    },
    measurement: {
      si_units: "The International System of Units (SI) includes seven base units: meter (length), kilogram (mass), second (time), ampere (electric current), kelvin (temperature), mole (amount of substance), and candela (luminous intensity).",
      uncertainty: "All measurements have some degree of uncertainty. Reporting results with appropriate significant figures reflects the precision of the measurement process."
    }
  }
};

export function generateResponse(userQuery: string, context?: string): string {
  // Process the query using NLP
  const processed = processQuery(userQuery);
  
  // Log processing results (for debugging)
  console.log('Processed query:', processed);
  
  // First, handle special intents
  if (processed.intent === 'greeting') {
    return getRandomResponse([
      "Hello! I'm your AI science tutor. How can I help with your experiments today?",
      "Hi there! Ready to explore some scientific concepts?",
      "Greetings! What scientific topic would you like to discuss?"
    ]);
  }
  
  if (processed.intent === 'farewell') {
    return getRandomResponse([
      "Goodbye! Feel free to return whenever you have more questions.",
      "See you later! Remember, science never stops.",
      "Until next time! Keep exploring and experimenting."
    ]);
  }
  
  // Handle domain-specific responses
  if (processed.domain !== 'general') {
    // Try to find relevant information from the knowledge base
    const domainInfo = knowledgeBase[processed.domain];
    
    if (domainInfo) {
      // Find the most relevant topic based on keywords
      const topic = findMostRelevantTopic(processed.keywords, domainInfo);
      
      if (topic) {
        // Find the most relevant aspect based on specificity
        const aspect = findMostRelevantAspect(processed.specificity, topic);
        
        if (aspect) {
          if (typeof aspect === 'object' && !Array.isArray(aspect)) {
            // If it's an object with multiple properties, combine them into a comprehensive response
            return formatResponse(aspect, processed);
          } else {
            // If it's a string or array, return it directly
            return typeof aspect === 'string' ? aspect : aspect.join('\n\n');
          }
        }
      }
    }
  }
  
  // If we get here, we couldn't find specific information in our knowledge base
  // Fall back to generic responses based on intent and domain
  return generateFallbackResponse(processed, context);
}

// Helper function to find the most relevant topic based on keywords
function findMostRelevantTopic(keywords: string[], domainInfo: any): any {
  let bestMatchScore = 0;
  let bestMatchTopic = null;
  
  for (const [topicKey, topicContent] of Object.entries(domainInfo)) {
    let matchScore = 0;
    
    // Check if any keyword matches the topic key or its content
    for (const keyword of keywords) {
      if (topicKey.includes(keyword)) {
        matchScore += 2;  // Direct topic match is weighted higher
      }
      
      // Check if keyword is in any of the topic content
      const topicContentStr = JSON.stringify(topicContent).toLowerCase();
      if (topicContentStr.includes(keyword)) {
        matchScore += 1;
      }
    }
    
    if (matchScore > bestMatchScore) {
      bestMatchScore = matchScore;
      bestMatchTopic = topicContent;
    }
  }
  
  return bestMatchTopic;
}

// Helper function to find the most relevant aspect based on specificity
function findMostRelevantAspect(specificity: string, topic: any): any {
  // Direct mapping of specificity to common property names
  const specificityMap: Record<string, string[]> = {
    concept: ['concept', 'definition', 'description', 'overview'],
    experiment: ['experiment', 'lab', 'procedure', 'setup', 'equipment'],
    calculation: ['formula', 'equation', 'calculation', 'compute'],
    procedure: ['steps', 'procedure', 'method', 'protocol', 'how'],
    result: ['result', 'outcome', 'observation', 'data'],
    general: [''] // empty to match anything
  };
  
  // Try to find an aspect that matches the specificity
  const possibleKeys = specificityMap[specificity];
  for (const key of possibleKeys) {
    if (key && topic[key]) {
      return topic[key];
    }
  }
  
  // If no matching aspect found, return the whole topic
  return topic;
}

// Format the response based on the processed query and the information
function formatResponse(info: any, processed: any): string {
  // Start with a context intro based on intent
  let response = '';
  
  switch (processed.intent) {
    case 'question':
      response = "Here's what I know about that: \n\n";
      break;
    case 'command':
      response = "I'd be happy to explain: \n\n";
      break;
    default:
      response = "Let me share some information: \n\n";
  }
  
  // Add information from different aspects, if available
  for (const [key, value] of Object.entries(info)) {
    if (typeof value === 'string') {
      response += `${formatAspectTitle(key)}: ${value}\n\n`;
    } else if (Array.isArray(value)) {
      response += `${formatAspectTitle(key)}:\n`;
      value.forEach((item, index) => {
        response += `${index + 1}. ${item}\n`;
      });
      response += '\n';
    }
  }
  
  // Add a helpful closing
  response += getRandomResponse([
    "Does that help with what you were asking?",
    "Is there something specific you'd like me to elaborate on?",
    "Let me know if you need more details on any part of that."
  ]);
  
  return response;
}

// Format aspect titles for better readability
function formatAspectTitle(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Generate fallback responses when specific information can't be found
function generateFallbackResponse(processed: any, context?: string): string {
  const { intent, domain, specificity } = processed;
  
  // Generic responses based on intent
  if (intent === 'question') {
    return getRandomResponse([
      "That's an interesting question! While I don't have specific information on that, I'd be happy to help you explore it further. Could you provide more details about what you're trying to understand?",
      "Great question! I don't have a complete answer for that yet, but I'd be glad to help you research it. What specific aspect are you most interested in?",
      `I'm still learning about ${domain} topics like that. What particular aspect of this question would be most helpful for your experiment?`
    ]);
  }
  
  if (intent === 'command') {
    return getRandomResponse([
      "I'll try my best to help with that. Could you provide more specific details about what you'd like to see or understand?",
      "I'd be happy to assist with that request. To give you the most helpful information, could you tell me more about what you're working on?",
      "I want to make sure I provide you with the right information. Could you elaborate a bit more on your experiment or what you're trying to achieve?"
    ]);
  }
  
  // Context-aware fallback
  if (context) {
    return `I notice you're working on ${context}. While I don't have specific information about your question, I can help you analyze your experimental results or explain concepts related to this topic. What aspect would be most helpful?`;
  }
  
  // Ultimate fallback
  return "I'm not sure I fully understand what you're asking about. Could you rephrase your question or provide more context about what you're trying to learn?";
}

// Helper function to get a random response from an array of options
function getRandomResponse(responses: string[]): string {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}
