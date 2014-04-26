<?php
	include('include/init.php');

	if (! login_check_login()){
		$url = "{$GLOBALS['cfg']['abs_root_url']}signin/";

		header("location: {$url}");
		exit();
	}

	$GLOBALS['smarty']->display('page_index.txt');
	exit();

?>
