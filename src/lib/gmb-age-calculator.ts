import { BusinessAgeInfo } from '@/types';

/**
 * Calculates business age and status (New vs Established) from founding year or start date
 */
export function calculateBusinessAge(foundedYearOrDate?: number | string | Date): BusinessAgeInfo {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  if (!foundedYearOrDate) {
    // Default fallback to 2 years if unknown
    return {
      years: 2,
      months: 0,
      isNew: false,
      label: 'Established (~2 yrs)',
      badgeColor: 'blue',
    };
  }

  let foundedYear: number;
  let foundedMonth = 1;

  if (typeof foundedYearOrDate === 'number') {
    foundedYear = foundedYearOrDate;
  } else if (typeof foundedYearOrDate === 'string' && /^\d{4}$/.test(foundedYearOrDate)) {
    foundedYear = parseInt(foundedYearOrDate, 10);
  } else {
    const d = new Date(foundedYearOrDate);
    if (!isNaN(d.getTime())) {
      foundedYear = d.getFullYear();
      foundedMonth = d.getMonth() + 1;
    } else {
      foundedYear = currentYear - 2;
    }
  }

  let years = currentYear - foundedYear;
  let months = currentMonth - foundedMonth;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Ensure non-negative
  if (years < 0) {
    years = 0;
    months = 1;
  }

  // Determine if newly opened (up to 1 year) or established
  const isNew = years <= 1;

  let label = '';
  let badgeColor: 'emerald' | 'amber' | 'blue' | 'purple' = 'blue';

  if (isNew) {
    if (years === 0) {
      const displayMonths = Math.max(1, months || 3);
      label = `✨ Newly Opened (${displayMonths} mos)`;
    } else {
      label = `✨ Newly Opened (~1 yr)`;
    }
    badgeColor = 'emerald';
  } else if (years < 3) {
    label = `Rising Business (${years} yrs)`;
    badgeColor = 'blue';
  } else if (years < 6) {
    label = `Established (${years} yrs)`;
    badgeColor = 'purple';
  } else {
    label = `Veteran Business (${years}+ yrs)`;
    badgeColor = 'amber';
  }

  return {
    years,
    months,
    foundedYear,
    isNew,
    label,
    badgeColor,
  };
}
