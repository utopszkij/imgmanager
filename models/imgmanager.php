<?php 
/**
* imgmanager data model
* tasks		data
* getItems  {"path":"..."}
* newDir    {"path":"...", "newDir":"..."}
* delFile   {"path":"...", "fileName":"..."}
* delFolder {"path":"..."}
*
* this file called AngulaJs $http and direct from http too.
*/

if (isset($_POST['imgManager_path'])) {
		/*
		* file upload processing
		* @POST file imgManager_file
		* @POST string imgManager_path
		*/
		$target_dir = $_POST['imgManager_path']."/";
		$target_file = $target_dir . basename($_FILES["imgManager_file"]["name"]);
		$uploadOk = 1;
		$errorMsg = '';
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

		// Check if image file is a actual image or fake image
		$check = getimagesize($_FILES["imgManager_file"]["tmp_name"]);
		if($check !== false) {
			$uploadOk = 1;
		} else {
			$errorMsg = 'Nem kép file';
			$uploadOk = 0;
		}
	
		// Delete file if already exists
		if (file_exists($target_file)) {
			unlink($target_file);
			$uploadOk = 1;
		}

		// Allow certain file formats
		if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
			$errorMsg = 'Nem megengedett file kiterjesztés';
			$uploadOk = 0;
		}

		// Check if $uploadOk is set to 0 by an error
		if ($uploadOk == 1) {
			if (move_uploaded_file($_FILES["imgManager_file"]["tmp_name"], $target_file)) {
				$errorMsg = '';
			} else {
				$errorMsg = 'Nem sikerült a fájlt feltölteni.';
			}
		}
		echo '<script type="text/javascript">
		';
		if ($errorMsg != '')
			echo 'parent.alert("'.$errorMsg.'");
			';	
		echo '	parent.global.imgManagerScope.loadFiles();
			  </script>
	   ';
} else {
	/**
	* processing AngularJs $http call
	*/
	include_once './model.php'; 
	class imgManagerModel extends Model {
		/**
		* read file list from $data->path folder
		* first item: [..]
		* @param object {"path":"./item"}
		* @return object {"errorMsg", "data":{"items:[..]}}
		*/
		public function getItems($data) {
			$result = new stdClass();
			$result->items = array(' [..]');
			if ($handle = opendir('.'.$data->path)) {
				while (false !== ($entry = readdir($handle))) {
					if (($entry != '.') & ($entry != '..')) {
						if (is_dir('.'.$data->path.'/'.$entry))
							$result->items[] = ' ['.$entry.']';
						else
							$result->items[] = $entry;
					}
				}
				closedir($handle);
			}
			$result->errorMsg = '';
			sort($result->items);
			return $result;
		}

		/**
		* Create new folder
		* @param object {"path":"./item", "newDir":"xxxx"}
		* @return object {"errorMsg"}
		*/
		public function newDir($data) {
			$result = new stdClass();
			if ($data->newDir != '') {
				if (mkdir('.'.$data->path.'/'.$data->newDir,0777))
					$result->errorMsg = '';
				else
					$result->errorMsg = 'Error in make dir';
			}
			return $result;
		}

		/**
		* delete one file
		* @param {"path":"...", "fileName":"..."}
		* @return object {"errorMsg"}
		*/
		public function delFile($data) {
			$target_file = '.'.$data->path.'/'.$data->fileName;
			$result = new stdClass();
			$result->errormsg = '';
			if (file_exists($target_file)) {
				unlink($target_file);
				$uploadOk = 1;
			}
			return $result;
		}

		/**
		* delete one folder
		* @param {"path":"..."}
		* @return object {"errorMsg"}
		*/
		public function delFolder($data) {
			$result = new stdClass();
			$result->errormsg = '';
			if (is_dir('.'.$data->path))
				rmdir('.'.$data->path);
			return $result;
		}
	}
	$myModel = new imgManagerModel();
	$myModel->exec();
}

?>


