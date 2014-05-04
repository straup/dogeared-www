function dogeared_cache_count_for_type(type){

    var count = 0;

    store.forEach(function(key, val) {

	var parts = key.split("_");
	var ima = parts[0];
	
	if (ima == type){
	    count += 1;
	}
    });

    return count;
}

function dogeared_cache_store_document(doc){

    if (! store.enabled){
	console.log("localstorage is not enabled");
	return false;
    }
    
    var lastmod = doc['lastmodified'];
    var id = doc['id'];
			
    var key = "dogeared_" + id;
    var set_cache = 1;
    
    if (cache = store.get(key)){

	var cache_lastmod = cache['lastmodified'];
	
	if (cache_lastmod >= lastmod){
	    set_cache = 0;
	}
    }
    
    if (set_cache){
	//  console.log("set " + key);
	store.set(key, doc);
    }

}
