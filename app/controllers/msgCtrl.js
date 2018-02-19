'use strict';

global.app.controller('msgController', function($scope, $routeParams, $http, $timeout) {
	//Controller Here
	$scope.msg = '';
	$scope.msgs = [];
	$scope.msgClass = '';
	//$scope.paths = [["#/regist","Regisztráció"],["#/login","Bejelentkezés"],["#/aaa","aaa"]];
	$scope.path = [];
	/**
	* üzenet irás a felhasználónak, üzenet törlés: setmsg('','');
	* @param string üzenet szöveg (nem leforditott, vesszővel szeparált lista is lehet)
	* @param string bootstart css 'error' | 'warning' | 'info' | 'success'
	*/
	$scope.setMsg = function(msg,msgClass) {
		var i = 0;		
		var msgs = [];
		var w = [];
		if (msg === '') {
			$scope.msg = '';
			$scope.msgs = [];
			$scope.msgClass = '';
			return;
		}
		w = msg.split(',');
		if (w.length === 1) {
			$scope.msg = global.lng._(msg);
			$scope.msgs = [];
			if (msg === '') {
				msgClass = '';
			}
		} else {
			msgs = [];
			for (i = 0; i < w.length; i++) {
				if (w[i] !== '') {
					msgs.push(global.lng._(w[i]));
				}
			}
			$scope.msgs = msgs;
			$scope.msg = '';
		}
		if (msgClass === 'error') {
			msgClass = 'danger';
		}
		if (msgClass === undefined) {
			msgClass = 'info';
		}
		if (msgClass !== '') {
			$scope.msgClass = 'alert alert-'+msgClass; 
		} else {
			$scope.msgClass = ''; 
		}	
	};

	// popup
	$scope.popupShow = false;
	$scope.popupTxt = '';
	$scope.popupClose = function() {
		$scope.popupShow = false;
	}
	$scope.popup = function(txt) {
		global.windowScrollTo(0,0);
		$scope.popupTxt = global.lng._(txt);
		$scope.popupShow = true;
	}

	// confirm
	$scope.confirmShow = false;
	$scope.confirmTxt = '';
	$scope.confirmClose = function() {
		$scope.confirmShow = false;
	}
	$scope.confirmOk = function() {};
	$scope.confirm = function(txt,okFun) {
		$scope.confirmTxt = global.lng._(txt);
		$scope.confirmOk = okFun;
		$scope.confirmShow = true;
	}

	global.msgScope = $scope;
});
