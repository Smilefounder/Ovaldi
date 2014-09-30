define(["doh/main", "require"], function(doh, require){
	if(doh.isBrowser){
		doh.register("tests.Masker", require.toUrl("./Masker.html"), 60000);	// tests dojo.query() back-compat shim
	}
});
