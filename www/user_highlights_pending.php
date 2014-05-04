<?php

	include("include/init.php");
	login_ensure_loggedin();

	$viewer = $GLOBALS['cfg']['user'];
	$owner = $viewer;
	
	$GLOBALS['smarty']->display("page_user_highlights_pending.txt");
	exit();

?>
