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
