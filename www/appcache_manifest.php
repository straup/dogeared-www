<?php
	include("include/init.php");

	if (! features_is_enabled("appcache")){
		error_404();
	}

	header("Content-Type: text/cache-manifest");

	$version = time();
	$GLOBALS['smarty']->assign("manifest_version", $version);

	$GLOBALS['smarty']->display("page_appcache_manifest.txt");
	exit();
?>
