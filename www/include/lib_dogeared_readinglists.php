<?php

	########################################################################

	function dogeared_readinglists_add_document(&$user, &$document){

		$cluster_id = $user['cluster_id'];

		$now = time();

		$pointer = array(
			'document_id' => $document['id'],
			'user_id' => $user['id'],
			'created' => $now,
			'lastmodified' => $now,
		);

		$insert = array();

		foreach ($pointer as $k => $v){
			$insert[$k] = AddSlashes($v);
		}

		$dupe = array(
			'lastmodified' => $insert['lastmodified'],
		);

		$rsp = db_insert_dupe_users($cluster_id, 'ReadingLists', $insert, $dupe);

		if ($rsp['ok']){
			$rsp['document'] = $document;
			$rsp['pointer'] = $pointer;
		}

		return $rsp;
	}

	########################################################################

	# the end
