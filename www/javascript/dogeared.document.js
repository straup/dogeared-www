// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection

function dogeared_document_init(){

    $(document).mouseup(dogeared_document_onselected);
}

function dogeared_document_onselected(e){

    var s = dogeared_document_selected();

    if (! s){
	return;
    }

    // console.log(s);
};

function dogeared_document_selected(){

    $(".highlight").remove();

    // http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

    sel = window.getSelection();
    
    if (sel.toString() == ""){
	return;
    }

    range = window.getSelection().getRangeAt(0);
    expandedSelRange = range.cloneRange();
    range.collapse(false);

    var el = document.createElement("div");
    el.innerHTML = "<span class=\"highlight\"> <button class=\"btn btn-sm\">Highlight</button> </span>";

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
