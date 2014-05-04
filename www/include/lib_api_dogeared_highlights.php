<?php

	########################################################################

	function api_dogeared_highlights_addHighlight(){

		$id = request_int64("document_id");

		if (! $id){
			api_output_error(400, "Missing document ID");
		}

		$user = $GLOBALS['cfg']['user'];

		$doc = dogeared_readinglists_get_document_for_user($user, $id);

		if (! $doc){
			api_output_error(404, "Invalid document ID");
		}

		$text = post_str("text");

		if (! $text){
			api_output_error(400, "Missing text");
		}

		$user = $GLOBALS['cfg']['user'];

		$rsp = dogeared_highlights_add_highlight($user, $doc, $text);

		if (! $rsp['ok']){
			api_output_error(500, $rsp['error']);
		}

		$out = array(
			'highlight' => $rsp['highlight'],
		);

		api_output_ok($out);
	}

	########################################################################

	# the end