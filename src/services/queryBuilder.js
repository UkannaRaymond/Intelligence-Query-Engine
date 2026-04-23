export function buildQuery(query) {
  const filters = [];
  const values = [];

  const add = (condition, value) => {
    values.push(value);
    filters.push(`${condition} $${values.length}`);
  };

  if (query.gender) add("gender =", query.gender);
  if (query.age_group) add("age_group =", query.age_group);
  if (query.country_id) add("country_id =", query.country_id);

  // Cast to numbers — query params always arrive as strings from req.query
  if (query.min_age) add("age >=", Number(query.min_age));
  if (query.max_age) add("age <=", Number(query.max_age));

  if (query.min_gender_probability)
    add("gender_probability >=", Number(query.min_gender_probability));

  if (query.min_country_probability)
    add("country_probability >=", Number(query.min_country_probability));

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const allowedSortFields = ["age", "created_at", "gender_probability"];
  const sortBy = allowedSortFields.includes(query.sort_by)
    ? query.sort_by
    : "created_at";

  const order = query.order === "asc" ? "ASC" : "DESC";

  const limit = Math.min(parseInt(query.limit) || 10, 50);
  const page = Math.max(parseInt(query.page) || 1, 1); // prevent page 0 or negative
  const offset = (page - 1) * limit;

  return {
    where,
    values,
    sortBy,
    order,
    limit,
    offset,
    page,
  };
}
