<?php
	include('include/init.php');

	login_ensure_loggedin();

	features_ensure_enabled("uploads");

	$GLOBALS['smarty']->display('page_upload.txt');
	exit();

?>
