function dogeared_init(){

    $("#dogeared-navi li a").click(function(){

	var el = $(this);

	if (! dogeared_network_is_online()){
	    dogeared_feedback("The internet says NO.");
	    return false;
	}
    });
    
    dogeared_network_init();
    dogeared_cache_highlights_init();
}

function dogeared_abs_root_url(){
	return document.body.getAttribute("data-abs-root-url");
}

function dogeared_on_online(e){
    dogeared_feedback("You appear to be online again.");
    console.log("online");
}

function dogeared_on_offline(e){
    dogeared_feedback("You appear to be offline.");
    console.log("offline");
}
