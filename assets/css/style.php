<?php
	ob_start ("ob_gzhandler");


	$offset = 60 * 60 * 24; // Cache for a day
	header('Content-type: text/css');
	header ('Cache-Control: max-age=' . $offset . ', must-revalidate');
	header ('Expires: ' . gmdate ("D, d M Y H:i:s", time() + $offset) . ' GMT');

	$stylesheets = array(
		'main' => 'style.css'
	);

	// include the stylesheets
	foreach($stylesheets as $s)
		include($s);

	$t = isset($_GET['t']) ? $_GET['t'] : '';

	ob_end_flush();
?>
/*write any additional style here*/