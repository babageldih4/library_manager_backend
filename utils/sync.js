const { sequelize } = require('../models');

(async () => {
  await sequelize.sync({ force: true });
  console.log('DB Synced');
  process.exit(1);
})();
