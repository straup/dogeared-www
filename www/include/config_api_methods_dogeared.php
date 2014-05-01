<?php

	########################################################################

	$GLOBALS['cfg']['api']['methods'] = array_merge(array(

		"dogeared.documents.getInfo" => array(
			"description" => "Return the text for a document",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_documents",
			"requires_perms" => 1,
			"parameters" => array(
				array(
					"name" => "document_id",
					"description" => "",
					"required" => 1,
				),
			),
		),

		"dogeared.readinglists.getDocuments" => array(
			"description" => "Return the list of documents in a user's reading list",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_readinglists",
			"requires_perms" => 1,
		),


	), $GLOBALS['cfg']['api']['methods']);

	########################################################################

	# the end
