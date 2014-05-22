<?php

	$GLOBALS['cfg'] = array();

	$GLOBALS['cfg']['site_name'] = 'dogeared';
	$GLOBALS['cfg']['environment'] = 'prod';

	$GLOBALS['cfg']['site_disabled'] = 0;
	$GLOBALS['cfg']['site_disabled_retry_after'] = 0;	# seconds; if set will return HTTP Retry-After header

	# Message is displayed in the nav header in inc_head.txt

	$GLOBALS['cfg']['display_message'] = 0;
	$GLOBALS['cfg']['display_message_text'] = '';

	$GLOBALS['cfg']['enable_feature_appcache'] = 1;
	$GLOBALS['cfg']['appcache_manifest_timestamp'] = null;

	$GLOBALS['cfg']['dogeared_extruder_endpoint'] = 'http://localhost:8080/';
	$GLOBALS['cfg']['dogeared_extruder_timeout'] = 30;

	$GLOBALS['cfg']['enable_feature_notepad'] = 1;

	$GLOBALS['cfg']['db_main'] = array(
		'host' => 'localhost',
		'name' => 'dogeared',
		'user' => 'READ-FROM-SECRETS',
		'pass' => 'READ-FROM-SECRETS',
		'auto_connect' => 1,
       );

	$GLOBALS['cfg']['db_users'] = array(

		'host' => array(
			1 => 'localhost',
		),

		'user' => 'READ-FROM-SECRETS',
		'pass' => 'READ-FROM-SECRETS',

		'name' => array(
			1 => 'dogeared',
		),
	);


	# hard coding this URL will ensure it works in cron mode too

	$GLOBALS['cfg']['server_scheme'] = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on')) ? 'https' : 'http';
	$GLOBALS['cfg']['server_name'] = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'fake.com';

	$GLOBALS['cfg']['abs_root_url']		= "{$GLOBALS['cfg']['server_scheme']}://{$GLOBALS['cfg']['server_name']}/";
	$GLOBALS['cfg']['safe_abs_root_url']	= $GLOBALS['cfg']['abs_root_url'];


	# Hard-coding these paths will save some stat() ops

	$GLOBALS['cfg']['smarty_template_dir'] = realpath(dirname(__FILE__) . '/../templates/');
	$GLOBALS['cfg']['smarty_compile_dir'] = realpath(dirname(__FILE__) . '/../templates_c/');


	# No, seriously. Change these...

	$GLOBALS['cfg']['crypto_cookie_secret'] = 'READ-FROM-SECRETS';
	$GLOBALS['cfg']['crypto_password_secret'] = 'READ-FROM-SECRETS';
	$GLOBALS['cfg']['crypto_crumb_secret'] = 'READ-FROM-SECRETS';


	#
	# These should be left as-is, unless you have an existing password database not using bcrypt and
	# you need to do auto-promotion on login.
	#

	$GLOBALS['cfg']['passwords_use_bcrypt'] = true;
	$GLOBALS['cfg']['passwords_allow_promotion'] = false;

	# API methods and "blessings" are defined at the bottom

	# API feature flags

	$GLOBALS['cfg']['enable_feature_api'] = 1;

	$GLOBALS['cfg']['enable_feature_api_documentation'] = 1;
	$GLOBALS['cfg']['enable_feature_api_logging'] = 1;
	$GLOBALS['cfg']['enable_feature_api_throttling'] = 0;

	$GLOBALS['cfg']['enable_feature_api_require_keys'] = 0;		# because oauth2...
	$GLOBALS['cfg']['enable_feature_api_register_keys'] = 1;

	$GLOBALS['cfg']['enable_feature_api_delegated_auth'] = 1;
	$GLOBALS['cfg']['enable_feature_api_authenticate_self'] = 1;

	# API URLs and endpoints

	$GLOBALS['cfg']['api_abs_root_url'] = '';	# leave blank - set in api_config_init()
	$GLOBALS['cfg']['site_abs_root_url'] = '';	# leave blank - set in api_config_init()

	$GLOBALS['cfg']['api_subdomain'] = '';
	$GLOBALS['cfg']['api_endpoint'] = 'api/rest/';

	$GLOBALS['cfg']['api_require_ssl'] = 1;

	$GLOBALS['cfg']['api_auth_type'] = 'oauth2';
	$GLOBALS['cfg']['api_oauth2_require_authentication_header'] = 0;
	$GLOBALS['cfg']['api_oauth2_allow_get_parameters'] = 1;

	# API site keys (TTL is measured in seconds)

	$GLOBALS['cfg']['enable_feature_api_site_keys'] = 1;
	$GLOBALS['cfg']['enable_feature_api_site_tokens'] = 1;

	$GLOBALS['cfg']['api_site_keys_ttl'] = 28800;		# 8 hours
	$GLOBALS['cfg']['api_site_tokens_ttl'] = 28000;		# 8 hours
	$GLOBALS['cfg']['api_site_tokens_user_ttl'] = 3600;	# 1 hour

	# API pagination

	$GLOBALS['cfg']['api_per_page_default'] = 100;
	$GLOBALS['cfg']['api_per_page_max'] = 500;

	# The actual API config

	$GLOBALS['cfg']['api'] = array(

		'formats' => array( 'json' ),
		'default_format' => 'json',

		# Defined below in method_config_definitions
		'methods' => array(),

		# Defined in secrets.php
		'blessings' => array(),
	);

	# Load api methods defined in separate PHP files whose naming
	# convention is FLAMEWORK_INCLUDE_DIR . "/config_api_{$definition}.php";
	#
	# IMPORTANT: This is syntactic sugar and helper code to keep the growing
	# number of API methods out of the main config. Stuff is loaded in to
	# memory in lib_api_config:api_config_init (20130308/straup)

	$GLOBALS['cfg']['api_method_definitions'] = array(
		'methods',
		'methods_dogeared',
	);

	#
	# Things you may need to tweak
	#

	# Caching stuff

        $GLOBALS['cfg']['enable_feature_cache_prefixes'] = 1;
        $GLOBALS['cfg']['cache_prefix'] = $GLOBALS['cfg']['environment'];

	# Note: memcache stuff is not enabled by default but is 
	# available in the 'extras' directory

	$GLOBALS['cfg']['auth_cookie_domain'] = parse_url($GLOBALS['cfg']['abs_root_url'], 1);
	$GLOBALS['cfg']['auth_cookie_name'] = 'a';
	$GLOBALS['cfg']['auth_cookie_require_https'] = 0;

	$GLOBALS['cfg']['crumb_ttl_default'] = 300;	# seconds

	$GLOBALS['cfg']['rewrite_static_urls'] = array(
		# '/foo' => '/bar/',
	);

	$GLOBALS['cfg']['enable_feature_email'] = 1;
	$GLOBALS['cfg']['enable_feature_email_sendgrid'] = 0;

	$GLOBALS['cfg']['email_sendgrid_username'] = 'READ-FROM-SECRETS';
	$GLOBALS['cfg']['email_sendgrid_password'] = 'READ-FROM-SECRETS';

	$GLOBALS['cfg']['email_from_name']	= 'Dogeared Email Robot';
	$GLOBALS['cfg']['email_from_email']	= 'READ-FROM-SECRETS';
	$GLOBALS['cfg']['auto_email_args']	= '';

	#
	# Things you can probably not worry about
	#

	$GLOBALS['cfg']['user'] = null;

	# If you are running Flamework on a host where you can not change the permissions
	# on the www/templates_c directory (to be owned by the web server) you'll need to
	# do a couple of things. The first is to set the 'smarty_compile' flag to 0. That
	# means you'll need to pre-compile all your templates by hand. You can do this with
	# 'compile-templates.php' script that is part of Flamework 'bin' directory. Obviously
	# this doesn't make much sense if you are actively developing a site but might be
	# useful if you've got something working and then just want to run it on a shared
	# hosting provider where you can't change the permissions on on files, like pair or
	# dreamhost. (20120110/straup)

	$GLOBALS['cfg']['smarty_compile'] = 1;

	# Do not always compile all the things all the time. Unless you know you're in to
	# that kind of thing. One important thing to note about this setting is that you
	# will need to reenabled it at least once (and load the template in question) if
	# you've got a template that calls a non-standard function. For example, something
	# like: {$foo|@bar_all_the_things}

	$GLOBALS['cfg']['smarty_force_compile'] = 0;

	$GLOBALS['cfg']['http_timeout'] = 3;

	$GLOBALS['cfg']['check_notices'] = 1;

	$GLOBALS['cfg']['db_profiling'] = 0;


	#
	# db_enable_poormans_*
	#
	# If enabled, then the relevant database configs and handles
	# will be automagically prepopulated using the relevant information
	# in 'db_main'
	#

	#
	# You should enable/set these flags if you want to
	# use flamework in a setting where you only have access
	# to a single database.
	#

	$GLOBALS['cfg']['db_enable_poormans_federation'] = 1;

	$GLOBALS['cfg']['db_enable_poormans_slaves'] = 0;

	$GLOBALS['cfg']['db_poormans_slaves_user'] = '';
	$GLOBALS['cfg']['db_poormans_slaves_pass'] = '';


	#
	# For when you want to use tickets but can't tweak
	# your my.cnf file or set up a dedicated ticketing
	# server. flamework does not use tickets as part of
	# core (yet) so this is really only necessary if your
	# application needs db tickets.
	#

	$GLOBALS['cfg']['db_enable_poormans_ticketing'] = 1;


	#
	# This will assign $pagination automatically for smarty
	#
	
	$GLOBALS['cfg']['pagination_assign_smarty_variable'] = 1;

	$GLOBALS['cfg']['pagination_per_page'] = 10;
	$GLOBALS['cfg']['pagination_spill'] = 2;
	$GLOBALS['cfg']['pagination_style'] = 'pretty';

	$GLOBALS['cfg']['pagination_keyboard_shortcuts'] = 1;
	$GLOBALS['cfg']['pagination_touch_shortcuts'] = 0;

	#
	# Feature flags
	#

	$GLOBALS['cfg']['enable_feature_signup'] = 1;
	$GLOBALS['cfg']['enable_feature_signin'] = 1;
	$GLOBALS['cfg']['enable_feature_persistent_login'] = 1;
	$GLOBALS['cfg']['enable_feature_account_delete'] = 1;
	$GLOBALS['cfg']['enable_feature_password_retrieval'] = 1;


	#
	# enable this flag to show a full call chain (instead of just the
	# immediate caller) in database query log messages and embedded in
	# the actual SQL sent to the server.
	#

	$GLOBALS['cfg']['db_full_callstack'] = 0;

	$GLOBALS['cfg']['allow_prefetch'] = 0;


	#
	# load these libraries on every page
	#

	$GLOBALS['cfg']['autoload_libs'] = array(
		'email',
		'email_sendgrid',
		'dogeared_readinglists',
		'dogeared_documents',
		'dogeared_highlights',
		'dogeared_extruder',
		'dogeared_notepad',
		'urls_normalize',
	);

	# the end

