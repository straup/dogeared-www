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

	# Deprecated (20140601/straup)

	function dogeared_extruder($url, $service){
		return dogeared_extruder_extrude_url($url, $service);
	}

	########################################################################

	function dogeared_extruder_extrude_url($url, $service){

		$service = urlencode($service);

		$query = array('url' => $url);
		$query = http_build_query($query);

		$headers = array(
			'Accept' => 'application/json',
		);

		$more = array(
			'http_timeout' => $GLOBALS['cfg']['dogeared_extruder_timeout'],
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

	function dogeared_extruder_extrude_file($file, $service){

		if (! file_exists($file)){
			return array('ok' => 0, 'error' => 'File does not exist.');
		}

		$service = urlencode($service);

		$args = array();

		if (function_exists("curl_file_create")){

			$finfo = finfo_open(FILEINFO_MIME_TYPE);
			$ftype = finfo_file($finfo, $file);

			$fname = basename($file);

			$args['file'] = curl_file_create($file, $ftype, $fname);
		}

		else {
			$args['file'] = "@{$file}";
		}

		$headers = array(
			'Accept' => 'application/json',
		);

		$more = array(
			'http_timeout' => $GLOBALS['cfg']['dogeared_extruder_timeout'],
		);

		$req = $GLOBALS['cfg']['dogeared_extruder_endpoint'] . "{$service}/";
		$rsp = http_post($req, $args, $headers, $more);

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
