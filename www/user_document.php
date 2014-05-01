<?php

	include("include/init.php");

	login_ensure_loggedin();

	$viewer = $GLOBALS['cfg']['user'];
	$owner = $viewer;

	$id = get_int64("document_id");

	if (! $id){
		error_404();
	}

	$doc = dogeared_readinglists_get_document_for_user($owner, $id);

	if (! $doc){
		error_404();
	}

	$body = json_decode($doc['body'], 'as hash');
	$doc['body'] = $body;

	$GLOBALS['smarty']->assign_by_ref("doc", $doc);

	$GLOBALS['smarty']->display("page_user_document.txt");
	exit();
?>
