<?php

	$root = dirname(dirname(__FILE__));
	ini_set("include_path", "{$root}/www:{$root}/www/include");

	set_time_limit(0);

	include("include/init.php");
	loadlib("pinboard_api");
	loadlib("backfill");
	loadlib("cli");

	function post($highlight){

		$doc = dogeared_documents_get_by_id($highlight['document_id']);

		if (! $doc){
			echo "failed to locate document {$row['document_id']}\n";
			return false;
		}

		$method = "posts/add";

		$token = $GLOBALS['opts']['auth_token'];
		$shared = 'no';

		$created = $highlight['created'];
		$year = date("Y", $created);
		$month = date("m", $created);
		$day = date("d", $created);

		$md5 = md5($doc['url']);

		$tags = array(
			"highlights",
			"from:dogeared",
			"url:{$md5}",
			"dt:year={$year}",
			"dt:month={$month}",
			"dt:day={$day}",
			"dt:timestamp={$created}",
		);

		$tags = implode(" ", $tags);

		$url = $doc['url'] . "#" . $highlight['hash'];
		$title = dogeared_documents_display_title($doc);
		$text = trim($highlight['text']);

		$args = array(
			'shared' => $shared,
			'tags' => $tags,
			'url' => $url,
			'description' => "{$title} #{$highlight['hash']}",
			'extended' => $text,
		);

		# echo json_encode($args) . "\n";
		
		$args['auth_token'] = $token;

		$rsp = pinboard_api_call($method, $args);
		echo "post highlight #{$highlight['id']}: {$rsp['ok']}\n";
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

	$sql = "SELECT * FROM Highlights WHERE user_id='{$enc_user}'";

	# Sigh... something... but not this... (20140526/straup)
	_backfill_db_users_shard($cluster_id, $sql, 'post');

	exit();
?>
