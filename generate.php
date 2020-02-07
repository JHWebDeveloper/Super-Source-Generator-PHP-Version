<?php
  function generateFormToken() {
    $token = md5(uniqid(microtime(), true));  

    $_SESSION['token'] = $token; 

    return $token;
  }

  function verifyFormToken() {
		if(!isset($_SESSION['token'])) return false;

		if(!isset($_POST['token'])) return false;

		if ($_SESSION['token'] !== $_POST['token']) return false;

		return true;
	}

  function clean($input){
		return htmlentities(trim(strip_tags(stripslashes($input))), ENT_NOQUOTES, 'UTF-8');
  }

  function createFile($path, $f_name, $contents) {
    $fp = fopen($path . $f_name . '.png', 'x');

    fwrite($fp, $contents);
    fclose($fp);
  }

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (verifyFormToken()) {
      $whitelist = array(
        'token',
        'dataURL',
        'paste',
        'source-name',
        'prefix',
        'final-mugs',
        'premade',
        'generate'
      );

      foreach ($_POST as $key=>$item) {
        if (!in_array($key, $whitelist)) {
          echo '<script>window.location = "hack.html"</script>';
        }
      }
            
      $json  = json_decode(clean($_POST['dataURL']));

      for ($i = 0; $i < count($json); $i++) {
        $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', clean($json[$i] -> url)));
        $name = clean($json[$i] -> name);

        if (isset($_POST['final-mugs'])) {
          createFile('/mnt/K_Drive/News_Mugs/FINAL MUGS/', $name, $data);
        }

        if (isset($_POST['premade'])) {
          createFile('/mnt/K_Drive/News_Resources/Source overays PRE-MADE/', $name, $data);
        }
      }
            
      echo '<script>window.location = "success.html"</script>';
    } else {
      echo '<script>window.location = "hack.html"</script>';
    }
  }

  $new_token = generateFormToken();
?>