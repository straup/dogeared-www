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

function dogeared_cache_get(key, cb){

    localforage.getItem(key, cb);
}

function dogeared_cache_set(key, data, cb){

    localforage.setItem(key, data, cb);
}

function dogeared_cache_unset(key, cb){

    localforage.removeItem(key, cb);
}

function dogeared_cache_keys(re, on_match){

    var cb = function(keys){

	var count = keys.length;

	for (var i = 0; i < count; i++){

	    var key = keys[i];

	    var m = key.match(re);

	    if (m){
		on_match(key, m);
	    }
	}
    };

    localforage.keys(cb);
}

function dogeared_cache_store_document(doc, cb){

    var key = "dogeared_" + doc['id'];

    if (! cb){

	cb = function(rsp){
	    console.log(rsp);
	};
    }

    dogeared_cache_set(key, doc, cb);
}

function dogeared_cache_load_document(document_id, cb){

    var key = "dogeared_" + document_id;
    dogeared_cache_get(key, cb);
}

function dogeared_cache_remove_document(document_id, cb){

    var key = "dogeared_" + document_id;

    if (! cb){
	cb = function(rsp){
	    dogeared_feedback("Okay, that document (" + htmlspecialchars(document_id) + ") has been removed from your reading list");
	};
    }

    dogeared_cache_unset(key, cb);
}

function dogeared_cache_store_highlight(hl, cb){

    var hash = hex_md5(hl['text']);
    hl['hash'] = hash;

    var key = "highlight_" + hash;

    if (! cb){

	cb = function(rsp){
	    dogeared_omgwtf("stored " + key);
	    var hint = $('#has-pending');
	    hint.show();
	};
    }

    dogeared_cache_set(key, hl, cb);
}

function dogeared_cache_schedule_pending_delete(document_id){

    var key = "dogeared_delete_" + document_id;
    dogeared_cache_set(key, true);
}

function dogeared_cache_remove_pending_delete(document_id){

    var key = "dogeared_delete_" + document_id;

    var method = "dogeared.documents.deleteDocument";
    var args = { 'document_id': document_id };

    var on_success = function(rsp){

	dogeared_cache_unset(key);
    };

    dogeared_api_call(method, args, on_success);
}

// ugh... fucking javascript

function dogeared_cache_list_pending_delete(){

    var cache = {};

    var cb = function(key, match){

	var document_id = match[1];
	cache[document_id] = true;
    };

    dogeared_cache_keys(cb);
}

function dogeared_cache_process_pending_delete(){

    var cb = function(key, match){

	var document_id = match[1];

	dogeared_cache_remove_pending_delete(document_id);
    };

    dogeared_cache_keys(cb);
}
