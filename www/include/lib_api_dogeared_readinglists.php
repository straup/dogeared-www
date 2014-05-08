<?php

	########################################################################

	function api_dogeared_readinglists_addDocument(){

		$url = post_str("url");

		if (! $url){
			api_output_error(400, "Missing document URL");
		}

		$info = parse_url($url);

		if (! preg_match("/^https?/", $info['scheme'])){
			api_output_error(400, "Invalid document scheme");
		}

		if (! $info['host']){
			api_output_error(400, "Invalid document host");
		}

		$user = $GLOBALS['cfg']['user'];
		$rsp = dogeared_readinglists_add_url($user, $url);

		if (! $rsp['ok']){
			api_output_error(500, $rsp['error']);
		}

		$out = array(
			'document' => $rsp['document'],
		);

		api_output_ok($out);
	}

	########################################################################

	function api_dogeared_readinglists_deleteDocument(){

		$id = post_int64("document_id");

		if (! $id){
			api_output_error(400, "Missing document ID");
		}

		$doc = dogeared_documents_get_by_id($id);

		if (! $doc){
			api_output_error(400, "Invalid document ID");
		}

		$user = $GLOBALS['cfg']['user'];

		$rsp = dogeared_highlights_delete_highlights_for_document($doc);

		if (! $rsp['ok']){
			api_output_error(500, $rsp['error']);
		}

		$rsp = dogeared_readinglists_delete_document($user, $doc);

		if (! $rsp['ok']){
			api_output_error(500, $rsp['error']);
		}
		
		api_output_ok();
	}

	########################################################################

	function api_dogeared_readinglists_getDocuments(){

		$user = $GLOBALS['cfg']['user'];
		$args = array();

		api_utils_ensure_pagination_args($args);

		$rsp = dogeared_readinglists_get_for_user($user, $args);
		$docs = array();
	
		foreach ($rsp['rows'] as $row){
			$docs[] = $row;
		}

		$out = array('documents' => array(
			'document' => $docs,
		));

		api_utils_ensure_pagination_results($out, $rsp['pagination']);

		api_output_ok($out);
	}

	########################################################################

	# the end
