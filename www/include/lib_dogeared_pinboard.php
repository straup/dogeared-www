<?php

	loadlib("pinboard_api");

	########################################################################

	function dogeared_pinboard_post_highlight(&$highlight, $more=array()){

		$doc = dogeared_documents_get_by_id($highlight['document_id']);

		if (! $doc){
			echo "failed to locate document {$row['document_id']}\n";
			return false;
		}

		# This is not ideal. Not at all.
		# (20140601/straup)

		$token = $more['auth_token'];

		# Check to see if we've already bookmarked this highlight

		$url = $doc['url'] . "#" . $highlight['hash'];

		$args = array('url' => $url, 'auth_token' => $token);
		$rsp = pinboard_api_call('posts/get', $args);

		if (($rsp['ok']) && (isset($rsp['data']['post']))){
			return array('ok' => 1, 'skipped' => 1);
		}

		# Okay, go!

		$method = "posts/add";
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
		return $rsp;
	}

	########################################################################

	# the end
