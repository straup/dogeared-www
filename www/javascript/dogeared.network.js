function dogeared_network_init(){

    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent

    window.addEventListener("offline", dogeared_network_on_offline);
    window.addEventListener("online", dogeared_network_on_online);

    dogeared_network_status();
}

function dogeared_network_is_online(){
    return navigator.onLine;
}

function dogeared_network_on_online(e){

    console.log("came back online at " + e.timeStamp);
    dogeared_network_status();

    $(".btn-save-highlight").removeAttr("disabled");
}

function dogeared_network_on_offline(e){

    console.log("went offline at " + e.timeStamp);
    dogeared_network_status();

    $(".btn-save-highlight").attr("disabled", "disabled");
}

function dogeared_network_status(){

    var status = $("#feedback-network-status");

    if (dogeared_network_is_online()){
	status.html("You are awake and connected to the network");
    }

    else {
	status.html("You are playing hide-and-go-seek with the sky. Currently the sky is winning.");
    }
}
