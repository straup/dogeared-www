<?php

	########################################################################

	function dogeared_documents_get_by_id($id){

		$enc_id = AddSlashes($id);

		$sql = "SELECT * FROM Documents WHERE id='{$enc_id}'";

		$rsp = db_fetch($sql);
		$row = db_single($rsp);

		return $row;
	}

	########################################################################

	function dogeared_documents_get_by_url($url){

		$url = urls_normalize($url);

		$hash = dogeared_documents_hash_url($url);
		$enc_hash = AddSlashes($hash);

		$sql = "SELECT * FROM Documents WHERE hash='{$enc_hash}'";

		$rsp = db_fetch($sql);
		$row = db_single($rsp);

		return $row;
	}

	########################################################################

	function dogeared_documents_add_document($document){

		$url = urls_normalize($document['url']);
		$hash = dogeared_documents_hash_url($url);

		$now = time();

		$document['url'] = $url;
		$document['hash'] = $hash;
		$document['created'] = $now;
		$document['lastmodified'] = $now;

		$insert = array();

		foreach ($document as $k => $v){
			$insert[$k] = AddSlashes($v);
		}

		$dupe = array(
			'lastmodified' => $insert['lastmodified'],
		);

		$rsp = db_insert_dupe('Documents', $insert, $dupe);
		
		if ($rsp['ok']){
			$document['id'] = $rsp['insert_id'];
			$rsp['document'] = $document;
		}

		return $rsp;
	}

	########################################################################

	function dogeared_documents_hash_url($url){
		return md5($url);
	}

	########################################################################

	function dogeared_documents_generate_excerpt(&$paras, $count_words=25){

		$excerpt = array();

		foreach ($paras as $p){

			foreach (explode(" ", $p) as $word){
				$excerpt[] = $word;

				if (count($excerpt) == $count_words){
					break;
				}
			}

			if (count($excerpt) == $count_words){
				break;
			}
		}

		$excerpt = implode(" ", $excerpt);
		return $excerpt;
	}

	########################################################################

	function dogeared_documents_display_title(&$document){

		$info = parse_url($document['url']);
		$host = $info['host'];

		$title = $document['title'];

		if (! $title){

			$title = basename($info['path']);
		}

		$title = str_replace("-", " ", $title);
		return "{$host} – $title";
	}

	########################################################################

	# the end
