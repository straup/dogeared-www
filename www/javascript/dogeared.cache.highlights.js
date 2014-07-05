// OMG STOP USING THIS...

function dogeared_cache_highlights_init(){
    dogeared_cache_highlights_status();
}

function dogeared_cache_highlights_store(hl){

    if (! store.enabled){
	console.log("localstorage is not enabled");
	return false;
    }

    var hash = hex_md5(hl['text']);
    hl['hash'] = hash;

    var key = "highlight_" + hash;

    console.log("store " + key);
    console.log(hl);

    store.set(key, hl);

    var hint = $('#has-pending');
    hint.show();

    return true;
}

function dogeared_cache_highlights_remove_key(key){

    store.remove(key);
}

function dogeared_cache_highlights_status(){

    var status = $("#feedback-pending-highlights");

    var count = dogeared_cache_count_for_type('highlight');

    if (count == 1){
	var link = dogeared_abs_root_url() + "highlights/pending/";
	status.html('there are <a href="' + link + '">pending highlights</a>.');
	status.show();
    }

    else if (count){
	var link = dogeared_abs_root_url() + "highlights/pending/";
	status.html('there are <a href="' + link + '">' + count + ' pending highlights</a>.');
	status.show();
    }

    else {
	status.html("");
	status.hide();
    }
}

function dogeared_cache_highlights(){

    return dogeared_cache_get_for_type('highlight');
}
