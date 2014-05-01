<?php

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

		$out = array(
			'document' => $doc
		);

		api_output_ok($out);
	}

	########################################################################

	# the end
