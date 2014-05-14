<?php

	include("include/init.php");
	login_ensure_loggedin();

	$GLOBALS['smarty']->display("page_user_documents_offline.txt");
	exit();

?>
