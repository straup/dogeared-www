function dogeared_highlights_init(){

    $(".delete-highlight").click(function(){

	if (! confirm("Are you sure you want to delete this highlight?")){
	    return false;
	}

	var el = $(this);
	var id = el.attr('data-highlight-id');

	var method = "dogeared.highlights.deleteHighlight";
	var args = { 'id': id };

	var on_success = function(rsp){
	    console.log(rsp);
	};

	dogeared_api_call(method, args);
    });
}
