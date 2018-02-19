'use strict';
/**
* angularjs controller
* imgManager for scedit 
*/
global.app.controller('imgmanagerController', function($scope, $http) {
	$scope.result = {}; // result sceditor 
	$scope.imgManagerShow = false;
	$scope.path = global.IMGROOT;
	$scope.imgUrl = '';
	$scope.imgManagerFile = '';
	$scope.imgManagerWidth = '';
	$scope.imgManagerHeight = '';
	$scope.imgManagerMargin = '';
	$scope.imgManagerAlign = '';
	$scope.imgManagerNewDir = '';
	$scope.files = [];

	/**
	* cancel button click
	*/
	$scope.cancelClick = function() {
		$scope.imgManagerShow = false;
	};

	/**
	* load and show fileList from $scope.path directory and
	* process scedtor selected item
	*/
	$scope.loadFiles = function() {

		var data = {"path": $scope.path};
		global.model($http,'imgmanager', 'getItems', data).then(
		   function(response) {
			 // sucess response: {"errormsg":"...", "data":{"items":[...]}} 	
			 var node = {};
			 var img = false;
			 var i = 0;
			 $scope.files = response.data.items;	
			 $scope.imgManagerFile = '';
			 $scope.imgManagerWidth = '';
			 $scope.imgManagerHeight = '';
			 $scope.imgManagerMargin = '';
			 $scope.imgManagerAlign = '';
			 $scope.imgManagerFile = '';
			 $scope.imgUrl = '';

			 // process sceditor selected item
			 if (typeof $scope.result.currentNode !== "undefined") { 
				 node = $scope.result.currentNode();
				 if (node != undefined) {
					 if (node.nodeName == 'IMG') {
						img = node;
					 } else {
						 for (i=0; i < node.childNodes.length; i++) {
							if (node.childNodes[i].nodeName == 'IMG') {
								img = node.childNodes[i];
							}
						 }
					 }
					 if (img) {
						$scope.imgUrl = img.src;
						$scope.imgManagerWidth = img.style.width;
						$scope.imgManagerHeight = img.style.height;
						$scope.imgManagerMargin = img.style.margin;
						$scope.imgManagerAlign = img.style.float;
					 }
				 }
			 }	
			 $('#divWorking').hide();
		   },
		   function(response) {
			 // error response.status, response.statusText feldolgozása 	
			 console.log('imgManager model error');
			 $scope.imgManagerFile = '';
			 $scope.imgManagerWidth = '';
			 $scope.imgManagerHeight = '';
			 $scope.imgManagerMargin = '';
			 $scope.imgManagerAlign = '';
			 $scope.imgManagerFile = '';
			 $scope.files = [];
			 $scope.imgUrl = '';
			 $('#divWorking').hide();
		   }
		);
	}

	/**
	* user change the selected file in fileList
	*/
	$scope.fileChange = function() {
		var s = $scope.imgManagerFile;
		var w = [];
		var i = 0;
		if (s == ' [..]') {
			// goto into upper folder
			if ($scope.path != global.IMGROOT) {
				w = $scope.path.split('/');
				for (i=0; i <= (w.length - 2); i++) {
					s = s +'/' + w[i];
				}
				$scope.path = s;
				$scope.loadFiles();
			}
		} else if (s.substr(0,2) == ' [') {
			// goto into child folder
			s = s.replace(' [','');
			s = s.replace(']','');
			$scope.path = $scope.path + '/' + s;
			$scope.loadFiles();
		} else {
			// select file
			$scope.imgManagerFile = s;
			$scope.imgUrl = $scope.path + '/' + s;
		}
	};

	/**
	* user click in Insert button, insert IMG tag into sceditor 
	*/
	$scope.okClick = function() {
		if ($scope.imgUrl != '') {
			var s = '<img src="'+$scope.imgUrl+'" style="';
			if ($scope.imgManagerWidth != '') {
				if (($scope.imgManagerWidth.indexOf('px') < 0) &
				    ($scope.imgManagerWidth.indexOf('%') < 0)) {
					$scope.imgManagerWidth += 'px';
				}
				s = s + 'width:'+$scope.imgManagerWidth+';';
			}
			if ($scope.imgManagerHeight != '') {
				if (($scope.imgManagerHeight.indexOf('px') < 0) &
				    ($scope.imgManagerHeight.indexOf('%') < 0)) {
					$scope.imgManagerHeight += 'px';
				}
				s = s + 'height:'+$scope.imgManagerHeight+';';
			}
			if ($scope.imgManagerMargin != '') {
				if (($scope.imgManagerMargin.indexOf('px') < 0) &
				    ($scope.imgManagerMargin.indexOf('%') < 0)) {
					$scope.imgManagerMargin += 'px';
				}
				s = s + 'margin:'+$scope.imgManagerMargin+';';
			}
			if ($scope.imgManagerAlign != '') {
				s = s + 'float:'+$scope.imgManagerAlign+';';
			}
			s = s +'" />';
			if (typeof $scope.result.insert !== "undefined") { 
				$scope.result.insert(s);
			}
			$scope.imgManagerShow = false;
		}
	};

	/**
	* fileDel click
	*/
	$scope.fileDelClick = function() {
		global.msgScope.confirm($scope.imgManagerFile+' '+global.lng._('SUREDELETE'),function() {
			global.msgScope.confirmShow = false;
			var data = {"path": $scope.path, "fileName": $scope.imgManagerFile};
			global.model($http,'imgmanager', 'delFile', data).then(
			   function(response) {
				 // sucess 
				 $scope.loadFiles();	
			   },
			   function(response) {
				 // error response.status, response.statusText feldolgozása 	
				 console.log('imgManager model error');
				 $scope.imgManagerFile = '';
				 $('#divWorking').hide();
			   }
			);
		});
	}; 
	/**
	* folderDel click
	*/
	$scope.folderDelClick = function() {

console.log(global.lng);

		global.msgScope.confirm($scope.path+' '+global.lng._('SUREDELETE'),function() {
			global.msgScope.confirmShow = false;
			var data = {"path": $scope.path};
			global.model($http,'imgmanager', 'delFolder', data).then(
			   function(response) {
				 // sucess response.data.errorMsg, response.data.xxxx, ...... feldolgozása 	
				 $scope.path = './app/images';
				 $scope.loadFiles();	
			   },
			   function(response) {
				 // error response.status, response.statusText feldolgozása 	
				 console.log('imgManager model error');
				 $scope.imgManagerFile = '';
				 $('#divWorking').hide();
			   }
			);
		});
	} 

	/**
	* user click in Upload button
	*/
	$scope.uploadClick = function() {
		$('#divWorking').show();
		$('#imgManager_path').val('.'+$scope.path);
		$('#imgManagerForm').submit();
	};

	/**
	* user click in newDir button
	*/
	$scope.newdirClick = function() {
		$scope.imgManagerNewDir = $scope.imgManagerNewDir.trim();
		$scope.imgManagerNewDir = $scope.imgManagerNewDir.replace(/\W/g, '');
		if ($scope.imgManagerNewDir != '') {
			var data = {"path": $scope.path, "newDir": $scope.imgManagerNewDir}
			global.model($http,'imgmanager', 'newDir', data).then(
			   function(response) {
				 // sucess response.data.errorMsg, response.data.xxxx, ...... feldolgozása 	
		 		 $scope.loadFiles();
			   },
			   function(response) {
				 // error response.status, response.statusText feldolgozása 	
				 console.log('imgManager model error');
		 		 $scope.loadFiles();
			   }
			);
		}
	};

	global.imgManagerScope = $scope;
});
