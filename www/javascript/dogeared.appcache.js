// http://www.html5rocks.com/en/tutorials/appcache/beginner/

function dogeared_appcache_init(){

    // var status = dogeared_appcache_status();
    //console.log("appcache status: " + status);

    // Fired after the first cache of the manifest.
    window.applicationCache.addEventListener('cached', dogeared_appcache_on_event, false);
    
    // Checking for an update. Always the first event fired in the sequence.
    window.applicationCache.addEventListener('checking', dogeared_appcache_on_event, false);
    
    // An update was found. The browser is fetching resources.
    window.applicationCache.addEventListener('downloading', dogeared_appcache_on_event, false);
    
    // The manifest returns 404 or 410, the download failed,
    // or the manifest changed while the download was in progress.
    window.applicationCache.addEventListener('error', dogeared_appcache_on_error, false);
    
    // Fired after the first download of the manifest.
    window.applicationCache.addEventListener('noupdate', dogeared_appcache_on_event, false);
    
    // Fired if the manifest file returns a 404 or 410.
    // This results in the application cache being deleted.
    window.applicationCache.addEventListener('obsolete', dogeared_appcache_on_event, false);
    
    // Fired for each resource listed in the manifest as it is being fetched.
    window.applicationCache.addEventListener('progress', dogeared_appcache_on_event, false);
    
    // Fired when the manifest resources have been newly redownloaded.
    window.applicationCache.addEventListener('updateready', dogeared_appcache_on_updateready, false);
}

function dogeared_appcache_on_event(e){
    var type = e.type;
    console.log("appcache event " + type);

    if (type == "progress"){

	if (dogeared_network_is_online()){
	    dogeared_feedback("checking for updates");
	}
    }

    else {
	dogeared_feedback_reset();
    }

}

function dogeared_appcache_on_error(e){
    console.log("appcache error");
    console.log(e);
}

function dogeared_appcache_on_updateready(){

    if (window.applicationCache.status == window.applicationCache.UPDATEREADY){

	if (confirm('An updated version of site is available. Load it?')){
            window.location.reload();
	}
    }
}

function dogeared_appcache_status_code(){
    return window.applicationCache.status;
}

function dogeared_appcache_status(){

    var code = dogeared_appcache_status_code();

    switch (code){

    case window.applicationCache.UNCACHED: // UNCACHED == 0
	return 'UNCACHED';
	break;
    case window.applicationCache.IDLE: // IDLE == 1
	return 'IDLE';
	break;
    case window.applicationCache.CHECKING: // CHECKING == 2
	return 'CHECKING';
	break;
    case window.applicationCache.DOWNLOADING: // DOWNLOADING == 3
	return 'DOWNLOADING';
	break;
    case window.applicationCache.UPDATEREADY:  // UPDATEREADY == 4
	return 'UPDATEREADY';
	break;
    case window.applicationCache.OBSOLETE: // OBSOLETE == 5
	return 'OBSOLETE';
	break;
    default:
	return 'UKNOWN CACHE STATUS';
	break;

    };
}
