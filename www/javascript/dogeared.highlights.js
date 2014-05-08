function dogeared_highlights_init(){

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
