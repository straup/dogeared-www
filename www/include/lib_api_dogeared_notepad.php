<?php

	########################################################################

	function dogeared_notepad_syncNotepad(){

		if (! post_isset("notes")){
			api_output_error(400, "Missing notes");
		}

		$notes = post_str("notes");
		$notes = json_decode($notes, "as hash");

		if (! $notes){
			api_output_error(400, "Failed to parse notes");
		}

		$out = array(
			'notes' => $notes,
		);

		api_output_ok($out);
	}

	########################################################################

	# the end
