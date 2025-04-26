
// Simple rule-based NLP processor for the AI tutor

type Intent = 'question' | 'command' | 'greeting' | 'farewell' | 'feedback' | 'unknown';
type Domain = 'physics' | 'chemistry' | 'biology' | 'general';
type Specificity = 'concept' | 'experiment' | 'calculation' | 'procedure' | 'result' | 'general';

interface ProcessedQuery {
  intent: Intent;
  domain: Domain;
  specificity: Specificity;
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  originalQuery: string;
}

const domainKeywords = {
  physics: [
    'force', 'motion', 'energy', 'momentum', 'gravity', 'velocity', 
    'acceleration', 'mass', 'weight', 'friction', 'pendulum', 'wave', 
    'light', 'sound', 'electricity', 'magnetism', 'nuclear',
    'newton', 'joule', 'volt', 'amp', 'watt', 'ohm', 'hertz'
  ],
  chemistry: [
    'element', 'compound', 'molecule', 'atom', 'reaction', 'bond',
    'acid', 'base', 'salt', 'solution', 'concentration', 'mole',
    'periodic table', 'oxidation', 'reduction', 'catalyst',
    'organic', 'inorganic', 'equilibrium', 'thermodynamics'
  ],
  biology: [
    'cell', 'dna', 'rna', 'protein', 'enzyme', 'gene', 'chromosome',
    'mitosis', 'meiosis', 'photosynthesis', 'respiration', 'ecosystem',
    'evolution', 'species', 'organism', 'tissue', 'organ', 'system',
    'bacteria', 'virus', 'fungi', 'plant', 'animal'
  ]
};

export function processQuery(query: string): ProcessedQuery {
  const lowercasedQuery = query.toLowerCase();
  const words = lowercasedQuery.split(/\s+/);
  
  // Determine intent
  const intent = determineIntent(lowercasedQuery);
  
  // Determine domain
  const domain = determineDomain(lowercasedQuery);
  
  // Determine specificity
  const specificity = determineSpecificity(lowercasedQuery);
  
  // Extract keywords
  const keywords = extractKeywords(lowercasedQuery);
  
  // Analyze sentiment
  const sentiment = analyzeSentiment(lowercasedQuery);
  
  return {
    intent,
    domain,
    specificity,
    keywords,
    sentiment,
    originalQuery: query
  };
}

function determineIntent(query: string): Intent {
  // Question detection
  if (/^(what|how|why|when|where|who|can|could|would|will|is|are|do|does|did|should|shall|may|might)\b/i.test(query) || query.includes('?')) {
    return 'question';
  }
  
  // Command detection
  if (/^(show|explain|tell|help|start|stop|reset|calculate|find|solve|give)\b/i.test(query)) {
    return 'command';
  }
  
  // Greeting detection
  if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i.test(query)) {
    return 'greeting';
  }
  
  // Farewell detection
  if (/\b(bye|goodbye|see you|talk to you later|until next time|farewell)\b/i.test(query)) {
    return 'farewell';
  }
  
  // Feedback detection
  if (/\b(thanks|thank you|great|awesome|good|bad|terrible|confusing|clear|helpful|not helpful)\b/i.test(query)) {
    return 'feedback';
  }
  
  return 'unknown';
}

function determineDomain(query: string): Domain {
  // Check each domain's keywords
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    for (const keyword of keywords) {
      if (query.includes(keyword)) {
        return domain as Domain;
      }
    }
  }
  
  return 'general';
}

function determineSpecificity(query: string): Specificity {
  if (/\b(what is|define|explain|concept|mean|definition)\b/i.test(query)) {
    return 'concept';
  }
  
  if (/\b(experiment|lab|setup|apparatus|equipment)\b/i.test(query)) {
    return 'experiment';
  }
  
  if (/\b(calculate|computation|solve|equation|formula|value|result)\b/i.test(query)) {
    return 'calculation';
  }
  
  if (/\b(how to|step|procedure|method|process|protocol)\b/i.test(query)) {
    return 'procedure';
  }
  
  if (/\b(why|happen|observe|result|outcome|data)\b/i.test(query)) {
    return 'result';
  }
  
  return 'general';
}

function extractKeywords(query: string): string[] {
  // Remove stop words and extract potential keywords
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'to', 'of', 'for', 'with', 'by', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down',
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
    'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
    'now', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
    'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
    'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them',
    'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this',
    'that', 'these', 'those', 'am', 'do', 'does', 'did', 'doing', 'have',
    'has', 'had', 'having', 'would', 'could', 'should', 'ought', 'please', 'let'
  ]);
  
  // Split into words and filter out stop words
  const words = query.split(/\s+/).filter(word => !stopWords.has(word));
  
  // Collect all domain-specific keywords present in the query
  const allDomainKeywords = [
    ...domainKeywords.physics,
    ...domainKeywords.chemistry,
    ...domainKeywords.biology
  ];
  
  const extractedKeywords = words.filter(word => 
    word.length > 3 || allDomainKeywords.some(keyword => keyword.includes(word))
  );
  
  return Array.from(new Set(extractedKeywords)); // Remove duplicates
}

function analyzeSentiment(query: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'terrific', 'outstanding', 'superb', 'brilliant', 'awesome',
    'helpful', 'clear', 'interesting', 'love', 'like', 'enjoy',
    'appreciate', 'thanks', 'thank', 'happy', 'pleased'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing',
    'confusing', 'unclear', 'difficult', 'hard', 'complicated',
    'hate', 'dislike', 'confused', 'frustrating', 'useless',
    'unhelpful', 'wrong', 'incorrect', 'mistake', 'error'
  ];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  const words = query.split(/\s+/);
  
  for (const word of words) {
    if (positiveWords.includes(word)) {
      positiveScore++;
    } else if (negativeWords.includes(word)) {
      negativeScore++;
    }
  }
  
  // Check for negation words that flip sentiment
  const negationWords = ['not', "don't", 'cannot', "can't", 'never'];
  for (let i = 0; i < words.length - 1; i++) {
    if (negationWords.includes(words[i])) {
      // If next word is positive, reduce positive score
      if (positiveWords.includes(words[i + 1])) {
        positiveScore--;
        negativeScore++;
      }
      // If next word is negative, reduce negative score
      else if (negativeWords.includes(words[i + 1])) {
        negativeScore--;
        positiveScore++;
      }
    }
  }
  
  if (positiveScore > negativeScore) {
    return 'positive';
  } else if (negativeScore > positiveScore) {
    return 'negative';
  } else {
    return 'neutral';
  }
}
