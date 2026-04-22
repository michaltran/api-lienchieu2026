const { ActivityLog } = require('../models');

const logActivity = async (req, { action, entity, entityId, description, metadata }) => {
  try {
    await ActivityLog.create({
      userId: req.user?.id || null,
      action,
      entity,
      entityId,
      description,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'],
      metadata,
    });
  } catch (err) {
    console.error('[ActivityLog] Failed:', err.message);
  }
};

module.exports = { logActivity };
