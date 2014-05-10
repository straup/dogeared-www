<?php
	include("include/init.php");

	if (! features_is_enabled("appcache")){
		error_404();
	}

	header("Content-Type: text/cache-manifest");

	$GLOBALS['smarty']->assign("manifest_version", 1);

	$GLOBALS['smarty']->display("page_appcache_manifest.txt");
	exit();
?>
