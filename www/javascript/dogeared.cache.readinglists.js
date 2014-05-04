function dogeared_cache_readinglists_store(docs){

    if (! store.enabled){
	console.log("localstorage is not enabled");
	return false;
    }

    /*
    var lastmod = doc['lastmodified'];
    var id = doc['id'];
    */

    var key = "readinglist";
    var set_cache = 1;
    
    if (cache = store.get(key)){

	/*
	var cache_lastmod = cache['lastmodified'];
	
	if (cache_lastmod >= lastmod){
	    set_cache = 0;
	}
	*/

    }
    
    if (set_cache){
	store.set(key, docs);
    }

}
