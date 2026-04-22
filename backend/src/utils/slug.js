const slugify = require('slugify');

const makeSlug = (text) => {
  return slugify(text || '', {
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });
};

// Tạo slug duy nhất (nếu trùng thì thêm -1, -2...)
const uniqueSlug = async (Model, text, excludeId = null) => {
  let base = makeSlug(text);
  if (!base) base = 'item-' + Date.now();
  let slug = base;
  let i = 1;
  while (true) {
    const where = { slug };
    const found = await Model.findOne({ where });
    if (!found || (excludeId && found.id === excludeId)) return slug;
    slug = `${base}-${i++}`;
  }
};

module.exports = { makeSlug, uniqueSlug };
