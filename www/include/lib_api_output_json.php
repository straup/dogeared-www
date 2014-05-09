<?php

	loadlib("http_codes");

	#################################################################

	function api_output_ok($rsp=array(), $more=array()){
		api_output_send($rsp, $more);
	}

	#################################################################

	function api_output_error($code=999, $msg='', $more=array()){

		$more['is_error'] = 1;

		$out = array('error' => array(
			'code' => $code,
			'error' => $msg,	# deprecated - need to update all the JS...
			'message' => $msg,
		));

		api_log($out);

		api_output_send($out, $more);
	}

	#################################################################

	function api_output_send($rsp, $more=array()){

		$rsp['stat'] = (isset($more['is_error'])) ? 'error' : 'ok';

		api_log(array('stat' => $rsp['stat']), 'write');

		api_output_utils_start_headers($rsp, $more);

		if (features_is_enabled("api_cors")){

			if ($origin = $GLOBALS['cfg']['api_cors_allow_origin']){
				header("Access-Control-Allow-Origin: " . htmlspecialchars($origin));
			}
		}

		if (! request_isset("inline")){
			header("Content-Type: text/json");
		}

		$json = json_encode($rsp);
		header("Content-Length: " . strlen($json));

		echo $json;
		exit();
	}

	#################################################################

	# the end
