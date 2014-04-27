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

	function dogeared_readinglists_get_for_user(&$user, $more=array()){

		$enc_user = AddSlashes($user['id']);

		$cluster_id = $user['cluster_id'];

		$sql = "SELECT * FROM ReadingLists WHERE user_id='{$enc_user}' ORDER BY created DESC";
		$rsp = db_fetch_paginated_users($cluster_id, $sql, $more);

		return $rsp;
	}

	########################################################################

	function dogeared_readinglists_get_document_for_user(&$user, $document_id){

		$enc_user = AddSlashes($user['id']);
		$enc_doc = AddSlashes($document_id);

		$cluster_id = $user['cluster_id'];

		$sql = "SELECT * FROM ReadingLists WHERE user_id='{$enc_user}' AND document_id='{$enc_doc}'";
		$rsp = db_fetch_users($cluster_id, $sql);

		$pointer = db_single($rsp);

		if (! $pointer){
			return null;
		}

		return dogeared_documents_get_by_id($pointer['document_id']);
	}

	########################################################################

	function dogeared_readinglists_inflate_pointer(&$pointer){

		$document = dogeared_documents_get_by_id($pointer['document_id']);
		$pointer['document'] = $document;

		# pass-by-ref
	}

	########################################################################

	# the end
