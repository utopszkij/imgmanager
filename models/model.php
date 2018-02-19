<?php 
/**
*	- clientId, clientkey érkezik a klienstől, de lehet 0 -is, nincs rá hibavizsgálat
*		a szerver változatlanul vissza küldi, 
*	- clientId a session kezelést szolgálja.
*   - clientKey jelenleg nincs használva, továbbfejlesztés céljára van
*/
define('MYPATH',str_replace('/models','',__DIR__));

class Model {

	
	/**
	* task
	* @param object
	* @return object
	*
	protected function taskName($data) {
		$result = new stdClass();
		return $result;
	}
	*/


	/**
	* ez a model hivás fő eljárása
	* @file_get_content string data opcionális JSON string
	* @return string json_string tartalama: errorMsg,cilentKey,clientId,modelI,...
	*/
	public function exec($pdata='') {
		$result = new stdClass();
		$postdata = file_get_contents("php://input");
		$data = JSON_decode($postdata);

		// task végrehajtáse 
		$task = $data->task;
		$result = $this->$task ($data);	
		if (!isset($result->errorMsg)) $result->errorMsg = '';
		$result->modelI = $data->modelI;
		echo JSON_encode($result);
	} // exec method
} // Model class	

?>
