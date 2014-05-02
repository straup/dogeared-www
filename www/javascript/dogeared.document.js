// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection

function dogeared_document_init(){

    $(document).mouseup(dogeared_document_onselected);
}

function dogeared_document_onselected(){

    var s = dogeared_document_selected();

    if (! s){
	return;
    }

    console.log(s);
};

function dogeared_document_selected(){

    var s = window.getSelection();
    return (s) ? s.toString() : null;
}
