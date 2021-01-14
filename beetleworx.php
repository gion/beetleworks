<?php
	session_start();
	header('Content-type: application/javascript');
	error_reporting(E_ALL);

/*	include_once('util.php');
	include_once('blacklist.php');

	// if it's blacklisted do not run the game
	if(isBlacklistedSite($blacklist))
		{
			die('alert("Sorry, but the beetleworx game will not run on this site.");');
		}
	//else run the game
*/

	$modules = array(
		'yepnope' => 'assets/js/yepnope.1.5.4-min.js',
		'init' => 'init.js'
	);

	foreach($modules as $module)
		include_once($module);