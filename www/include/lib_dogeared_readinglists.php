<?php

	########################################################################

	function dogeared_readinglists_add_url(&$user, $url){

		$document = dogeared_documents_get_by_url($url);

		if (! $document){

			$doc = null;
			$processors = $GLOBALS['cfg']['dogeared_extruder_processors'];

			$try = (preg_match("/\.pdf$/", $url)) ? $processors['pdf'] : $processors['*'];

			while (count($try)){

				$service = array_shift($try);

				$service_map = dogeared_extruder_services_map('string keys');
				$service_id = $service_map[ $service ];

				$rsp = dogeared_extruder_extrude_url($url, $service);

				if ($rsp['ok']){
					$doc = $rsp['data']['document'];
					break;
				}
			}

			if (! $doc){
				return array('ok' => 0, 'error' => 'Failed to parse URL');
			}

			$title = $doc['title'];

			$blocks = $doc['blocks'];
			$body = json_encode($blocks);

			$excerpt = dogeared_documents_generate_excerpt($blocks);

			$document = array(
				'url' => $url,
				'service_id' => $service_id,
				'title' => $title,
				'body' => $body,
				'excerpt' => $excerpt,
			);

			$rsp = dogeared_documents_add_document($document);

			if (! $rsp['ok']){
				return $rsp;
			}

			$document = $rsp['document'];
		}

		$rsp = dogeared_readinglists_add_document($user, $document);
		return $rsp;
	}

	########################################################################

	function dogeared_readinglists_add_file(&$user, $file){

		$url = "file://{$file}";
		$document = dogeared_documents_get_by_url($url);

		if (! $document){

			$service = "tika";

			$service_map = dogeared_extruder_services_map('string keys');
			$service_id = $service_map[ $service ];

			$rsp = dogeared_extruder_extrude_file($file, $service);

			if (! $rsp['ok']){
				return $rsp;
			}

			$doc = $rsp['data']['document'];
			$title = $doc['title'];

			$blocks = $doc['blocks'];
			$body = json_encode($blocks);

			$excerpt = dogeared_documents_generate_excerpt($blocks);

			$document = array(
				'url' => $url,
				'service_id' => $service_id,
				'title' => $title,
				'body' => $body,
				'excerpt' => $excerpt,
			);

			$rsp = dogeared_documents_add_document($document);

			if (! $rsp['ok']){
				return $rsp;
			}

			$document = $rsp['document'];
		}

		$rsp = dogeared_readinglists_add_document($user, $document);
		return $rsp;
	}

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

		if ($rsp['ok']){
			users_last_activity($user);
		}

		return $rsp;
	}

	########################################################################

	function dogeared_readinglists_delete_document(&$user, &$document){

		$enc_user = AddSlashes($user['id']);
		$enc_doc = AddSlashes($document['id']);

		$cluster_id = $user['cluster_id'];

		$sql = "DELETE FROM ReadingLists WHERE user_id='{$enc_user}' AND document_id='{$enc_doc}'";

		$rsp = db_write_users($cluster_id, $sql);

		if ($rsp['ok']){
			users_last_activity($user);
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
