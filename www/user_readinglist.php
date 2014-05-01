<?php

	include("include/init.php");

	login_ensure_loggedin();

	$viewer = $GLOBALS['cfg']['user'];
	$owner = $viewer;

	$more = array();
	
	if ($page = get_int32("page")){
		$more['page'] = $page;
	}

	$rsp = dogeared_readinglists_get_for_user($owner, $more);
	$list = array();

	foreach ($rsp['rows'] as $pointer){

		dogeared_readinglists_inflate_pointer($pointer);
		$list[] = $pointer;
	}

	$GLOBALS['smarty']->assign_by_ref("list", $list);
	$GLOBALS['smarty']->assign_by_ref("pagination", $rsp['pagination']);

	$GLOBALS['smarty']->display("page_user_readinglist.txt");
	exit();
?>
