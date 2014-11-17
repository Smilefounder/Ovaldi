define(["doh/main", "require"], function(doh, require){
	if(doh.isBrowser){
		doh.register("tests.Lighter", require.toUrl("./Lighter.html"), 60000);	// tests dojo.query() back-compat shim
	}
});
