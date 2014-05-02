<?php

	loadlib("sendgrid");

	#########################################################################################

	function email_send($args){
		return email_sendgrid_send($args);
	}

	#########################################################################################

	function email_sendgrid_send($args){	

		if (! features_is_enabled(array("email", "email_sendgrid"))){
			return array('ok' => 0, 'error' => 'Email delivery is currently disabled');
		}

		$headers = array();

		if (is_array($args['headers'])){

			$headers = $args['headers'];
		}


		#
		# set up the from address
		#

		if ($args['from_name'] && $args['from_email']){

			$from_email = $args['from_email'];
			$from_name = $args['from_name'];

		}else if ($args['from_email']){

			$from_email = $args[from_email];
			$from_name = $args[from_email];

		}else if ($args['from_name']){

			$from_email = $GLOBALS['cfg']['email_from_email'];
			$from_name = $args['from_name'];
		}else{

			$from_email = $GLOBALS['cfg']['email_from_email'];
			$from_name = $GLOBALS['cfg']['email_from_name'];
		}

		$headers['From'] = "\"".email_quoted_printable($from_name)."\" <$from_email>";


		#
		# other headers
		#

		if (!$headers['To']){
			$headers['To'] = $args['to_email'];
		}

		if (!$headers['Reply-To']){
			$headers['Reply-To'] = $from_email;
		}

		if (!$headers['Content-Type']){

			$headers['Content-Type'] = 'text/plain; charset=utf-8';
		}


		#
		# subject and message come from a smarty template
		#

		$message = trim($GLOBALS['smarty']->fetch($args['template']));
		$subject = trim($GLOBALS['smarty']->get_template_vars('email_subject'));

		$message = email_format_body($message);
		$subject = email_quoted_printable($subject);


		$more = array(
			'from_name' => $from_name,
		);

		$rsp = sendgrid_email_send($args['to_email'], $from_email, $subject, $message, $more);
		return $rsp;
	}

	#########################################################################################

	# the end	
