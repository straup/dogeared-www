<?php
	include('include/init.php');

	if (! login_check_login()){
		$url = "{$GLOBALS['cfg']['abs_root_url']}signin/";

		header("location: {$url}");
		exit();
	}

	# sudo put me in an API methods or something


	if (0){
	if ($url = post_str("url")){

		$rsp = dogeared_readinglists_add_url($url, $GLOBALS['cfg']['user']);
		dumper($rsp);
	}
	}

	$GLOBALS['smarty']->display('page_index.txt');
	exit();

?>
