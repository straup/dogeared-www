// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection

function dogeared_document_init(){

    $(document).mouseup(dogeared_document_onselected);
    // $(document).touchend(dogeared_document_onselected);

}

function dogeared_document_onselected(e){

    var target = e.target;

    if (target.nodeName == 'BUTTON'){
	dogeared_document_highlight();
	return;
    }


    // http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

    $(".highlight").remove();

    var sel = window.getSelection();
    
    if (sel.toString() == ""){
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

}

function dogeared_document_highlight(){

    var doc = $("#document");
    var id = doc.attr("data-document-id");

    var s = window.getSelection();
    var t = s.toString();

    var method = 'dogeared.highlights.addHighlight';

    var args = {
	'document_id': id,
	'text': t
    };

    var on_success = function(rsp){
	console.log(rsp);
    };

    console.log(args);

    dogeared_api_call(method, args, on_success);
}
