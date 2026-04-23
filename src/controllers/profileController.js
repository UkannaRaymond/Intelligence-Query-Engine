import { pool } from "../config/db.js";
import { buildQuery } from "../services/queryBuilder.js";
import { parseQuery } from "../utils/parser.js";

export async function getProfiles(req, res) {
  try {
    const qb = buildQuery(req.query);

    const dataQuery = `
      SELECT * FROM profiles
      ${qb.where}
      ORDER BY ${qb.sortBy} ${qb.order}
      LIMIT $${qb.values.length + 1}
      OFFSET $${qb.values.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) FROM profiles ${qb.where}
    `;

    const [data, total] = await Promise.all([
      pool.query(dataQuery, [...qb.values, qb.limit, qb.offset]),
      pool.query(countQuery, qb.values),
    ]);

    res.json({
      status: "success",
      page: qb.page,
      limit: qb.limit,
      total: parseInt(total.rows[0].count),
      data: data.rows,
    });
  } catch (err) {
    console.error("[getProfiles] Error:", err.message);
    res.status(500).json({ status: "error", message: "Server failure" });
  }
}

export async function searchProfiles(req, res) {
  try {
    const parsed = parseQuery(req.query.q);

    if (!parsed) {
      return res.status(422).json({
        status: "error",
        message: "Unable to interpret query",
      });
    }

    // Build a new query object instead of mutating req.query (it's read-only in Express)
    const mergedQuery = { ...req.query, ...parsed };

    const qb = buildQuery(mergedQuery);

    const dataQuery = `
      SELECT * FROM profiles
      ${qb.where}
      ORDER BY ${qb.sortBy} ${qb.order}
      LIMIT $${qb.values.length + 1}
      OFFSET $${qb.values.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*) FROM profiles ${qb.where}
    `;

    const [data, total] = await Promise.all([
      pool.query(dataQuery, [...qb.values, qb.limit, qb.offset]),
      pool.query(countQuery, qb.values),
    ]);

    res.json({
      status: "success",
      page: qb.page,
      limit: qb.limit,
      total: parseInt(total.rows[0].count),
      data: data.rows,
    });
  } catch (err) {
    console.error("[searchProfiles] Error:", err.message);
    res.status(500).json({ status: "error", message: "Server failure" });
  }
}
