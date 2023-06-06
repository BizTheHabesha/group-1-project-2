const { ClogHttp } = require("./clog");

const withoutAuth = (req, res, next) => {
	const clog = new ClogHttp("withouthAuth() => redir?", true);
	// If the user logged in, redirect the request to the homepage
	if (req.session.logged_in) {
		clog.httpStatus(100);
		res.redirect("/");
	} else {
		clog.info("continue");
		next();
	}
};

module.exports = withoutAuth;
