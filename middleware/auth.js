const { tokenValidation } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = tokenValidation(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}

    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
