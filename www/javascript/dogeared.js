function dogeared_omgwtf(bbq){
    // var c = arguments.callee.caller.toString();
    console.log(bbq);
}

function dogeared_init(){

    window.addEventListener("offline", dogeared_on_offline);
    window.addEventListener("online", dogeared_on_online);

    $("a").click(function(){
	
	if (! dogeared_network_is_online()){
	    
	    var el = $(this);
	    
	    if (el.html() == 'reading list'){
		dogeared_documents_load_cache();
	    }
	    
	    return false;
	}
    });

    dogeared_network_init();
    dogeared_appcache_init();
    dogeared_highlights_init();
    dogeared_cache_highlights_init();
    dogeared_whosonfirst_init();

    dogeared_init_touch_controls();
}

function dogeared_init_touch_controls(){

    $(document).touchwipe({
	wipeLeft: dogeared_on_swipe,
	wipeRight: dogeared_on_swipe,
	wipeUp: function(){},
	wipeDown: function(){},
	min_move_x: 100,
	min_move_y: 100,
	preventDefaultEvents: false,
	allowPageScroll: 'vertical'
    });

}

function dogeared_on_swipe(){

    if (! dogeared_documents_currently_reading()){
	return false;
    }

    dogeared_omgwtf("swipe: load index");
    dogeared_documents_load_index();
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

    doeared_omgwtf("came online at " + e.timeStamp);
    dogeared_feedback("You appear to be online again.");

    $(".appcache_equals_no").show();
}

function dogeared_on_offline(e){

    dogeared_omgwtf("went offline at " + e.timeStamp);
    dogeared_feedback("You appear to be offline.");

    $(".appcache_equals_no").hide();
}

function dogeared_whosonfirst_init(){
    dogeared_omgwtf("whosonfirst init");

    var key = dogeared_whosonfirst_key();
    var who = store.get(key);

    if (! who){
	store.set(key, {});
    }
}

function dogeared_whosonfirst_key(){
    return "dogeared_whosonfirst";
}

function dogeared_whosonfirst_get(id){
    var key = dogeared_whosonfirst_key();
    var who = store.get(key);
    return who[id];
}

function dogeared_whosonfirst_set(id, pos){
    var key = dogeared_whosonfirst_key();
    var who = store.get(key);

    who[id] = pos;
    store.set(key, who);
}
