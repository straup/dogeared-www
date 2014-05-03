// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection

function dogeared_document_init(){

    $(document).mouseup(dogeared_document_onselected);
}

function dogeared_document_onselected(e){

    console.log(e);

    var s = dogeared_document_selected();

    if (! s){
	return;
    }

    // console.log(s);
};

function dogeared_document_selected(){

    // http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

    sel = window.getSelection();

    range = window.getSelection().getRangeAt(0);
    expandedSelRange = range.cloneRange();
    range.collapse(false);

    // Range.createContextualFragment() would be useful here but is
    // non-standard and not supported in all browsers (IE9, for one)

    var el = document.createElement("div");
    el.innerHTML = " POO ";

    var frag = document.createDocumentFragment(), node, lastNode;

    while ((node = el.firstChild)){
        lastNode = frag.appendChild(node);
    }
    
    range.insertNode(frag);

    // Preserve the selection

    if (lastNode){
        expandedSelRange.setEndAfter(lastNode.previousSibling);
        sel.removeAllRanges();
        sel.addRange(expandedSelRange);
    }

}
