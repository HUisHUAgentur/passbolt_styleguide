<!doctype html>
<html class="passbolt no-js passboltplugin version alpha" lang="en">
<head>
	<?php include('includes/AN_meta_setup.php'); ?>
</head>
<body>
<div id="container" class="page setup">
	<!-- first header -->
	<?php include('includes/AN_header_first_setup.php'); ?>

	<!-- second header -->
	<div class="header second">
		<?php include('includes/AN_logo.php'); ?>
		<div class="col2_3">
			<h2>Account recovery: let's take 5 min to reconfigure your plugin!</h2>
		</div>
	</div>

	<div class="panel main ">
		<!-- wizard steps -->
		<div class="panel left">
			<div class="navigation wizard">
				<ul>
					<li class="selected">
						<a href="../demo/AN_setup1a0_plugincheckfail.php">1. Security checks</a>
					</li>
					<li class="disabled">
						2. Import key
					</li>
					<li class="disabled">
						3. Set a new security token
					</li>
					<li class="disabled">
						5. Login!
					</li>
				</ul>
			</div>
		</div>
		<!-- main -->
		<div class="panel middle">
			<div class="grid grid-responsive-12">
				<div class="row">
					<div class="col7">
						<div class="plugin-check-wrapper">
							<h3>Plugin check</h3>
							<div class="plugin-check firefox success">
								<p class="message">Nice one! Firefox plugin is installed and up to date. You are good to go!.</p>
							</div>
						</div>
						<div class="why-plugin-wrapper">
							<h3>Url Check</h3>
							<p>
								You are about to reconfigure the plugin to work with the following domain. Please confirm that this is a domain managed by an organisation you trust:
							</p>
							<form>
								<div class="input text disabled">
									<label for="js_setup_domain">Domain</label>
									<input name="domain" id="js_setup_domain" type="text" value="https://demo.passbolt.com" disabled="disabled"/>
								</div>
								<div class="input text disabled">
									<label for="js_setup_domain">Server Key</label>
									<input name="key_fingerprint" id="js_setup_key_fingerprint" type="text" value="292F8400D09A70DC" disabled="disabled"/>
									<a href="../demo/AN_setup1a1_plugincheckok_keyinformation.php" class="more" id="js_server_key_info">More</a>
								</div>
								<div class="input checkbox">
									<input type="checkbox" id="checkbox1" value="legit"/>
									<label for="checkbox1">I've checked, this domain name and the key looks legitimate.</label>
								</div>

								<div class="submit-input-wrapper">
									<a href="../demo/AN_setup2a0_createnewkey.php" class="button primary big disabled">next</a>
								</div>
							</form>
						</div>
					</div>
					<div class="col5 last">
						<div class="video-wrapper">
							<iframe width="400" height="300" src="https://www.youtube.com/embed/u-vDLf7cmf0" frameborder="0" allowfullscreen></iframe>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
	<?php include('includes/AN_footer.php'); ?>
</div>
</body>
</html>