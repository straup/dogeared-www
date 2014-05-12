function dogeared_init(){

    window.addEventListener("offline", dogeared_on_offline);
    window.addEventListener("online", dogeared_on_online);

    dogeared_network_init();
    dogeared_appcache_init();
    dogeared_cache_highlights_init();
}

function dogeared_abs_root_url(){
	return document.body.getAttribute("data-abs-root-url");
}

function dogeared_now(){
    var dt = new Date();
    var ts = dt.getTime();
    ts = parseInt(ts / 1000);
    return ts;
}

function dogeared_on_online(e){

    console.log("came online at " + e.timeStamp);
    dogeared_feedback("You appear to be online again.");

    $(".appcache_equals_no").show();
}

function dogeared_on_offline(e){

    console.log("went offline at " + e.timeStamp);
    dogeared_feedback("You appear to be offline.");

    $(".appcache_equals_no").hide();
}
