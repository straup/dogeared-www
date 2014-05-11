var notepad_interval = null;

function dogeared_notepad_init(){
	 dogeared_notepad_build_list();	 
}

function dogeared_notepad_add_note(){

	 var id = Math.uuid();
	 var key = "notepad_" + id;

	 var note = {
	 	'title': 'Untitled Note #' + id,
		'body': 'This note left intentionally blank.'
	 };

	 store.set(key, note);
	 dogeared_notepad_load_note(key);
}

function dogeared_notepad_load_note(key){

	 var note = store.get(key);
	 console.log(note);

	 var list = $("#notes-list");
	 var editor = $("#note-editor");
	 var button = $("#note-editor-close");

	 editor.attr("data-note-id", key);

	 var title = $("#note-title");
	 title.html(note['title']);

	 var body = $("#note-body");
	 body.html(note['body']);

	 button.click(function(){
	 	dogeared_notepad_close_note();
		return false;
	 });

	 list.hide();
	 editor.show();

	 notepad_interval = setInterval(function(){
	 	dogeared_notepad_save_note();
	 }, 5000);

 	console.log("set interval " + notepad_interval);
}

function dogeared_notepad_save_note(){

	 var editor = $("#note-editor");
	 var key = editor.attr("data-note-id");

	 if (! key){
	 	console.log("clear interval " + notepad_interval);
	 	clearInterval(notepad_interval);

	 	return;
	 }

	 console.log("save " + key);

	 var title = $("#note-title");
	 title = title.html();

	 var body = $("#note-body");
	 body = body.html();

	 var note = { 'title': title, 'body': body };
	 store.set(key, note);

}

function dogeared_notepad_close_note(){

	 if (notepad_interval){
	 	console.log("clear interval " + notepad_interval);
	 	clearInterval(notepad_interval);
	 }

	 dogeared_notepad_save_note();

	 var editor = $("#note-editor");
	 editor.hide();

	 dogeared_notepad_build_list();	 
}

function dogeared_notepad_build_list(){

	 var list = $("#notes-list");

	 var items = '';
	 
	 items += '<li><a href="#" id="note-add">Add a note</a></li>';

    store.forEach(function(key, note){

	var parts = key.split("_");
	var ima = parts[0];
	
	if (ima != "notepad"){
	   return;
	}

	var title = note['title'];

	items += '<li><a href="#" class="note-item" data-note-key="' + key + '">' + title + '</a>';
    });

    list.html(items);

	 $("#note-add").click(function(){

	 	dogeared_notepad_add_note();
		return false;
	 });

	 $(".note-item").click(function(){

		var el = $(this);
		var key = el.attr("data-note-key");
		console.log(key);
	 	dogeared_notepad_load_note(key);
		return false;
	 });

	 list.show();
}
