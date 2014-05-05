function dogeared_documents_init(){

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
    
    if (dogeared_network_is_online()){
	dogeared_documents_fill_cache();
    }
    
    else {
	dogeared_documents_load_cache();
    }
}

function dogeared_documents_on_online(e){
    console.log("local: online");
}

function dogeared_documents_on_offline(e){
    console.log("local: offline");
    dogeared_documents_load_cache();
}

function dogeared_documents_load_cache(){

    console.log("load cache");
    
    var docs = dogeared_cache_documents();
    
    if (docs.length == 0){
	return false;
    }
    
    $(".excerpt").remove();
    $("#document").remove();
    
    var documents = $("#documents");
    var key = {};
    
    var root = dogeared_abs_root_url();
    
    for (var i in docs){
	
	var doc = docs[i];
	key[doc['id']] = i;
	
	// console.log(doc);
	
	var row = '<div class="row excerpt">';
	row += '<h3><a href ="';
	row += root + 'documents/' + doc['id'] + '/';
	row += '" class="load-doc" data-document-id="';
	row += doc['id'];
	row += '">' + doc['title'] + '</a>';
	row += ' <small>offline cache</small>';
	row += '</h3>';
	row += '<p><small>';
	row += doc['excerpt'] + "...";
	row += '</small></p>';
	row += '</div>';
	
	documents.append(row);			
    }
    
    $(".load-doc").click(function(){
	
	var el = $(this);
	
	var id = el.attr("data-document-id");
	var idx = key[id];
	var doc = docs[idx];
	
	var body = JSON.parse(doc['body']);
	
	var txt = '<div id="document">';
	
	for (var i in body){
	    txt += '<p>' + body[i] + '</p>';
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

    var method = 'dogeared.readinglists.getDocuments';
    var args = {};
    
    var onsuccess = function(rsp){
	
	// dogeared_cache_readinglists_store(rsp['documents']);
	dogeared_documents_store_docs(rsp['documents']['document'])
    };
    
    dogeared_api_call(method, args, onsuccess);
}
