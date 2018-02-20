<?php
/**
* example program for imsmanager
*
* note:
* after the original sorce function for sceditor, img select does not work. 
* Therefore, they also redefine the source editor.
*/
// config:
define('LNG','en');
define('IMGROOT','./app/images');
define('MODELTIMEOUT',10000);
?>
<html>
    <head>
		<meta charset="utf-8">
		<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">    
		<title>imgmanager example</title>
		<link rel="stylesheet" href="./app/styles/bootstrap.min.css">
		<link rel="stylesheet" href="./app/styles/font-awesome.min.css">

		<!-- declare  golabals -->
		<script type="text/javascript">
			var global = {};
			global.lng = {
				"tokens" : [],
				"_" : function(txt) {
					if (this.tokens[txt] != undefined) {
						result = this.tokens[txt];
					} else {
						result = txt;
					}
					return result;
				},
				"set": function(name,value) {
					this.tokens[name] = value;
					return;
				}
			}
			global.lng.CODE = '<?php echo LNG; ?>';
			global.IMGROOT = '<?php echo IMGROOT; ?>';
			global.MODELTIMEOUT = <?php echo MODELTIMEOUT; ?>;

			global.modelI = 1; // this is only test
			global.msgScope = {};
			global.imgmanagerScope = {};
			global.alert = function(s) {
			  window.alert(s);
			};
			global.$ = function(selector) {
				return $(selector);
			}
			global.getInnerWidth = function() {
				return window.innerWidth;
			};
			global.getInnerHeught = function() {
				return window.innerHeight;
			};
		</script>

		<!-- load core js, cone css, my css files -->
		<script src="./app/core/jquery-1.11.0.min.js"></script>
		<link rel="stylesheet" href="./app/core/minified/themes/default.min.css" />
		<script src="./app/core/minified/jquery.sceditor.bbcode.min.js"></script>		
		<script src="./app/core/minified/languages/<?php echo LNG; ?>.js"></script>		
		<link rel="stylesheet" href="./app/styles/imgmanager.css" />
		<link rel="stylesheet" href="./app/styles/popup.css" />

    </head>
    <body ng-app="myApp">
		<div id="divWorking" style="display:none">
				<i class="fa fa-spinner fa-spin fa-3x fa-fw">&nbsp;</i>
				<span class="sr-only">Working...</span>
		</div>
		<div id="msg" ng-controller="msgController" 
				ng-include="'./app/views/<?php echo LNG; ?>/msg.html'"></div>
		<div id="imgManager" ng-controller="imgmanagerController" 
				ng-include="'./app/views/<?php echo LNG; ?>/imgmanager.html'"></div>
		<div class="container" ng-controller="myController">
			<h1>imgManager example</h1>
			<p>Probe the image insert / edit function!</p>
			<textarea id="description"></textarea> 
		</div>
		
		<!-- load angularjs system -->
		<script src="./app/core/angular.min.js"></script>
		<!-- init Angularjs and globals -->
		<script type="text/javascript">
			global.app = angular.module('myApp', []);
			global.app.models = [];
		</script>

		<!-- load Angularjs controllers -->
		<script src="./app/model.js"></script>
		<script src="./app/controllers/msgCtrl.js"></script>
		<script src="./app/controllers/imgmanagerCtrl.js"></script>
		<script src="./app/views/<?php echo LNG; ?>/imgmanager.lng"></script>
		
		<!-- AngularJs main program -->
		<script type="text/javascript">
			global.app.controller('myController', function($scope, $http, $timeout){
				$scope.description = '';
				// redefine image command
				$.sceditor.command.set('image', {
					exec: function() {
						global.imgManagerScope.imageCommand(this);
						/*
						global.imgManagerScope.result = this;
						global.imgManagerScope.loadFiles();
						global.imgManagerScope.imgManagerShow = true;
						global.imgManagerScope.$apply();
						*/
					}
				});
				// redefine source command
				$.sceditor.command.set('source', {
					exec: function() {
						global.imgManagerScope.srcEditorCommand(this);
					}
				});

				// convert textarea to sceditor
				global.$('#description').sceditor({
					plugins: 'xhtml',
					style: './app/core/minified/jquery.sceditor.default.min.css',
					width: '800px',
					height: '400px',
					locale: global.lng.CODE
				});
				global.$('#description').sceditor('instance').val($scope.description);
			});
		</script>
	</body>
</html>
