require('dotenv').config();
const { sequelize } = require('../models');

(async () => {
  try {
    console.log('🔄 Syncing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✅ Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  }
})();
