function dogeared_highlights_init(){

    console.log("init highlights");

    window.addEventListener("online", function(e){
	console.log("online highlights");

	setTimeout(function(){
	    dogeared_highlights_on_online(e);
	}, 3000);
    });

}

function dogeared_highlights_on_online(){

    var highlights = dogeared_cache_highlights();
    var count = highlights.length;

    console.log(count + " pending highlights");

    for (var i=0; i < count; i++){

	var method = 'dogeared.highlights.addHighlight';
	var cache = highlights[i];

	var key = cache['cache_key'];

	var args = { 'document_id': cache['document_id'], 'text': cache['text'], 'created': cache['created'] };
	console.log(args);

	var on_success = function(rsp){
	    console.log("remove " + key);
	    store.remove(key);
	};

	dogeared_api_call(method, args, on_success);
    }

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
