// http://www.html5rocks.com/en/mobile/workingoffthegrid/#toc-xml-http-request
// https://github.com/wycats/jquery-offline/blob/master/lib/jquery.offline.js

function dogeared_api_call(method, args, on_success, on_error){

	var endpoint = dogeared_api_endpoint();

	args['method'] = method;

	if (! args['access_token']){

	   var site_token = dogeared_api_site_token();

	    if (site_token){
		args['access_token'] = site_token;
	    }
	}

	var dothis_onsuccess = function(rsp){

		if (on_success){
			on_success(rsp);
		}
	};

	var dothis_onerror = function(rsp){		    

	    var parse_rsp = function(rsp){
		
		if (! rsp['responseText']){
		    console.log("Missing response text");
		    console.log(rsp);
		    dogeared_feedback_error("The API is full of crazy-talk: Missing response text");
		    return;
		}

		try {
		    rsp = JSON.parse(rsp['responseText']);
		    return rsp;
		}

		catch (e){
		    console.log("Failed to parse response text");
		    dogeared_feedback_error("The API is full of crazy-talk: Failed to parse response text");
		    return;
		}
	    };

	    rsp = parse_rsp(rsp);

	    if (rsp){

		if (rsp['error']){
		    dogeared_feedback_error("The API is sad: " + rsp['error']['message']);
		}

		else {
		    dogeared_feedback(rsp);
		}
	    }
	    
	    if (on_error){
		on_error(rsp);
	    }
        };

        $.ajax({
                'url': endpoint,
                'type': 'POST',
                'data': args,
                'dataType': 'json',
                'success': dothis_onsuccess,
                'error': dothis_onerror
	});

	// console.log("calling " + args['method']);
}

function dogeared_api_endpoint(){
	return document.body.getAttribute("data-api-endpoint");
}

function dogeared_api_site_token(){
	return document.body.getAttribute("data-api-site-token");
}
