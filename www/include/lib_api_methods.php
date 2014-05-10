<?php

	##############################################################################

	function api_methods_can_view_method(&$method, $viewer_id=0){

		return ($method['documented']) ? 1 : 0;

		# This needs some wrangling to sort out differences in lib_auth
		# libraries (20140510/straup)

		/*
		$see_all = (auth_has_role("admin", $viewer_id)) ? 1 : 0;
		$see_undocumented = (auth_has_role_any(array("admin", "api"), $viewer_id)) ? 1 : 0;

		if ((! $method['enabled']) && (! $see_all)){
			return 0;
		}

		if (is_array($method['documented_if'])){

			$required = $method['documented_if'];

			if (! in_array("admin", $required)){
				$required[] = "admin";
			}

			if (! auth_has_role_any($required, $viewer_id)){
				return 0;
			}
		}

		else if ((! $method['documented']) && (! $see_all)){
			return 0;
		}

		else {}

		return 1;
		*/
	}

	##############################################################################

	# the end
