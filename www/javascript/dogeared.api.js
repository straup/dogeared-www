// http://www.html5rocks.com/en/mobile/workingoffthegrid/#toc-xml-http-request
// https://github.com/wycats/jquery-offline/blob/master/lib/jquery.offline.js

function dogeared_api_call(method, data, on_success, on_error){
    
    var ima_formdata = (data.append) ? 1 : 0;

    if (ima_formdata){

	data.append('method', method);

	if (! data.access_token){
	    data.append('access_token', dogeared_api_site_token());
	}
	
    }
    
    else {

	data['method'] = method;
	
	if (! data['access_token']){
	    data['access_token'] = dogeared_api_site_token();
	}
    }
    
    var dothis_onsuccess = function(rsp){

	if (on_success){
	    on_success(rsp);
	}
    };
    
    var dothis_onerror = function(rsp){		    

	dogeared_omgwtf("[error] XHR error calling: " + method);
	
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

    var endpoint = dogeared_api_endpoint();
    
    var args = {
	'url': endpoint,
	'type': 'POST',
	'data': data,
	'dataType': 'json',
	'success': dothis_onsuccess,
	'error': dothis_onerror
    };

    if (ima_formdata){
	args['cache'] = false;
	args['contentType'] = false;
	args['processData'] = false;
    }
    
    $.ajax(args);
}

function dogeared_api_endpoint(){
	return document.body.getAttribute("data-api-endpoint");
}

function dogeared_api_site_token(){
	return document.body.getAttribute("data-api-site-token");
}
