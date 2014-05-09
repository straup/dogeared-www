<?php

	loadlib("http_codes");

	#################################################################

	function api_output_utils_start_headers($rsp, $more=array()){

		$defaults = array(
			'is_error' => 0
		);

		$more = array_merge($defaults, $more);

		$codes = http_codes();

		$status_code = 200;

		if ((isset($more['is_error'])) && ($more['is_error'])){

			$code = $rsp['error']['code'];
			$status_code = (isset($codes[$code])) ? $code : 500;
		}

		else if (isset($more['created'])){

			$status_code = 201;
		}

		else {}

		$status = "{$status_code} {$codes[ $status_code ]}";
		$enc_status = htmlspecialchars($status);

		utf8_headers();

		header("HTTP/1.1 {$enc_status}");
		header("Status: {$enc_status}");

		if (isset($more['is_error'])){
			header("X-api-error-code: " . htmlspecialchars($rsp['error']['code']));
			header("X-api-error-message: " . htmlspecialchars($rsp['error']['message']));
		}
	}

	#################################################################

	# the end
