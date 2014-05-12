<?php

	########################################################################

	function dogeared_notepad_get_note_by_id(&$user, $id){

		$cluster_id = $user['cluster_id'];

		$enc_id = AddSlashes($id);

		$sql = "SELECT * FROM Notes WHERE id='{$enc_id}'";
		$rsp = db_fetch_users($cluster_id, $sql);
		$row = db_single($rsp);

		return $row;
	}

	########################################################################

	function dogeared_notepad_get_notes_for_user(&$user, $more=array()){

		$cluster_id = $user['cluster_id'];

		$enc_user = AddSlashes($user['id']);

		$sql = "SELECT * FROM Notes WHERE user_id='{$enc_user}' ORDER BY created DESC";
		$rsp = db_fetch_paginated_users($cluster_id, $sql, $more);
		
		return $rsp;
	}

	########################################################################

	function dogeared_notepad_add_note(&$user, $note){

		$cluster_id = $user['cluster_id'];

		$note['user_id'] = $user['id'];

		$insert = array();

		foreach ($note as $k => $v){
			$insert[$k] = AddSlashes($v);
		}

		$rsp = db_insert_users($cluster_id, 'Notes', $insert);

		if ($rsp['ok']){
			$rsp['note'] = $note;
		}

		return $rsp;
	}

	########################################################################

	function dogeared_notepad_update_note(&$note, $update){

		$user = users_get_by_id($note['user_id']);
		$cluster_id = $user['cluster_id'];

		$insert = array();

		foreach ($update as $k => $v){
			$insert[$k] = AddSlashes($v);
		}

		$enc_id = AddSlashes($note['id']);
		$where = "id='{$enc_id}'";

		$rsp = db_update_users($cluster_id, 'Notes', $insert, $where);

		if ($rsp['ok']){
			$note = array_merge($note, $update);
			$rsp['note'] = $note;
		}

		return $rsp;
	}

	########################################################################

	function dogeared_notepad_sync_note($client_note, $server_note){

		if ($server_note['lastmodified'] == $client_note['lastmodified']){
			return array('ok' => 1, 'note' => $client_note);
		}

		if ($server_note['lastmodified'] > $client_note['lastmodified']){
			return array('ok' => 1, 'note' => $server_note);
		}
		
		$rsp = dogeared_notepad_update_note($server_note, $client_note);
		return $rsp;
	}

	########################################################################

	# the end
	
