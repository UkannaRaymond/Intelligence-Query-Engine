export function parseQuery(q) {
  if (!q) return null;

  const text = q.toLowerCase();

  const filters = {};

  // gender
  const hasMale = text.includes("male");
  const hasFemale = text.includes("female");

  if (hasMale && !hasFemale) filters.gender = "male";
  if (hasFemale && !hasMale) filters.gender = "female";

  // age keywords
  if (text.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  if (text.includes("teenager")) {
    filters.age_group = "teenager";
  }

  // numeric parsing
  const above = text.match(/above (\d+)/);
  if (above) filters.min_age = parseInt(above[1]);

  const below = text.match(/below (\d+)/);
  if (below) filters.max_age = parseInt(below[1]);

  // countries
  const countryMap = {
    nigeria: "NG",
    kenya: "KE",
    angola: "AO",
    benin: "BJ",
  };

  for (const key in countryMap) {
    if (text.includes(key)) {
      filters.country_id = countryMap[key];
    }
  }

  return Object.keys(filters).length ? filters : null;
}
