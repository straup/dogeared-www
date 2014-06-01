<?php

	$root = dirname(dirname(__FILE__));
	ini_set("include_path", "{$root}/www:{$root}/www/include");

	set_time_limit(0);

	include("include/init.php");
	loadlib("dogeared_pinboard");
	loadlib("backfill");
	loadlib("cli");

	function post($highlight){

		$more = array(
			'auth_token' => $GLOBALS['opts']['auth_token']
		);

		$rsp = dogeared_pinboard_post_highlight($highlight, $more);
		echo "post highlight #{$highlight['id']}: {$rsp['ok']} (skipped:{$rsp['skipped']})\n";
	}

	# main

	$spec = array(
	 	"user_id" => array("flag" => "u", "required" => 1, "help" => "..."),
	 	"auth_token" => array("flag" => "a", "required" => 1, "help" => "..."),
	);

	$opts = cli_getopts($spec);

	$user = users_get_by_id($opts['user_id']);

	if (! $user){
		echo "Unknown user\n";
		exit();
	}

	# To do: store in the database (maybe?) and look up on the fly
	# (20140526/straup)

	if (! $opts['auth_token']){
		echo "Missing auth token\n";
		exit();
	}

	$cluster_id = $user['cluster_id'];

	$enc_user = AddSlashes($user['id']);

	$sql = "SELECT * FROM Highlights WHERE user_id='{$enc_user}' ORDER BY id DESC";

	# Sigh... something... but not this... (20140526/straup)
	_backfill_db_users_shard($cluster_id, $sql, 'post');

	exit();
?>
