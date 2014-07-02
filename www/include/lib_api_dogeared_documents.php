<?php

	########################################################################

	function api_dogeared_documents_addDocument(){

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

	function api_dogeared_documents_uploadDocument(){

		if (! features_is_enabled("uploads")){
			api_output_error(999, "Uploads are not enabled.");
		}

		if (! $_FILES['document']){
			api_output_error(400, "Missing upload");
		}

		if ($_FILES['document']['error']){
			api_output_error(500, "server error: {$_FILES['document']['error']}");
		}

		$file = $_FILES['document']['tmp_name'];

		$user = $GLOBALS['cfg']['user'];
		$rsp = dogeared_readinglists_add_file($user, $file);

		if (! $rsp['ok']){
			api_output_error(500, $rsp['error']);
		}

		$out = array(
			'document' => $rsp['document'],
		);

		api_output_ok($out);
	}

	########################################################################

	function api_dogeared_documents_deleteDocument(){

		$id = post_int64("document_id");

		if (! $id){
			api_output_error(400, "Missing document ID");
		}

		$doc = dogeared_documents_get_by_id($id);

		if (! $doc){
			api_output_error(400, "Invalid document ID");
		}

		$user = $GLOBALS['cfg']['user'];

		$rsp = dogeared_readinglists_delete_document($user, $doc);

		if (! $rsp['ok']){
			api_output_error(500, $rsp['error']);
		}
		
		api_output_ok();
	}

	########################################################################

	function api_dogeared_documents_getList(){

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

	function api_dogeared_documents_getInfo(){

		$id = request_int64("document_id");

		if (! $id){
			api_output_error(400, "Missing document ID");
		}

		$user = $GLOBALS['cfg']['user'];

		$doc = dogeared_readinglists_get_document_for_user($user, $id);

		if (! $doc){
			api_output_error(404, "Invalid document ID");
		}

		# This is probably the wrong place to be doing this
		# but you know let's see if it even works (20140622/straup)

		# There is a logic bug in the JS that is preventing this
		# from working correctly (20140702/straup)

		if ((0) && ($ts = post_int32("lastmodified"))){

			if ($ts == $doc['lastmodified']){
				api_output_error(304, "Same same");
			}
		}

		$doc['display_title'] = dogeared_documents_display_title($doc);

		$out = array(
			'document' => $doc
		);

		api_output_ok($out);
	}

	########################################################################

	# the end
