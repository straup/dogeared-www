<?php

	$GLOBALS['pinboard_api_endpoint'] = 'https://api.pinboard.in/v1/';

	########################################################################

	function pinboard_api_call($method, $args=array()){

		$query = http_build_query($args);

		$url = $GLOBALS['pinboard_api_endpoint'] . "{$method}?{$query}";
		$rsp = http_get($url);

		if (! $rsp['ok']){
			return $rsp;
		}

		$xml = simplexml_load_string($rsp['body']);
		$json = json_encode($xml);
		$data = json_decode($json, 'as hash');

		$rsp['data'] = $data;
		return $rsp;
	}

	########################################################################

	# the end
