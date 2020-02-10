<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>Super Source Generator</title>
  <meta name="description" content="Super Source Generator is a web app developed by Jonathan Hamilton to help Ch9 employees produce single or multiple source overlays on the fly. No photoshop experience necessary." />
    
  <link rel="stylesheet" href="css/main.min.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
	
  <link rel="preload" href="js/main.min.js" as="script" />
  <link rel="prerender" href="success.html" />
  <link rel="prerender" href="instructions.html" />
    
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
</head>
<body>
  <header>
    <h1>Super Source<span>Generator</span></h1>
    <p>Developed by Jonathan Hamilton</p>
    <aside>
      <a class="material-icons" href="instructions.html" target="_blank" title="View Instructions">info_outline</a>
    </aside>
  </header>
  <main>
    <noscript>
      <style>
        main > :nth-child(n+2) { display: none; }
        noscript { text-align: center; }
      </style>
      <p>To use this app, please have javascript enabled.</p>
    </noscript>
    <?php include('generate.php'); ?>
    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
      <input type="hidden" name="token" value="<?php echo $new_token; ?>" />
      <input type="hidden" name="dataURL" />
      <fieldset name="sources">
        <textarea name="paste" placeholder="Here you can type or paste a list of sources each separated by a comma (e.g. Source 1, Source 2, ...)" hidden></textarea>
        <span>
          <input type="text" name="source-name" maxlength="51" placeholder="Type source name here"/>
          <input type="button" name="add" class="material-icons" value="add" title="Add another source" />
        </span>
      </fieldset>
      <input type="button" name="mode-switch" value="Paste Mode" title="Switch to Paste Mode" />
      <fieldset name="options">
        <input type="checkbox" name="prefix" id="prefix" checked />
        <label for="prefix">Add <q>Source: </q> to beginning</label><br />
        <input type="checkbox" name="final-mugs" id="final-mugs" checked />
        <label for="final-mugs">Save to Final Mugs</label><br />
        <input type="checkbox" name="premade" id="premade" />
        <label for="premade">Save to Premade Folder</label><br />
      </fieldset>
      <input type="submit" name="generate" value="Generate" title="Generate Source Super" disabled />
    </form>
    <div>
      <svg viewBox="0 0 200 200">
        <rect x="50.367" y="50" width="25" height="99.999"></rect>
        <rect x="87.867" y="50" width="25" height="99.999"></rect>
        <rect x="125.367" y="50" width="25" height="99.999"></rect>
      </svg>
    </div>
  </main>
  <script src="js/main.js" defer></script>
</body>
</html>
