var dogeared_fill_cache_count = 0;

function dogeared_documents_init(){

    window.addEventListener("offline", function(e){
	dogeared_documents_on_offline(e);
    });
    
    window.addEventListener("online", function(e){
	dogeared_documents_on_online(e);
    });
       
    dogeared_documents_load_index();
}

function dogeared_documents_on_online(e){
    dogeared_omgwtf("documents: online");

    dogeared_documents_process_to_delete();
}

function dogeared_documents_on_offline(e){
    dogeared_omgwtf("documents: offline");

    if (! dogeared_documents_currently_reading()){
	dogeared_documents_load_cache();
    }
}

function dogeared_documents_process_to_delete(){

    var key = "dogeared_to_delete";
    var to_delete = store.get(key);

    for (id in to_delete){
	dogeared_omgwtf("process pending delete for document " + id);

	if (! id){
	    delete(to_delete[id]);
	    store.set(key, to_delete);
	    continue;
	}

	var method = "dogeared.documents.deleteDocument";
	var args = { 'document_id': id };

	var on_success = function(rsp){

	    var _key = "dogeared_to_delete";
	    var _cache = store.get(_key);
	    delete(_cache[id]);
	    store.set(_key, _cache);
	};

	dogeared_api_call(method, args, on_success);	
    }
}

function dogeared_documents_load_index(){

    if (dogeared_network_is_online()){

	try {

	    var callback = function(){

		var _load = function(){
		    
		    // dogeared_omgwtf("checking fill count: " + dogeared_fill_cache_count);
		    
		    if (! dogeared_fill_cache_count){
			dogeared_documents_load_cache();
			return;
		    }
		    
		    dogeared_feedback("Loading documents, " + dogeared_fill_cache_count + " left");
		    setTimeout(_load, 500);
		};
		
		_load();
	    };

	    dogeared_documents_fill_cache(callback);

	}

	catch(e){
	    dogeared_feedback_error("Oh no! There was a problem loading your documents: " + e);
	    console.log(e);
	}
    }
    
    else {
	dogeared_documents_load_cache();
    }

    dogeared_document_unbind_highlight_controls();
}

function dogeared_documents_init_delete_controls(){

    dogeared_omgwtf("init documents delete controls");

    var delete_document = function(el){

	if (! confirm("Are you sure you want to remove this document?")){
	    return false;
	}
	
	var id = el.attr("data-document-id");

	if (! id){
	    alert("Unable to determine document ID");
	    return false;
	}
	
	dogeared_omgwtf("delete document " + id);
	
	if (! dogeared_network_is_online()){

	    var key = "dogeared_to_delete";
	    var cache = store.get(key);

	    if (! cache){
		cache = {};
	    }

	    cache[id] = true;
	    store.set(key, cache);

	    var wrapper = $("#dogeared-document-" + id);
	    wrapper.remove();

	    dogeared_feedback_modal("Okay. That document has been queued for deletion.");
	    return false;
	}

	var method = "dogeared.documents.deleteDocument";
	var args = { 'document_id': id };

	var on_success = function(rsp){

	    var doc = $("#document-" + id);
	    doc.remove();

	    var key = "dogeared_" + id;
	    store.remove(key);

	    dogeared_feedback("Okay, that document has been removed from your reading list");
	    dogeared_documents_load_index();
	};

	dogeared_api_call(method, args, on_success);
    };

    $(".delete-document").click(function(e){

	dogeared_omgwtf("click to delete");	
	
	try {
	    var el = $(this);
	    delete_document(el);
	}

	catch(e){
	    dogeared_feedback_error("Huh. Deleting your document failed because: " + e);	
	}
    });

}

function dogeared_documents_load_cache(){
    dogeared_omgwtf("load documents cache");
    dogeared_feedback_reset();

    window.scrollTo(0,0);
    
    var delete_key = "dogeared_to_delete";
    var to_delete = store.get(delete_key);

    var docs = dogeared_cache_documents();
    var count = docs.length;

    if (count == 0){
	return false;
    }
    
    docs = dogeared_documents_sort(docs);

    $(".excerpt").remove();
    $(".document").remove();
    
    var documents = $("#documents");
    
    var root = dogeared_abs_root_url();

    for (var i = 0; i < count; i++){
	
	var doc = docs[i];
	var id = doc['id'];

	if (! id){
	    continue;
	}

	if ((to_delete) && (to_delete[id])){
	    dogeared_omgwtf("skipping document " + id + " because it is set to be deleted");
	    continue;
	}
	
	var title = doc['display_title'];

	if (title == undefined){
	    title = "Unknown title #" + id;
	}

	dogeared_omgwtf("load " + title + " (" + id + ") " + doc['created']);

	var document_url = dogeared_abs_root_url();
	document_url += 'documents/' + id + '/';

	var row = '<div class="row excerpt"';
	row += ' id="dogeared-document-' + id + '"';
	row += '>';
	row += '<h3><a href="';
	row += document_url;
	row += '" class="load-doc" data-document-id="';
	row += htmlspecialchars(id);
	row += '">';
	row += htmlspecialchars(title);
	row += '</a>';
	row += ' <pre><small>' + htmlspecialchars(doc['url']) + '</small></pre>';
	row += '</h3>';

	row += '<div>';
	row += '<button class="btn btn-sm delete-document pull-right" data-document-id="';
	row += id;
	row += '" data-button-action="delete">Delete</button>';
	row += '</div>';

	row += '</div>';
	
	documents.append(row);			
    }
    
    $(".load-doc").click(function(){

	try {
	    if (dogeared_network_is_online()){
		// return true;
	    }
	    
	    var el = $(this);
	    var id = el.attr("data-document-id");
	    
	    dogeared_documents_load_doc(id);
	}
	
	catch(e) {
	    dogeared_feedback("Failed to load document because " + e);
	    console.log(e);
	}

	return false;
    });
    
    dogeared_documents_init_delete_controls();
    dogeared_document_init();
};

function dogeared_documents_get_text(doc){

    var id = doc['document_id'];
    
    if (id=='0'){
	return false;
    }
    
    var method = 'dogeared.documents.getInfo';
    var args = { 'document_id': id };
    
    var on_success = function(rsp){

	var _doc = rsp['document'];

	var ok = dogeared_cache_documents_store(_doc);

	dogeared_omgwtf("store " + _doc['display_title'] + " (" + _doc['id'] + ") " + ok);
	dogeared_documents_fill_cache_decr();
    };
    
    var on_error = function(rsp){
	dogeared_documents_fill_cache_decr();
    };
   
    dogeared_api_call(method, args, on_success, on_error);
    dogeared_documents_fill_cache_incr();
}

function dogeared_documents_store_docs(docs){

    dogeared_documents_fill_cache_reset();

    for (i in docs){
	dogeared_documents_get_text(docs[i]);
    }
}

function dogeared_documents_fill_cache_reset(){
    dogeared_fill_cache_count = 0;
}

function dogeared_documents_fill_cache_incr(){
    dogeared_fill_cache_count += 1;
}

function dogeared_documents_fill_cache_decr(){

    if (dogeared_fill_cache_count){
	dogeared_fill_cache_count -= 1;
    }

}

function dogeared_documents_fill_cache(callback){

    var purge_cache = {};

    var docs = dogeared_cache_documents();
    var count = docs.length;

    for (var i=0; i < count; i++){
	var id = docs[i]['id'];
	var lastmod = docs[i]['lastmodified'];
	purge_cache[id] = lastmod;
    }

    var method = 'dogeared.documents.getList';
    var args = {};
    
    var on_success = function(rsp){
	
	dogeared_feedback("Storing documents");

	var fresh_docs = rsp['documents']['document'];
	var count_fresh = fresh_docs.length;

	dogeared_documents_store_docs(fresh_docs);

	dogeared_feedback("Cleaning up document cache");

	for (var i=0; i < count_fresh; i++){

	    // See the way that's 'document_id' and not 'id'
	    // Yeah, that's not great... (20140516/straup)

	    var id = fresh_docs[i]['document_id'];

	    if (purge_cache[id]){
		// dogeared_omgwtf("remove " + id + " from purge cache");
		delete(purge_cache[id]);
	    }
	}

	for (id in purge_cache){
	    var key = "dogeared_" + id;
	    // dogeared_omgwtf("remove " + key + " from list");
	    store.remove(key);
	}

	dogeared_feedback_reset();

	if (callback){
	    callback();
	}
    };
    
    var on_error = function(rsp){

    };

    dogeared_feedback("Fetching documents");
    dogeared_api_call(method, args, on_success, on_error);
}

// This is not working correctly because... computers?
// (20140526/straup)

function dogeared_documents_sort(docs){

    // http://phpjs.org/functions/usort/
    // http://phpjs.org/functions/array_values/

    var sort = function(a, b){

	if (a['created'] == b['created']) {
            return 0;
	}

	return (a['created'] > b['created']) ? -1 : 1;
    };

    docs = usort(docs, sort);
    docs = array_values(docs);

    return docs;
}

function dogeared_documents_currently_reading(){
    // sudo make me better...
    var reading = ($("#document").html()) ? 1 : 0;
    return reading;
}

function dogeared_documents_load_doc(id){

    var key = "dogeared_" + id;
    var doc = store.get(key);
    
    var title = doc['display_title'];

    if (title == undefined){
	title = "Unknown title #" + id;
    }
    
    var body = JSON.parse(doc['body']);
    
    var url = htmlspecialchars(doc['url']);
    
    var txt = '<div class="document" id="document"';
    txt += ' data-document-id="';
    txt += htmlspecialchars(id);
    txt += '">';
    
    txt += '<div class="row">';
    txt += '<h3>';
    txt += htmlspecialchars(title);
    txt += '</h3>';
    txt += ' <pre><small>' + url + '</small></pre>';
    txt += '</div>';
    
    txt += '<div class="row">';
    
    for (var i in body){
	txt += '<p>';
	txt += htmlspecialchars(body[i]);
	txt += '</p>';
    }
    
    txt += '</div>';
    
    txt += '<div class="row">';
    txt += ' <pre><small>' + url + '</small></pre>';
    txt += '</div>';
    
    txt += '<div>';
    txt += '<a href="">reading list</a>';
    txt += '</div>';
    
    txt += '</div>';
    
    var documents = $("#documents");
    documents.append(txt);
    
    $(".excerpt").remove();
    
    dogeared_document_init_doc(id);
}
