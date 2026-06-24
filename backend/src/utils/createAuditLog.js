const AuditLog = require('../models/auditLog.model');

const createAuditLog = async({
    userId,
    action,
    req
}) => {

    await AuditLog.create({

        userId,

        action,

        ipAddress: req.ip,

        route: req.originalUrl,

        method: req.method

    });

};

module.exports = createAuditLog;