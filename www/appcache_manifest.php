<?php
	include("include/init.php");

	if (! features_is_enabled("appcache")){
		error_404();
	}

	header("Content-Type: text/cache-manifest");
	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

	$version = $GLOBALS['cfg']['appcache_manifest_version'];
	$timestamp = $GLOBALS['cfg']['appcache_manifest_timestamp'];

	if ((! $timestamp) || ($timestamp == 'stat')){
		$path = $GLOBALS['smarty']->template_dir . "/page_appcache_manifest.txt";
		$info = stat($path);
		$timestamp = $info[9];
	}

	if ($user = $GLOBALS['cfg']['user']){

		$more = array('per_page' => 1);
		$rsp = dogeared_readinglists_get_for_user($user, $more);
		$row = db_single($rsp);
		
		$created = $row['created'];

		if ($created > $timestamp){
			$timestamp = $created;
		}
	}
	
	$GLOBALS['smarty']->assign("manifest_version", $version);
	$GLOBALS['smarty']->assign("manifest_timestamp", $timestamp);

	$GLOBALS['smarty']->display("page_appcache_manifest.txt");
	exit();
?>
