function dogeared_extruder_init(){

    window.addEventListener("offline", function(e){
	dogeared_extruder_on_offline(e);
    });
    
    window.addEventListener("online", function(e){
	dogeared_extruder_on_online(e);
    });

    $("#fetch").submit(function(){

	var url = $("#url");
	url = url.val();
	
	var on_success = function(rsp){
	    
	    var doc = rsp['document'];
	    var id = doc['id'];
	    
	    var root = dogeared_abs_root_url();
	    var url = root + 'documents/' + id + '/';
	    
	    var msg = 'Okay! <a href="' + url + '">That document</a> is ready to be dogeared.';
	    
	    dogeared_feedback_ok(msg, 60);
	    $("#button-dogear").removeAttr("disabled");
	    
	    var document = rsp['document'];
	    dogeared_cache_documents_store(document);

	    $("#url").val("");
	};
	
	var on_error = function(rsp){
	    $("#button-dogear").removeAttr("disabled");
	};
	
	var method = "dogeared.documents.addDocument";
	var args = { 'url': url };
	
	dogeared_api_call(method, args, on_success);
	dogeared_feedback("Fetching your document, now...");
	
	$("#button-dogear").attr("disabled", "disabled");
	return false;
    });

    if (! dogeared_network_is_online()){
	dogeared_extruder_hide_form();
    }
}

function dogeared_extruder_on_online(){
    dogeared_extruder_show_form();
}

function dogeared_extruder_on_offline(){
    dogeared_extruder_hide_form();
}

function dogeared_extruder_show_form(){
    $("#fetch").show();
}

function dogeared_extruder_hide_form(){
    $("#fetch").hide();
}
