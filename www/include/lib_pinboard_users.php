<?php

	########################################################################

	function pinboard_users_add_user($pinboard_user){

	}

	########################################################################

	function pinboard_users_get_by_user_id($user_id){

		$enc_id = AddSlashes($user_id);
		$sql = "SELECT * FROM PinboardUsers WHERE user_id='{$enc_id}'";

		$rsp = db_fetch($sql);
		$row = db_single($rsp);
		
		return $row;
	}

	########################################################################

	# the end	
