<?php

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
