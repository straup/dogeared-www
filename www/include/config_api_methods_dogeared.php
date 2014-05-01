<?php

	########################################################################

	$GLOBALS['cfg']['api']['methods'] = array_merge(array(

		"dogeared.readinglists.getDocuments" => array(
			"description" => "Return the list of documents in a user's reading list",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_readinglists",
			"requires_perms" = 1,
		),


	), $GLOBALS['cfg']['api']['methods']);

	########################################################################

	# the end
