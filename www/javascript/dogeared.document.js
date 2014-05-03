// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection

var wtf = "";

function dogeared_document_init(){

    $(document).bind('mouseup', dogeared_document_onselected);

    // This does not work well at all yet (20140503/straup)
    // http://stackoverflow.com/questions/8991511/how-to-bind-a-handler-to-a-selection-change-on-window

    $(document).bind('selectionchange', dogeared_document_onselected);
}

function dogeared_document_onselected(e){

    // console.log(e.type);
    var target = e.target;

    if (target.nodeName == 'BUTTON'){
	dogeared_document_add_highlight();
	return;
    }

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

    // http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

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

    // this causes the highlight button to be hidden in iOS...

    if (lastNode){
        expandedSelRange.setEndAfter(lastNode.previousSibling);
        sel.removeAllRanges();
        sel.addRange(expandedSelRange);
    }


}

function dogeared_document_add_highlight(){

    var doc = $("#document");
    var id = doc.attr("data-document-id");

    var s = window.getSelection();
    var t = s.toString();

    // This requires grabbing 'current_selection' in ios

    var method = 'dogeared.highlights.addHighlight';

    var args = {
	'document_id': id,
	'text': t
    };

    console.log(args);

    // TO DO: something...

    var on_success = function(rsp){
	console.log(rsp);
    };

    dogeared_api_call(method, args, on_success);
}
