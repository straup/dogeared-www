<?php

	########################################################################

	function dogeared_extruder($url, $service){

		$service = urlencode($service);

		$query = array('url' => $url);
		$query = http_build_query($query);

		$headers = array(
			'Accept' => 'application/json',
		);

		$req = $GLOBALS['cfg']['dogeared_extruder_endpoint'] . "{$service}/?{$query}";
		$rsp = http_get($req, $headers);

		if (! $rsp['ok']){
			return $rsp;
		}

		$data = json_decode($rsp['body'], 'as hash');

		if (! $data){
			return array('ok' => 0, 'error' => 'Failed to parse JSON');
		}

		$rsp['data'] = $data;
		return $rsp;
	}

	########################################################################

	# the end
