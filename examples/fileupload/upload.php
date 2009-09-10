// Here is the short version, below is the longer version that limits uploads
//<?php
//	move_uploaded_file($_FILES['Filedata']['tmp_name'], "c:/temp/upload/".$_FILES['Filedata']['name']); 
//?>

<?php
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//   You may change maxsize, and allowable upload file types.
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//Mmaximum file size. You may increase or decrease.
$MAX_SIZE = 0;
                            
//Allowable file Mime Types. Add more mime types if you want
$FILE_MIMES = array('image/jpeg','image/jpg','image/gif'
                   ,'image/png','application/msword');

//Allowable file ext. names. you may add more extension names.            
$FILE_EXTS  = array('.zip','.jpg','.png','.gif'); 

//Allow file delete? no, if only allow upload only
$DELETABLE  = false;                               


//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//   Do not touch the below if you are not confident.
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
/************************************************************
 *     Setup variables
 ************************************************************/
$site_name = $_SERVER['HTTP_HOST'];
$url_dir = "http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);
$url_this =  "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];

$upload_dir = "files/";
$upload_url = $url_dir."/files/";
$message ="";

/************************************************************
 *     Create Upload Directory
 ************************************************************/
if (!is_dir("files")) {
  if (!mkdir($upload_dir))
  	die ("upload_files directory doesn't exist and creation failed");
  if (!chmod($upload_dir,0755))
  	die ("change permission to 755 failed.");
}

/************************************************************
 *     Process User's Request
 ************************************************************/
if ($_REQUEST[del] && $DELETABLE)  {
  $resource = fopen("log.txt","a");
  fwrite($resource,date("Ymd h:i:s")."DELETE - $_SERVER[REMOTE_ADDR]"."$_REQUEST[del]\n");
  fclose($resource);
  
  if (strpos($_REQUEST[del],"/.")>0);                  //possible hacking
  else if (strpos($_REQUEST[del],$upload_dir) === false); //possible hacking
  else if (substr($_REQUEST[del],0,6)==$upload_dir) {
    unlink($_REQUEST[del]);
    print "<script>window.location.href='$url_this?message=deleted successfully'</script>";
  }
}
else if ($_FILES['Filedata']) {
  $resource = fopen("log.txt","a");
  fwrite($resource,date("Ymd h:i:s")."UPLOAD - $_SERVER[REMOTE_ADDR]"
            .$_FILES['Filedata']['name']." "
            .$_FILES['Filedata']['type']."\n");
  fclose($resource);

	$file_type = $_FILES['Filedata']['type']; 
  $file_name = $_FILES['Filedata']['name'];
  $file_ext = strtolower(substr($file_name,strrpos($file_name,".")));

  //File Size Check
  if ( $_FILES['Filedata']['size'] > $MAX_SIZE) 
     $message = "The file size is over 2MB.";
  //File Type/Extension Check
  else if (!in_array($file_type, $FILE_MIMES) 
          && !in_array($file_ext, $FILE_EXTS) )
     $message = "Sorry, $file_name($file_type) is not allowed to be uploaded.";
  else
     $message = do_upload($upload_dir, $upload_url);
  
  print "<script>window.location.href='$url_this?message=$message'</script>";
}
else if (!$_FILES['Filedata']);
else 
	$message = "Invalid File Specified.";

/************************************************************
 *     List Files
 ************************************************************/
$handle=opendir($upload_dir);
$filelist = "";
while ($file = readdir($handle)) {
   if(!is_dir($file) && !is_link($file)) {
      $filelist .= "<a href='$upload_dir$file'>".$file."</a>";
      if ($DELETABLE)
        $filelist .= " <a href='?del=$upload_dir".urlencode($file)."' title='delete'>x</a>";
      $filelist .= "<sub><small><small><font color=grey>  ".date("d-m H:i", filemtime($upload_dir.$file))
                   ."</font></small></small></sub>";
      $filelist .="<br>";
   }
}

function do_upload($upload_dir, $upload_url) {

	$temp_name = $_FILES['Filedata']['tmp_name'];
	$file_name = $_FILES['Filedata']['name']; 
  $file_name = str_replace("\\","",$file_name);
  $file_name = str_replace("'","",$file_name);
	$file_path = $upload_dir.$file_name;

	//File Name Check
  if ( $file_name =="") { 
  	$message = "Invalid File Name Specified";
  	return $message;
  }

  $result  =  move_uploaded_file($temp_name, $file_path);
  if (!chmod($file_path,0777))
   	$message = "change permission to 777 failed.";
  else
    $message = ($result)?"$file_name uploaded successfully." :
     	      "Somthing is wrong with uploading a file.";
  return $message;
}

?>

 