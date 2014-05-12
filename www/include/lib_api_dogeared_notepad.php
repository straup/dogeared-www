<?php

	########################################################################

	function api_dogeared_notepad_getList(){

		$user = $GLOBALS['cfg']['user'];

		$rsp = dogeared_notepad_get_notes_for_user($user);

		$out = array('notes' => array(
			'note' => $rsp['rows'],
		));

		api_output_ok($out);
	}

	########################################################################

	function api_dogeared_notepad_syncNote(){

		$user = $GLOBALS['cfg']['user'];

		if (! post_isset("note")){
			api_output_error(400, "Missing note");
		}

		$client_note = post_str("note");
		$client_note = json_decode($client_note, "as hash");

		if (! $client_note){
			api_output_error(400, "Failed to parse note");
		}

		$id = $client_note['id'];

		$server_note = dogeared_notepad_get_note_by_id($user, $id);

		if (($server_note) && ($server_note['user_id'] != $user['id'])){
			api_output_error(400, "Invalid note ID");
		}

		if ($server_note){
			$rsp = dogeared_notepad_sync_note($client_note, $server_note);
		}

		else {
			$rsp = dogeared_notepad_add_note($user, $client_note);
		}

		if (! $rsp['ok']){
			api_output_error(500, $rsp['error']);
		}

		$out = array(
			"note" => $rsp['note'],
		);

		api_output_ok($out);
	}

	########################################################################

	# the end
