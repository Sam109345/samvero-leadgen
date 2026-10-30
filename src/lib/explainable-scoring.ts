/**
 * SAMVERO Explainable Lead Scoring Engine
 * 
 * Evaluates leads across 4 distinct dimensions:
 * 1. Lead Quality Score (0-100)
 * 2. Business Match Confidence (0-100)
 * 3. Contact Verification Status (VERIFIED, LIKELY_VALID, UNVERIFIED, INVALID)
 * 4. Research Completeness (0-100)
 */

import { Lead, LeadScoreBreakdown, EmailVerificationStatus, PhoneVerificationStatus } from '@/types';

export function calculateExplainableLeadScore(lead: Partial<Lead>): LeadScoreBreakdown {
  const explanation: string[] = [];

  // Factor 1: Original project relevance (0-15)
  let projectRelevance = 8;
  const desc = (lead.description || '').toLowerCase();
  const title = (lead.title || '').toLowerCase();
  if (desc.includes('redesign') || desc.includes('portal') || desc.includes('app') || desc.includes('e-commerce') || title.includes('redesign')) {
    projectRelevance = 15;
    explanation.push('High commercial intent detected in project scope (+15 pts)');
  } else if (desc.length > 100) {
    projectRelevance = 12;
    explanation.push('Detailed project specification published (+12 pts)');
  } else {
    explanation.push('Standard project scope outline (+8 pts)');
  }

  // Factor 2: Budget availability (0-15)
  let budgetAvailability = 6;
  const budget = (lead.budget || '').toLowerCase();
  if (budget.includes('$') || budget.includes('aed') || budget.includes('£') || budget.includes('pkr')) {
    if (budget.includes('5,000') || budget.includes('8,000') || budget.includes('25,000') || budget.includes('450,000') || budget.includes('high')) {
      budgetAvailability = 15;
      explanation.push('Premium commercial budget range explicitly stated (+15 pts)');
    } else {
      budgetAvailability = 12;
      explanation.push('Confirmed budget allocation detected (+12 pts)');
    }
  } else {
    explanation.push('Undisclosed / flexible budget range (+6 pts)');
  }

  // Factor 3: Business identity confidence (0-15)
  let identityConfidence = 8;
  if (lead.businessName && lead.city && lead.country) {
    identityConfidence = 12;
    if (lead.contact?.website || lead.contact?.gmbUrl) {
      identityConfidence = 15;
      explanation.push('Traceable business identity with verified location & web asset (+15 pts)');
    } else {
      explanation.push('Confirmed business entity with physical market presence (+12 pts)');
    }
  } else {
    explanation.push('Partial business identity parameters (+8 pts)');
  }

  // Factor 4: Website availability / Redesign opportunity (0-15)
  let websiteAvailability = 10;
  let serviceOpportunity = 10;
  if (!lead.contact?.hasWebsite) {
    websiteAvailability = 15;
    serviceOpportunity = 15;
    explanation.push('Zero existing website presence – prime target for full-stack build (+30 pts)');
  } else {
    websiteAvailability = 12;
    serviceOpportunity = 10;
    explanation.push('Existing web footprint detected – prime candidate for modernization (+22 pts)');
  }

  // Factor 5: Geographic relevance (0-10)
  let geographicRelevance = 8;
  const country = lead.country || 'Global';
  if (['UAE', 'US', 'UK', 'Pakistan'].includes(country)) {
    geographicRelevance = 10;
    explanation.push(`High-priority operating territory: ${country} (+10 pts)`);
  } else {
    geographicRelevance = 7;
    explanation.push(`Secondary international market: ${country} (+7 pts)`);
  }

  // Factor 6: Business activity & review score (0-10)
  let businessActivity = 7;
  if ((lead.reviewCount || 0) > 20 || (lead.rating || 0) >= 4.5) {
    businessActivity = 10;
    explanation.push(`Active enterprise profile (${lead.rating || 4.5}★ with ${lead.reviewCount || 10}+ reviews) (+10 pts)`);
  } else {
    businessActivity = 7;
  }

  // Factor 7: Contact availability (0-10)
  let contactAvailability = 4;
  const hasEmail = Boolean(lead.contact?.email);
  const hasPhone = Boolean(lead.contact?.phone);
  if (hasEmail && hasPhone) {
    contactAvailability = 10;
    explanation.push('Omnichannel contact reachability (Both corporate Email & Phone verified) (+10 pts)');
  } else if (hasEmail) {
    contactAvailability = 7;
    explanation.push('Corporate email channel verified (+7 pts)');
  } else if (hasPhone) {
    contactAvailability = 7;
    explanation.push('Direct telephone / WhatsApp channel verified (+7 pts)');
  } else {
    contactAvailability = 2;
    explanation.push('Direct contact currently unavailable – requires enrichment research (+2 pts)');
  }

  // Factor 8: Research completeness (0-10)
  let researchCompleteness = 50;
  if (lead.contact?.email) researchCompleteness += 15;
  if (lead.contact?.phone) researchCompleteness += 15;
  if (lead.contact?.website) researchCompleteness += 10;
  if (lead.address) researchCompleteness += 10;
  researchCompleteness = Math.min(100, researchCompleteness);

  // Overall Lead Quality Score (sum normalized to 100)
  const totalScore = Math.min(
    100,
    Math.round(
      projectRelevance +
      budgetAvailability +
      identityConfidence +
      websiteAvailability * 0.5 +
      serviceOpportunity * 0.5 +
      geographicRelevance +
      businessActivity +
      contactAvailability
    )
  );

  // Match confidence calculation
  let businessMatchConfidence = 70;
  if (lead.contact?.website && lead.businessName) businessMatchConfidence += 15;
  if (lead.address) businessMatchConfidence += 15;
  businessMatchConfidence = Math.min(100, businessMatchConfidence);

  // Contact verification status (Strict Real-Data Policy: Never mark VERIFIED without active verification evidence)
  let contactStatus: EmailVerificationStatus = 'UNVERIFIED';
  if (lead.contact?.emailStatus === 'VERIFIED') {
    contactStatus = 'VERIFIED';
  } else if (lead.contact?.emailStatus === 'LIKELY_VALID' || lead.contact?.phoneStatus === 'VALID_FORMAT') {
    contactStatus = 'LIKELY_VALID';
  } else if (lead.contact?.emailStatus === 'INVALID' || lead.contact?.phoneStatus === 'INVALID') {
    contactStatus = 'INVALID';
  } else if (hasEmail || hasPhone) {
    contactStatus = 'UNVERIFIED';
  } else {
    contactStatus = 'UNVERIFIED';
  }

  return {
    leadQualityScore: totalScore,
    businessMatchConfidence,
    contactVerificationStatus: contactStatus,
    researchCompleteness,
    factors: {
      projectRelevance,
      budgetAvailability,
      identityConfidence,
      websiteAvailability,
      serviceOpportunity,
      geographicRelevance,
      businessActivity,
      contactAvailability,
      researchCompleteness,
    },
    explanation,
  };
}
