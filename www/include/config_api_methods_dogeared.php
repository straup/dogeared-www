<?php

	########################################################################

	$GLOBALS['cfg']['api']['methods'] = array_merge(array(

		"dogeared.documents.addDocument" => array(
			"description" => "Add a document to a user's reading list",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_documents",
			"requires_perms" => 2,
			"requires_method" => "POST",
		),

		"dogeared.documents.deleteDocument" => array(
			"description" => "Delete a document from a user's reading list",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_documents",
			"requires_perms" => 2,
			"requires_method" => "POST",
			"parameters" => array(
				array(
					"name" => "document_id",
					"description" => "",
					"required" => 1,
				)
			),
		),

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

		"dogeared.documents.getList" => array(
			"description" => "Return the list of documents in a user's reading list",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_documents",
			"requires_perms" => 1,
		),

		"dogeared.highlights.addHighlight" => array(
			"description" => "Add a highlight for a document",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_highlights",
			"requires_perms" => 2,
			"requires_method" => "POST",
			"parameters" => array(
				array(
					"name" => "document_id",
					"description" => "",
					"required" => 1,
				),
				array(
					"name" => "text",
					"description" => "",
					"required" => 1,
				),
			),
		),

		"dogeared.highlights.deleteHighlight" => array(
			"description" => "Delete a highlighted text",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_highlights",
			"requires_perms" => 2,
			"requires_method" => "POST",
			"parameters" => array(
				array(
					"name" => "document_id",
					"description" => "",
					"required" => 1,
				)
			),
		),

		"dogeared.highlights.getList" => array(
			"description" => "Get the list of highlight for a user",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_highlights",
			"requires_perms" => 1,
			"requires_method" => "POST",
			"parameters" => array(
				array(
					"name" => "document_id",
					"description" => "Only retrieve highlights for a user that come from a particular document",
					"required" => 0,
				)
			),
		),

	), $GLOBALS['cfg']['api']['methods']);

	########################################################################

	# the end
