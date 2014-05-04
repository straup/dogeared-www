// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection
// http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

var current_selection = "";

function dogeared_document_init(){

    if (typeof(window.ontouchend) == 'object'){

	$(document).bind('selectionchange', dogeared_document_selected_selectionchange);
    }

    else {

	$(document).bind('mouseup', dogeared_document_selected_mouseup);
    }	
}

function dogeared_document_selected_mouseup(e){

    console.log("on mouseup");

    var target = e.target;

    if (target.nodeName == 'BUTTON'){
	dogeared_document_add_highlight();
	return;
    }

    $(".highlight").remove();

    var sel = window.getSelection();

    range = window.getSelection().getRangeAt(0);
    expandedSelRange = range.cloneRange();
    range.collapse(false);

    var el = document.createElement("div");
    el.innerHTML = "<span class=\"highlight\"> <button id=\"highlight\" class=\"btn btn-sm\">Highlight</button> </span>";

    var frag = document.createDocumentFragment(), node, lastNode;

    while ((node = el.firstChild)){
        lastNode = frag.appendChild(node);
    }
    
    range.insertNode(frag);

    if (lastNode){
        expandedSelRange.setEndAfter(lastNode.previousSibling);
        sel.removeAllRanges();
        sel.addRange(expandedSelRange);
    }
}

function dogeared_document_selected_selectionchange(e){

    console.log("on selectionchange");

    $(".highlight").remove();

    var sel = window.getSelection();
    var txt = sel.toString();

    if (txt == ""){
	return;
    }

    if (txt == current_selection){
	return;
    }

    current_selection = txt;

    range = window.getSelection().getRangeAt(0);
    expandedSelRange = range.cloneRange();
    range.collapse(false);

    var el = document.createElement("div");
    el.innerHTML = "<span class=\"highlight\"> <button id=\"highlight\" class=\"btn btn-sm\">Highlight</button> </span>";

    var frag = document.createDocumentFragment(), node, lastNode;

    while ((node = el.firstChild)){
        lastNode = frag.appendChild(node);
    }
    
    range.insertNode(frag);

    $("#highlight").click(dogeared_document_add_highlight);
}

function dogeared_document_add_highlight(){

    var doc = $("#document");
    var id = doc.attr("data-document-id");

    var s = window.getSelection();
    var t = (current_selection) ? current_selection : s.toString();

    var method = 'dogeared.highlights.addHighlight';

    var args = {
	'document_id': id,
	'text': t
    };

    if (! dogeared_network_is_online()){

	if (dogeared_cache_highlights_store(args)){
	    dogeared_feedback("Your highlight has been cached until..");
	    dogeared_cache_highlights_status();
	}

	return;
    }
    
    var on_success = function(rsp){

	if (rsp['stat'] != 'ok'){
	    dogeared_feeback_api_error(rsp);
	    return;
	}

	dogeared_feedback('Your highlight has been added.');	
    };

    var on_error = function(){
	dogeared_feedback();
    };
    
    dogeared_api_call(method, args, on_success);
}
