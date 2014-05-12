var notepad_interval = null;
var notepad_inprocess_sync = new Array();
var notepad_pending_sync = new Array();

function dogeared_notepad_init(){

    window.addEventListener("online", dogeared_notepad_on_online);

    if (dogeared_network_is_online()){
	dogeared_notepad_sync_list();
    }

    else {
	dogeared_notepad_build_list();
    }

}

function dogeared_notepad_on_online(){

    if (notepad_pending_sync.length){
	dogeared_notepad_sync_notes(notepad_pending_sync);
    }
}

function dogeared_notepad_add_note(){

    var title = prompt("What is the title of your note?");

    if (! title){
	return false;
    }

    var id = Math.uuid();
    var now = dogeared_now();

    var source_id = dogeared_notepad_source();

    var note = {
	'id': id,
	'source_id': source_id,
	'created': now,
	'lastmodified': 0,
	'deleted': 0,
	'title': title,
	'body': 'This note left intentionally blank.'
    };

    var key = dogeared_notepad_key(note);    

    store.set(key, note);
    dogeared_notepad_load_note(key);
}

function dogeared_notepad_load_note(key){

    var note = store.get(key);
    
    var list = $("#notes-list");
    var editor = $("#note-editor");
    var close = $("#note-editor-close");
    var del = $("#note-editor-delete");
    
    editor.attr("data-note-id", key);
    
    var title = $("#note-title");
    title.html(note['title']);
    
    var body = $("#note-body");
    body.html(note['body']);
    
    close.click(function(){
	dogeared_notepad_close_note();
	return false;
    });

    del.click(function(){

	if (! confirm("Are you sure you want to delete this note?")){
	    return false;
	}

	dogeared_notepad_delete_note();

	dogeared_notepad_build_list();
	return false;
    });
    
    list.hide();
    editor.show();
    
    notepad_interval = setInterval(function(){
	dogeared_notepad_save_note();
    }, 5000);
    
    // console.log("set interval " + notepad_interval);
}

function dogeared_notepad_save_note(){
    
    note = dogeared_notepad_get_current_note();

    if (! note){
	return;
    }

    var key = dogeared_notepad_key(note);
    var update = false;

    var title = $("#note-title");
    title = title.html();
    
    var body = $("#note-body");
    body = body.html();
    
    if (note['title'] != title){
	note['title'] = title;
	update = true;
    }

    if (note['body'] != body){
	note['body'] = body;
	update = true;
    }

    if (! update){
	return;
    }

    var now = dogeared_now();
    note['lastmodified' ] = now;

    console.log("update " + key);
    store.set(key, note);

    dogeared_notepad_sync_note(note);
}

function dogeared_notepad_delete_note(){

    note = dogeared_notepad_get_current_note();

    if (! note){
	return;
    }

    clearInterval(notepad_interval);

    var key = dogeared_notepad_key(note);
    var now = dogeared_now();

    note['title'] = '[redacted]';
    note['body'] = '';
    note['deleted' ] = now;
    note['lastmodified' ] = now;

    console.log("delete " + key);
    store.set(key, note);

    dogeared_feedback_modal("This note has been deleted");

    dogeared_notepad_sync_note(note);
}

function dogeared_notepad_close_note(){

    if (notepad_interval){
	clearInterval(notepad_interval);
    }
    
    dogeared_notepad_save_note();
    
    var editor = $("#note-editor");
    editor.hide();
    
    dogeared_notepad_build_list();	 
}

function dogeared_notepad_build_list(){

    var editor = $("#note-editor");
    var list = $("#notes-list");

    var items = '';
    
    items += '<li><a href="#" id="note-add">Add a note</a></li>';
    
    // TO DO: sort by lastmodified (20140512/straup)

    store.forEach(function(key, note){

	var parts = key.split("_");
	var ima = parts[0];
	
	if (ima != "notepad"){
	   return;
	}

	if (! note['id']){
	    store.remove(key);
	}
	
	if (parseInt(note['deleted'])){
	    // console.log(key + " is deleted " + note['deleted']);
	    return;
	}

	var title = note['title'];
	var created = note['created'];
	var source_id = note['source_id'];

	items += '<li>';
	items += '<a href="#" class="note-item" data-note-key="' + key + '">' + title + '</a> ';
	items += '<small>' + source_id + '</small>';
	items += '</li>';
    });

    list.html(items);

    $("#note-add").click(function(){
	dogeared_notepad_add_note();
	return false;
    });
    
    $(".note-item").click(function(){
	
	var el = $(this);
	var key = el.attr("data-note-key");

	dogeared_notepad_load_note(key);
	return false;
    });

    editor.hide();
    list.show();
}

function dogeared_notepad_sync_list(){

    dogeared_feedback("Synching local documents in progress");

    store.forEach(function(key, note){
	
	var parts = key.split("_");
	var ima = parts[0];
	
	if (ima != "notepad"){
	   return;
	}

	dogeared_notepad_sync_note(note);
    });

    var sync_interval = setInterval(function(){

	var count = notepad_inprocess_sync.length;

	if (! count){

	    dogeared_feedback_ok("Syncing local documents complete", 5);
	    clearInterval(sync_interval);

	    dogeared_notepad_get_list();
	}

    }, 1000);

}

function dogeared_notepad_get_list(){

    dogeared_feedback("Synching remote documents in progress");

    var method = 'dogeared.notepad.getList';
    var args = {};

    var on_success = function(rsp){

	var notes = rsp['notes']['note'];
	var count = notes.length;

	for (var i=0; i < count; i++){

	    var note = notes[i];
	    var key = dogeared_notepad_key(note);

	    if (! store.get(key)){
		console.log("add " + key);
		store.set(key, note);
	    }
	}

	dogeared_feedback("Synching remote documents complete", 5);
	dogeared_notepad_build_list();
    };

    var on_error = function(){
	dogeared_feedback_error("Synching remote documents failed, so just loading local ones");
	dogeared_notepad_build_list();
    };

    dogeared_api_call(method, args, on_success, on_error);
}


function dogeared_notepad_sync_pending_notes(pending){

    for (id in pending){
	var key = dogeared_notepad_key({ 'id': id });
	var note = store.get(key);
	dogeared_notepad_sync_note(note);
    }
}

function dogeared_notepad_sync_note(note){

    var id = note['id'];

    if (! dogeared_network_is_online()){
	notepad_pending_sync[ id ] = true;
	return false;
    }

    delete(notepad_pending_sync[ id ]);

    if (notepad_inprocess_sync[ id ] == true){
	return false;
    }
    
    notepad_inprocess_sync[ id ] = true;

    var str_note = JSON.stringify(note);

    var method = 'dogeared.notepad.syncNote';
    var args = { 'note': str_note };

    var on_success = function(rsp){

	var note = rsp['note'];
	var id = note['id'];

	var key = dogeared_notepad_key(note);
	store.set(key, note);

	notepad_inprocess_sync[ id ] = false;
    };

    var on_error = function(rsp){
	notepad_inprocess_sync[ id ] = false;
    };

    dogeared_api_call(method, args, on_success, on_error);
}

function dogeared_notepad_get_current_note(){

    var editor = $("#note-editor");
    var key = editor.attr("data-note-id");
    
    if (! key){
	clearInterval(notepad_interval);
	return;
    }
    
    var note = store.get(key);

    if (! note){
	dogeared_feedback_error("Failed to load " + key + " which is weird because I am trying to save it...");
	clearInterval(notepad_interval);
	return;
    }

    return note;
}

function dogeared_notepad_key(note){
    var key = "notepad_" + note['id'];
    return key;
}

function dogeared_notepad_source(){
    var fingerprint = new Fingerprint();
    return fingerprint.get();
}
