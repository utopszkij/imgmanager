/**
* Remote php model interface
* - egy kliens aszinkron modon több kérést indithat
* - a kérésekben szerepel modelI és clientId
*/

global.app.models = [];
/**
* model objektum
* @param object $http
* @param string modelName (php file név a ./models könyvtárban)
* @param string task (method név a model.php -ban)
* @param object data input adatok a task számára
* @return object
* php data model respone: {"errorMsg":"keyError"|""|"...", "userKey":"...", .......}
* keyError esetén KEYERRORLIMIT -szer újra probálkozik. 
*/
function modelClass(http,modelName,task,data) {
	this.http = http; 
	this.modelName = modelName; 
	this.task = task; 
	this.data = data;
	this.modelI = -1; // tömb index a app.models -ben
	this.successFun = undefined;
	this.errorFun = undefined;
	/**
	* remote call method
	* @param function successFunction
	* @param function errorFunction
	* @return void
	*/
	this.then = function(successFun, errorFun) {
		if (this.task != 'dummy') {
			var wleft = Math.round(window.innerWidth/2) - 20;
			var wtop = Math.round(window.innerHeight/2) - 20;
			$('#divWorking').css('left',wleft+'px');
			$('#divWorking').css('top',wtop+'px');
			$('#divWorking').show();
		}	
		this.successFun = successFun;
		this.errorFun = errorFun;
		this.data.task = this.task;
		this.data.modelI = this.modelI;
		this.data.clientId = global.clientId;
		this.http.post('./models/'+this.modelName+'.php',this.data, {"timeout": global.MODELTIMEOUT}).then(
			function(response) { 
				$('#divWorking').hide();
				if (response.data.modelI != undefined) {
					var myModel = global.app.models[response.data.modelI];
					myModel.successFun(response);
				} else {
					global.alert('model.js Fatal error modelI not defined '+response.data);
				}
			},
			function(response) {
				$('#divWorking').hide();
				var myModel = global.app.models[response.data.modelI];
				myModel.errorFun(response);
			}	
		);
		return;	
	};
}	

/**
* model interface rutin
* @param object $http
* @param string modelName
* @param string task
* @param object data
* @return object modelClass
* használata:
* global.model($http,'model', 'task1', data).then(
*   function(response) {
*     // sucess response.data.errorMsg, response.data.xxxx, ...... feldolgozása 	
*   },
*   function(response) {
*     // error response.status, response.statusText feldolgozása 	
*   }
* );
*/
global.model = function($http, modelName, task, data) {
	if (global.app.models.length > 100) {
			global.app.models.slice(0,1);
	}
	global.app.models.push(new modelClass($http, modelName, task, data));
	var modelI = global.app.models.length - 1;
	var myModel = global.app.models[modelI];
	myModel.modelI = modelI;
	return global.app.models[modelI];
};	
