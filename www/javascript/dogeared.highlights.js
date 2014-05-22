function dogeared_highlights_init(){

    window.addEventListener("online", function(e){
	dogeared_highlights_on_online();
    });
}

function dogeared_highlights_on_online(){
    dogeared_highlights_flush_pending();
}

function dogeared_highlights_flush_pending(){

    console.log("flush pending highlights");

    var highlights = dogeared_cache_highlights();
    var count = highlights.length;

    for (var i=0; i < count; i++){

	var pending = highlights[i];
	dogeared_highlights_flush_pending_single(pending);
    }

}

function dogeared_highlights_flush_pending_single(pending){

    var method = 'dogeared.highlights.addHighlight';
	
    var key = pending['cache_key'];
    console.log("flush pending highlight " + key);
    
    var args = { 'document_id': pending['document_id'], 'text': pending['text'], 'created': pending['created'] };

    var on_success = function(rsp){
	store.remove(key);
	dogeared_cache_highlights_status();
    };

    dogeared_api_call(method, args, on_success);
}

function dogeared_highlights_init_list(){

    $(".delete-highlight").click(function(){

	if (! confirm("Are you sure you want to delete this highlight?")){
	    return false;
	}

	var el = $(this);
	var id = el.attr('data-highlight-id');

	var method = "dogeared.highlights.deleteHighlight";
	var args = { 'id': id };

	var on_success = function(rsp){
	    var hl = $("#highlight-" + id);
	    hl.remove();
	    dogeared_feedback("That highlight has been deleted.");
	};

	dogeared_api_call(method, args, on_success);
    });
}

function dogeared_highlights_init_single(){

    $(".delete-highlight").click(function(){

	if (! confirm("Are you sure you want to delete this highlight?")){
	    return false;
	}

	var el = $(this);
	var id = el.attr('data-highlight-id');

	var method = "dogeared.highlights.deleteHighlight";
	var args = { 'id': id };

	var on_success = function(rsp){
	    var root = dogeared_abs_root_url();
	    var redir = root + "highlights/?deleted=1";
	    location.href = redir;
	};
	
	dogeared_api_call(method, args, on_success);
    });
}
