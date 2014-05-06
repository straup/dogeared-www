var de_feedback_timeout = null;

function dogeared_feedback(msg){

    var b = $("#feedback-general");
    b.html(htmlspecialchars(msg));

    if (de_feedback_timeout){
	clearTimeout(de_feedback_timeout);
    }

    de_feedback_timeout = setTimeout(function(){
	var b = $("#feedback-general");
	b.html("");
    }, 10000);

}
