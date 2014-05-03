<?php

	include("include/init.php");
	login_ensure_loggedin();

	$user = $GLOBALS['cfg']['user'];

	$id = get_int64("id");

	if (! $id){
		error_404();
	}

	$highlight = dogeared_highlights_get_by_id($user, $id);

	if (! $highlight){
		error_404();
	}

	dogeared_highlights_inflate_highlight($highlight);

	$GLOBALS['smarty']->assign_by_ref("highlight", $highlight);

	$GLOBALS['smarty']->display("page_user_highlight.txt");
	exit();
?>
