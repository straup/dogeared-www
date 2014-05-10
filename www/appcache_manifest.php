<?php
	include("include/init.php");

	if (! features_is_enabled("appcache")){
		error_404();
	}

	header("Content-Type: text/cache-manifest");

	$version = $GLOBALS['cfg']['appcache_manifest_version'];

	if ((! $version) || ($version == 'stat')){
		$path = $GLOBALS['smarty']->template_dir . "/page_appcache_manifest.txt";
		$info = stat($path);
		$version = $info[9];
	}

	$GLOBALS['smarty']->assign("manifest_version", $version);

	$GLOBALS['smarty']->display("page_appcache_manifest.txt");
	exit();
?>
