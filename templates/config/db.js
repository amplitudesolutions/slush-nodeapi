var env = process.env.NODE_ENV || "development";

if (env === "production" || env === "development")
	url = process.env.MONGODB_URI || "<%= mongoPath%>/<%= appName %>";
else if (env ==="test")
	url = "<%= mongoPath%>/<%= appName %>_test";

module.exports = url