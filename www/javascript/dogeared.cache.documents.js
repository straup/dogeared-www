function dogeared_cache_documents_store(doc){

    if (! store.enabled){
	console.log("localstorage is not enabled");
	return false;
    }
    
    var lastmod = doc['lastmodified'];
    var id = doc['id'];
			
    var key = "dogeared_" + id;
    var rsp = store.set(key, doc);

    var ok = (rsp['id'] == id) ? 1 : 0;

    if (! ok){
	dogeared_feedback_error("Failed to cache " + key + ", " + doc['title']);
    }

    // dogeared_omgwtf("store " + key + ": " + ok);

    return ok;
}

function dogeared_cache_documents(){
    return dogeared_cache_get_for_type('dogeared');
}
