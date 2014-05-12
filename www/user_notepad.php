<?php
	
	include("include/init.php");
	login_ensure_loggedin();
	
	features_ensure_enabled("notepad");

	$GLOBALS['smarty']->display("page_user_notepad.txt");
	exit();
?>
