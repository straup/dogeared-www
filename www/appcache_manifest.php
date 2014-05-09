<?php

	include("include/init.php");

	if (! features_is_enabled("appcache")){
		error_404();
	}

	header("text/cache-manifest");

	$GLOBALS['smarty']->display("page_appcache_manifest.txt");
	exit();
?>
