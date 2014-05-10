var de_feedback_timeout = null;

function dogeared_feedback_ok(msg, timeout){

    dogeared_feedback(msg);

    if (! timeout){
	timeout = 10;
    }

    timeout = timeout * 1000;

    if (de_feedback_timeout){
	clearTimeout(de_feedback_timeout);
    }

    de_feedback_timeout = setTimeout(function(){
	dogeared_feedback_reset();
    }, timeout);

}

function dogeared_feedback_error(msg){
    dogeared_feedback(msg);
}

function dogeared_feedback_api_error(rsp){
    dogeared_feeback_error(rsp['error']['message']);
    alert(msg);
}

function dogeared_feedback_modal(msg){
    dogeared_feedback_ok(msg, 10);
    alert(msg);
}

function dogeared_feedback(msg){
    var b = $("#feedback-general");
    b.html(msg);
}

function dogeared_feedback_reset(){
    var b = $("#feedback-general");
    b.html("");
}
