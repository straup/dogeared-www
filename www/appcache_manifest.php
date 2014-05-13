<?php
	include("include/init.php");

	if (! features_is_enabled("appcache")){
		error_404();
	}

	header("Content-Type: text/cache-manifest");
	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

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

		else {

			$rsp = dogeared_highlights_get_for_user($user, $more);
			$row = db_single($rsp);
		
			$created = $row['created'];

			if ($created > $timestamp){
				$timestamp = $created;
			}
		}
	}

        if (features_is_enabled(array("api", "api_site_keys", "api_site_tokens"))){
		$token = api_oauth2_access_tokens_fetch_site_token($GLOBALS['cfg']['user']);
		$key = api_keys_get_by_id($token['api_key_id']);
		$hash = hash_hmac('sha256', $token['access_token'], $key['app_secret']);
		$GLOBALS['smarty']->assign("auth_hash", $hash);
	}
	
	# version – as in '# v(\d+)' – is assigned using the 'version'
	# Makefile command (20140511/straup)

	$GLOBALS['smarty']->assign("manifest_timestamp", $timestamp);

	$GLOBALS['smarty']->display("page_appcache_manifest.txt");
	exit();
?>
