const success = (res, data = null, message = 'Thành công', status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

const paginated = (res, rows, count, page, limit, message = 'Thành công') => {
  return res.status(200).json({
    success: true,
    message,
    data: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit),
    },
  });
};

const error = (res, message = 'Lỗi', status = 400, errors = null) => {
  return res.status(status).json({ success: false, message, errors });
};

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

module.exports = { success, error, paginated, getPagination };
