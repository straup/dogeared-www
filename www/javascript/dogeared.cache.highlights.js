function dogeared_cache_highlights_init(){
    dogeared_cache_highlights_status();
}

function dogeared_cache_highlights_store(hl){

    var hash = hex_md5(hl['text']);
    hl['hash'] = hash;

    var key = "highlight_" + hash;

    // console.log(key);
    // console.log(hl);

    if (cache = store.get(key)){
	return;
    }

    store.set(key, hl);
}

function dogeared_cache_highlights_status(){

    var status = $("#status-pending");

    var count = dogeared_cache_count_for_type('highlight');

    if (count == 1){
	status.html("There are pending highlights");
	status.show();
    }

    else if (count){
	status.html("There are " + count + " pending highlights");
	status.show();
    }

    else {
	status.html("");
	status.hide();
    }
}
