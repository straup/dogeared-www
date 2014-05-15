function dogeared_documents_init(){

    dogeared_document_init_highlight_controls();

    window.addEventListener("offline", function(e){
	dogeared_documents_on_offline(e);
    });
    
    window.addEventListener("online", function(e){
	dogeared_documents_on_online(e);
    });
    
    $("#dogeared-navi li a").click(function(){
	
	if (! dogeared_network_is_online()){
	    
	    var el = $(this);
	    
	    if (el.html() == 'reading list'){
		dogeared_documents_load_cache();
	    }
	    
	    return false;
	}
    });
 
    $(".delete-document").click(function(){

	if (! confirm("Are you sure you want to remove this document?")){
	    return false;
	}
	
	var el = $(this);
	var id = el.attr("data-document-id");

	var method = "dogeared.documents.deleteDocument";
	var args = { 'document_id': id };

	var on_success = function(rsp){

	    var doc = $("#document-" + id);
	    doc.remove();

	    var key = "dogeared_" + id;
	    store.remove(key);

	    dogeared_feedback("Okay, that document has been removed from your reading list");
	};

	dogeared_api_call(method, args, on_success);
    });
   
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

function dogeared_documents_on_online(e){
    console.log("documents: online");

    // Why doesn't this work?
    // $(".delete-document").show();
}

function dogeared_documents_on_offline(e){
    console.log("documents: offline");

    // Why doesn't this work?
    // $(".delete-document").hide();

    dogeared_documents_load_cache();
}

function dogeared_documents_load_cache(){

    console.log("load cache");
    
    var docs = dogeared_cache_documents();
    docs = dogeared_documents_sort(docs);

    var count = docs.length;

    if (count == 0){
	return false;
    }
    
    // console.log(docs);
    docs.reverse();

    $(".excerpt").remove();
    $(".document").remove();
    
    var documents = $("#documents");
    var key = {};
    
    var root = dogeared_abs_root_url();

    /*
      move these functions in to dogeared.document.js
      just because it would be... well, would it really?
      (20140506/straup)
    */
    
    for (var i = 0; i < count; i++){
	
	var doc = docs[i];
	var id = doc['id'];

	var title = doc['display_title'];

	if (title == undefined){
	    title = "Unknown title #" + id;
	}

	key[id] = i;
	
	var document_url = dogeared_abs_root_url();
	document_url += 'documents/' + id + '/';

	var row = '<div class="row excerpt">';
	row += '<h3><a href="';
	row += document_url;
	row += '" class="load-doc" data-document-id="';
	row += htmlspecialchars(id);
	row += '">';
	row += htmlspecialchars(title);
	row += '</a>';
	row += ' <small>' + htmlspecialchars(doc['url']) + '</small>';
	row += '</h3>';

	row += '<div>';
	row += '<button class="btn btn-sm delete-document" data-document-id="';
	row += id;
	row += '" data-button-action="delete">Delete</button>';
	row += '</div>';

	row += '</div>';
	
	documents.append(row);			
    }
    
    $(".load-doc").click(function(){

	if (dogeared_network_is_online()){
	    return true;
	}

	var el = $(this);
	
	var id = el.attr("data-document-id");
	var idx = key[id];
	var doc = docs[idx];

	var title = doc['display_title'];

	if (title == undefined){
	    title = "Unknown title #" + id;
	}

	var body = JSON.parse(doc['body']);
	
	var txt = '<div class="row document" id="document"';
	txt += ' data-document-id="';
	txt += htmlspecialchars(id);
	txt += '">';
	
	txt += '<h3>';
	txt += htmlspecialchars(title);
	txt += '<small>offline cache</small>';
	txt += '</h3>';

	for (var i in body){
	    txt += '<p>';
	    txt += htmlspecialchars(body[i]);
	    txt += '</p>';
	}
	
	txt += '</document>';
	
	$(".excerpt").remove();
	documents.append(txt);
	
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

    var method = 'dogeared.documents.getList';
    var args = {};
    
    var onsuccess = function(rsp){
	
	// dogeared_cache_readinglists_store(rsp['documents']);
	dogeared_documents_store_docs(rsp['documents']['document'])
    };
    
    dogeared_api_call(method, args, onsuccess);
}

function dogeared_documents_sort(docs){

    // http://phpjs.org/functions/usort/
    // http://phpjs.org/functions/array_values/

    var sort = function(a, b){

	if (a['created'] == b['created']) {
            return 0;
	}

	return (a['created'] < b['created']) ? -1 : 1;
    };

    docs = usort(docs, sort);
    docs = array_values(docs);

    return docs;
}
