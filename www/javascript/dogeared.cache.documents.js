function dogeared_cache_documents_store(doc){

    if (! store.enabled){
	console.log("localstorage is not enabled");
	return false;
    }
    
    var lastmod = doc['lastmodified'];
    var id = doc['id'];
			
    var key = "dogeared_" + id;
    store.set(key, doc);
}

function dogeared_cache_documents(){

    return dogeared_cache_get_for_type('dogeared');
}
