<?php

	include("include/init.php");
	loadlib("api");

	features_ensure_enabled(array("api", "api_documentation"));

	$method_classes = array();
	$method_names = array();

	ksort($GLOBALS['cfg']['api']['methods']);

	$user_id = ($GLOBALS['cfg']['user']) ? $GLOBALS['cfg']['user']['id'] : 0;

	foreach ($GLOBALS['cfg']['api']['methods'] as $method_name => $details){

		$details['name'] = $method_name;

		if (! api_methods_can_view_method($details, $user_id)){
			continue;
		}

		$parts = explode(".", $method_name);
		array_pop($parts);

		$method_prefix = $parts[0];
		$method_class = implode(".", $parts);

		if (! is_array($method_classes[$method_class])){

			$method_classes[$method_class] = array(
				'methods' => array(),
				'prefix' => $method_prefix,
			);
		}

		$method_classes[$method_class]['methods'][] = $details;
		$method_names[] = $details['name'];
	}

	foreach ($method_classes as $class_name => $ignore){
		sort($method_classes[$class_name]['methods']);
	}

	$GLOBALS['smarty']->assign_by_ref("method_classes", $method_classes);

	if (get_isset("print")){
		$GLOBALS['smarty']->display("page_api_methods_print.txt");
		exit();
	}

	$GLOBALS['smarty']->display("page_api_methods.txt");
	exit();
?>
