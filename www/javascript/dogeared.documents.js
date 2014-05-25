function dogeared_documents_init(){

    // THIS IS CAUSING ALL KINDS OF PROBLEMS
    dogeared_document_init_highlight_controls();

    window.addEventListener("offline", function(e){
	dogeared_documents_on_offline(e);
    });
    
    window.addEventListener("online", function(e){
	dogeared_documents_on_online(e);
    });
       
    dogeared_documents_load_index();
    dogeared_documents_init_delete_controls();
}

function dogeared_documents_load_index(){

    if (dogeared_network_is_online()){

	try {
	    dogeared_documents_fill_cache();
	    dogeared_documents_load_cache();
	}

	catch(e){
	    dogeared_feedback_error("Oh no! There was a problem loading your documents: " + e);
	    console.log(e);
	}
    }
    
    else {
	dogeared_documents_load_cache();
    }
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

function dogeared_documents_on_online(e){
    console.log("documents: online");
}

function dogeared_documents_on_offline(e){
    console.log("documents: offline");

    if (! dogeared_documents_currently_reading()){
	dogeared_documents_load_cache();
    }
}

function dogeared_documents_load_cache(){
    dogeared_omgwtf("load documents cache");

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
    
    dogeared_document_init();
};

function dogeared_documents_get_text(doc){

    var id = doc['document_id'];
    
    if (id=='0'){
	return false;
    }
    
    var method = 'dogeared.documents.getInfo';
    var args = { 'document_id': id };
    
    var onsuccess = function(rsp){
	dogeared_cache_documents_store(rsp['document']);
    };
    
    dogeared_api_call(method, args, onsuccess);
}

function dogeared_documents_store_docs(docs){

    for (i in docs){
	dogeared_documents_get_text(docs[i]);
    }
}

function dogeared_documents_fill_cache(){

    var cache = {};

    var docs = dogeared_cache_documents();
    var count = docs.length;

    for (var i=0; i < count; i++){
	var id = docs[i]['id'];
	cache[id] = 1;
    }

    var method = 'dogeared.documents.getList';
    var args = {};
    
    var onsuccess = function(rsp){
	
	dogeared_feedback("Storing documents");

	var fresh_docs = rsp['documents']['document'];
	var count_fresh = fresh_docs.length;

	dogeared_documents_store_docs(fresh_docs);

	dogeared_feedback("Cleaning up document cache");

	for (var i=0; i < count_fresh; i++){

	    // See the way that's 'document_id' and not 'id'
	    // Yeah, that's not great... (20140516/straup)

	    var id = fresh_docs[i]['document_id'];

	    if (cache[id]){
		delete(cache[id]);
	    }
	}

	for (id in cache){
	    var key = "dogeared_" + id;
	    store.remove(key);
	}

	dogeared_feedback_reset();
    };
    
    dogeared_feedback("Fetching documents");
    dogeared_api_call(method, args, onsuccess);
}

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
