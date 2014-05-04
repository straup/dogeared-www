function dogeared_cache_count_for_type(type){

    var count = 0;

    store.forEach(function(key, val){

	var parts = key.split("_");
	var ima = parts[0];
	
	if (ima == type){
	    count += 1;
	}
    });

    return count;
}

function dogeared_cache_get_for_type(type){

    var stuff = new Array();

    store.forEach(function(key, val){

	// store.remove(key);
	// continue;

	var parts = key.split("_");
	var ima = parts[0];
	
	if (ima == type){
	    val['cache_key'] = key;
	    stuff.push(val);
	}
    });

    return stuff;
}
