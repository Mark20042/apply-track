const { UnauthorizedError } = require("../errors/index");

const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        throw new UnauthorizedError("Access denied. Admin privileges required.");
    }
    next();
};

module.exports = authorizeAdmin;
