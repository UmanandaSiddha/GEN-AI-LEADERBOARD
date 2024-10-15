export const isAdmin = async (req, res, next) => {
    try {
        if (req.query.id !== process.env.ADMIN_ID) {
            return next(new Error("Access denied. You are not authorized as an admin."));
        }
        next();
    } catch (error) {
        return next(new Error("Access denied. You are not authorized as an admin."));
    }
}