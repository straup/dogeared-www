<?php

	########################################################################

	function api_dogeared_highlights_getList(){

		$args = array();
		api_utils_ensure_pagination_args($args);

		$user = $GLOBALS['cfg']['user'];

		if (request_isset("document_id")){

			$id = request_int64("document_id");
			$doc = dogeared_documents_get_by_id($id);

			if (! $doc){
				api_output_error(400, "Invalid document ID");
			}

			$rsp = dogeared_highlights_get_for_user_and_document($user, $doc, $args);
		}

		else {

			$rsp = dogeared_highlights_get_for_user($user, $args);
		}

		$out = array('hightlights' => array(
			'highlight' => $rsp['rows'],
		));

		api_utils_ensure_pagination_results($out, $rsp['pagination']);
		api_output_ok($out);
	}

	########################################################################

	function api_dogeared_highlights_addHighlight(){

		$id = request_int64("document_id");

		if (! $id){
			api_output_error(400, "Missing document ID");
		}

		$user = $GLOBALS['cfg']['user'];

		$doc = dogeared_documents_get_by_id($id);

		# $doc = dogeared_readinglists_get_document_for_user($user, $id);

		if (! $doc){
			api_output_error(404, "Invalid document ID");
		}

		$text = post_str("text");

		if (! $text){
			api_output_error(400, "Missing text");
		}

		$created = (post_isset("created")) ? intval(post_int32("created")) : 0;

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

	function api_dogeared_highlights_deleteHighlight(){

		$id = post_int64("id");

		if (! $id){
			api_output_error(400, "Missing highlight ID");
		}

		$user = $GLOBALS['cfg']['user'];

		$highlight = dogeared_highlights_get_by_id($user, $id);

		if (! $highlight){
			api_output_error(400, "Invalid highlight ID");
		}

		$rsp = dogeared_highlights_delete_highlight($highlight);

		if (! $rsp['ok']){
			api_output_error(500, $rsp['error']);
		}

		api_output_ok();
	}

	########################################################################

	# the end
