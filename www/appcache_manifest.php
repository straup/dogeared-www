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

	if ($user = $GLOBALS['cfg']['user']){

		$more = array('per_page' => 1);
		$rsp = dogeared_readinglists_get_for_user($user, $more);
		dumper($rsp);
		$row = db_single($rsp);
		
		dumper($row);
	}
	
	$GLOBALS['smarty']->assign("manifest_version", $version);

	$GLOBALS['smarty']->display("page_appcache_manifest.txt");
	exit();
?>
