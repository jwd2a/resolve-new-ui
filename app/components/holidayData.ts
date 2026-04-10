export interface HolidayCategory {
  category: string;
  holidays: string[];
}

export const HOLIDAY_CATEGORIES: HolidayCategory[] = [
  {
    category: "Federal Holidays",
    holidays: [
      "New Year's Day",
      "Martin Luther King Jr. Day",
      "Presidents' Day",
      "Memorial Day",
      "Juneteenth",
      "Independence Day",
      "Labor Day",
      "Columbus Day / Indigenous Peoples' Day",
      "Veterans Day",
      "Thanksgiving",
      "Christmas Day",
    ]
  },
  {
    category: "Religious & Cultural",
    holidays: [
      "Easter",
      "Good Friday",
      "Passover",
      "Hanukkah",
      "Eid al-Fitr",
      "Eid al-Adha",
      "Diwali",
      "Rosh Hashanah",
      "Yom Kippur",
    ]
  },
  {
    category: "Family & Personal",
    holidays: [
      "Mother's Day",
      "Father's Day",
      "Children's Birthdays",
      "Parent 1's Birthday",
      "Parent 2's Birthday",
    ]
  },
  {
    category: "Seasonal & Other",
    holidays: [
      "New Year's Eve",
      "Valentine's Day",
      "St. Patrick's Day",
      "Halloween",
      "Christmas Eve",
      "Day After Thanksgiving",
    ]
  }
];

// Flat list of all preset holiday names for convenience
export const ALL_PRESET_HOLIDAYS = HOLIDAY_CATEGORIES.flatMap(c => c.holidays);

export function getCategoryForHoliday(name: string): string | undefined {
  for (const cat of HOLIDAY_CATEGORIES) {
    if (cat.holidays.includes(name)) return cat.category;
  }
  return undefined;
}
