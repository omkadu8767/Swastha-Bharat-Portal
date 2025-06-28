// Example admin middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({ message: "Access denied" });
    }
  };

module.exports = isAdmin;