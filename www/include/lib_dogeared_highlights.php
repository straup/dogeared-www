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

	function dogeared_highlights_hash_text($text){
		return md5($text);
	}

	########################################################################

	# the end
