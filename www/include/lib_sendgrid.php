<?
	
	# https://github.com/sendgrid/sendgrid-php

	include_once('sendgrid-php/SendGrid_loader.php');

	#########################################################################################

	function sendgrid_email_send($to, $from, $subject, $message, $more=array()){
		
		$defaults = array(
			'from_name' => $GLOBALS['cfg']['email_from_name'],
		);

		$more = array_merge($defaults, $more);

		$sendgrid = new SendGrid($GLOBALS['cfg']['email_sendgrid_username'], $GLOBALS['cfg']['email_sendgrid_password']);
		
		$mail = new SendGrid\Mail();
		
		$mail->addTo($to);
		$mail->setFrom($from);
		$mail->setSubject($subject);
		$mail->setText($message);

		if ($name = $more['from_name']){
			$mail->setFromName($name);
		}

		try {
			$ok = ($sendgrid->smtp->send($mail)) ? 1 : 0;
			$rsp = array('ok' => $ok);
		}

		catch (Exception $e) {
			$rsp = array(
				'ok' => 0,
				'error' => $e->getMessage()
			);
		}

		return $rsp;
	}

	#########################################################################################

	# the end
