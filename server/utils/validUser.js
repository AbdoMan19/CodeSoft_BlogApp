exports.isAuth = (req, res, next) => {
if (!req.session.isAuth) {
    return res.redirect("/auth");
}
return next();
};
  
exports.isNotAuth = (req, res, next) => {
if (!req.session.isAuth) {
    return next();
}
return res.redirect("/");
};
  