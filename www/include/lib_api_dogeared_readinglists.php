<?php

	########################################################################

	function api_dogeared_readinglists_getDocuments(){

		$user = $GLOBALS['cfg']['user'];
		$args = array();

		api_utils_ensure_pagination_args($args);

		$rsp = dogeared_readlinglists_get_for_user($user, $args);

		api_output_ok($rsp);
	}

	########################################################################

	# the end
