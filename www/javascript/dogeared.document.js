// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection
// http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

var current_selection = "";
var highlight_controls = 0;

function dogeared_document_init(){
    console.log("document init");
}

function dogeared_document_init_doc(id){
    console.log("document init (doc) " + id);

    window.onscroll = dogeared_document_on_scroll;

    var pos = dogeared_whosonfirst_get(id);

    if (pos){
	window.scrollTo(0, pos);
    }

    dogeared_document_bind_highlight_controls();
}

function dogeared_document_on_scroll(e){

    var doc = $("#document");
    var id = doc.attr("data-document-id");

    if (! id){
	return;
    }

    var pos = window.scrollY;
    dogeared_whosonfirst_set(id, pos);
}

function dogeared_document_bind_highlight_controls(){

    dogeared_omgwtf("bind highlight controls");

    if (typeof(window.ontouchend) == 'object'){
	dogeared_omgwtf("init touch based highlight controls");
	$(document).bind('selectionchange', dogeared_document_selected_selectionchange);
    }

    else {
	dogeared_omgwtf("init mouse based highlight controls");
	$(document).bind('mouseup', dogeared_document_selected_mouseup);
    }	

}

function dogeared_document_unbind_highlight_controls(){

    dogeared_omgwtf("unbind highlight controls");

    if (typeof(window.ontouchend) == 'object'){
	$(document).unbind('selectionchange', dogeared_document_selected_selectionchange);
    }

    else {
	$(document).unbind('mouseup', dogeared_document_selected_mouseup);
    }	

}

function dogeared_document_selected_mouseup(e){
    console.log("document: on mouseup");

    var target = e.target;

    if (target.nodeName == 'BUTTON'){

	var el = $(target);

	if (el.attr("data-button-action") == "delete"){
	    console.log("mouse up: ignore delete button");
	    return;
	}
    
	dogeared_document_add_highlight();
	return;
    }

    dogeared_highlights_hints_hide();
    $(".highlight").remove();

    var sel = window.getSelection();
    var txt = sel.toString();

    if (txt == ""){
	return;
    }

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

    dogeared_highlights_hints_show();
}

function dogeared_document_selected_selectionchange(e){

    // console.log("on selectionchange");

    dogeared_highlights_hints_hide();
    $(".highlight").remove();

    var sel = window.getSelection();
    var txt = sel.toString();

    if (txt == ""){
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
    dogeared_highlights_hints_show();
}

// move this in to dogeared.highlights.js ? 

function dogeared_document_add_highlight(){

    var doc = $("#document");
    var id = doc.attr("data-document-id");

    if (! id){
	dogeared_feedback_error("Unable to determine what document I am looking at!");
	return false;
    }

    var s = window.getSelection();
    var t = (current_selection) ? current_selection : s.toString();

    var args = {
	'document_id': id,
	'text': t
    };

    if (dogeared_cache_highlights_store(args)){

	if (! dogeared_network_is_online()){
	    dogeared_feedback_modal("Your highlight has been cached.");
	}
	
	dogeared_cache_highlights_status();
    }

    return;
}
