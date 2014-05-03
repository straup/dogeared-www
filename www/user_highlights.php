<?php

	include("include/init.php");
	login_ensure_loggedin();

	$viewer = $GLOBALS['cfg']['user'];
	$owner = $viewer;

	$more = array();

	if ($page = get_int32("page")){
		$more['page'] = $page;
	}

	$rsp = dogeared_highlights_get_for_user($owner, $more);
	$highlights = array();

	foreach ($rsp['rows'] as $row){
		dogeared_highlights_inflate_highlight($row);
		$highlights[] = $row;
	}

	$GLOBALS['smarty']->assign_by_ref("highlights", $highlights);
	$GLOBALS['smarty']->assign_by_ref("pagination", $rsp['pagination']);
	
	$GLOBALS['smarty']->display("page_user_highlights.txt");
	exit();

?>
