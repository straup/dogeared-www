<?php

	########################################################################

	function dogeared_highlights_add_highlight(&$user, &$document, $text){

		$cluster_id = $user['cluster_id'];
		$now = time();

		$hash = dogeared_highlights_hash_text($text);

		$highlight = array(
			'user_id' => $user['id'],
			'document_id' => $document['id'],
			'text' => $text,
			'hash' => $hash,
			'created' => $now,
			'lastmodified' => $now,
		);

		$insert = array();

		foreach ($highlight as $k => $v){
			$insert[$k] = AddSlashes($v);
		}

		$dupe = array(
			'lastmodified' => $insert['lastmodified'],
		);

		$rsp = db_insert_dupe_users($cluster_id, 'Highlights', $insert, $dupe);

		if ($rsp['ok']){
			$highlight['id'] = $rsp['insert_id'];
			$rsp['highlight'] = $highlight;
		}

		return $rsp;
	}

	########################################################################

	function dogeared_highlights_get_for_user(&$user, $more=array()){

		$cluster_id = $user['cluster_id'];

		$enc_user = AddSlashes($user['id']);

		$sql = "SELECT * FROM Highlights WHERE user_id='{$enc_user}' ORDER BY created DESC";
		$rsp = db_fetch_users($cluster_id, $sql, $more);

		return $rsp;
	}

	########################################################################

	function dogeared_highlights_get_by_id(&$user, $id){

		$cluster_id = $user['cluster_id'];

		$enc_id = AddSlashes($id);
		$enc_user = AddSlashes($user['id']);

		$sql = "SELECT * FROM Highlights WHERE id='{$enc_id}'";

		$rsp = db_fetch_users($cluster_id, $sql);
		$row = db_single($rsp);

		if (($row) && ($row['user_id'] != $user['id'])){
			$row = null;
		}

		return $row;
	}

	########################################################################

	function dogeared_highlights_hash_text($text){
		return md5($text);
	}

	########################################################################

	function dogeared_highlights_inflate_highlight(&$highlight){

		$document = dogeared_documents_get_by_id($highlight['document_id']);
		$highlight['document'] = $document;

		# pass-by-ref
	}

	########################################################################

	# the end
