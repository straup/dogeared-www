<?php

	########################################################################

	function dogeared_notepad_syncNote(){

		if (! post_isset("id")){
			api_output_error(400, "Missing note ID");
		}

		$id = post_str("id");

		$out = array(
			"id" => $id,
		);

		api_output_ok($out);
	}

	########################################################################

	# the end
