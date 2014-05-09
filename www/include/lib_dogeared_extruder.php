<?php

	########################################################################

	function dogeared_extruder_services_map($string_keys=0){

		$map = array(
			0 => 'boilerpipe',
			1 => 'java-readability',
			2 => 'tika',
		);

		if ($string_keys){
			$map = array_flip($map);
		}

		return $map;
	}

	########################################################################

	function dogeared_extruder($url, $service){

		$service = urlencode($service);

		$query = array('url' => $url);
		$query = http_build_query($query);

		$headers = array(
			'Accept' => 'application/json',
		);

		$more = array(
			# 'http_timeout' => 15,
		);

		$req = $GLOBALS['cfg']['dogeared_extruder_endpoint'] . "{$service}/?{$query}";
		$rsp = http_get($req, $headers, $more);

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
