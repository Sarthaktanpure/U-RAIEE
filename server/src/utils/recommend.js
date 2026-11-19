// Rule-based pathway recommendation engine
// Maps submission type and domain/keywords to recommended progression steps

function generateRecommendation({ type, domain, keywords = [], stage }) {
  const baseMap = {
    idea: ['Concept Validation', 'Expert Guidance', 'Prototype Development'],
    project: ['Technical Validation', 'Prototype Development', 'IP Support'],
    research: ['Research Validation', 'Conference or Journal Submission', 'Prototype Development'],
    prototype: ['Pilot Testing', 'IP Support', 'Startup / MSME Pathway']
  };

  let pathway = [...(baseMap[type] || baseMap.idea)];

  // Normalize keywords array or comma-separated string
  let kwList = [];
  if (Array.isArray(keywords)) {
    kwList = keywords.map(k => String(k).toLowerCase());
  } else if (typeof keywords === 'string') {
    kwList = keywords.toLowerCase().split(',').map(s => s.trim());
  }

  // Priority shifts based on keywords
  const promoteStep = (targetStep) => {
    const idx = pathway.indexOf(targetStep);
    if (idx > 0) {
      pathway.splice(idx, 1);
      pathway.unshift(targetStep);
    } else if (idx === -1) {
      pathway.unshift(targetStep);
    }
  };

  if (kwList.some(k => k.includes('startup') || k.includes('msme') || k.includes('business'))) {
    promoteStep('Startup / MSME Pathway');
  }
  if (kwList.some(k => k.includes('patent') || k.includes('ip') || k.includes('copyright'))) {
    promoteStep('IP Support');
  }
  if (kwList.some(k => k.includes('journal') || k.includes('conference') || k.includes('paper'))) {
    promoteStep('Conference or Journal Submission');
  }
  if (kwList.some(k => k.includes('industry') || k.includes('pilot') || k.includes('field'))) {
    promoteStep('Pilot Testing');
  }

  const headline = `Recommended next step: ${pathway[0]}. Focus on structured institutional validation before progression.`;

  return {
    pathway,
    headlineRecommendation: headline,
    recommendationSource: 'Rule-based pathway recommendation (AI-assisted personalization is planned as the next layer)'
  };
}

module.exports = { generateRecommendation };
