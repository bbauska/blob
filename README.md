<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US" xml:lang="en-US">
<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~ index.html of <blob.bauska.org> ~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
<head>
  <!-- meta viewport, title, desc, robot for SEO -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Brian Bauska">
  <meta name="title" content="Codepen.io Blob">
  <meta name="date" content="Wednesday, July 2nd, 2025"/>
  <meta name="revised" content="Wednesday, July 2th, 2025"/>
  <meta name="description" content="Codepen.io Blob.">
  <meta name="keywords" content="Codepen.io,Blob">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="/images/ms-icon-144x144.png">
  <meta name="theme-color" content="#ffffff">

  <!-- Twitter Meta -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@bbauska" />
  <meta name="twitter:creator" content="@bbauska" />
  
  <!-- Open Graph Meta data -->
  <meta property="og:url" content="https://meta.bauska.org/" />
  <!-- The type of object you’re sharing. (e.g., article, website, video.movie, etc.) -->
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="es_GB" />
  <meta property="og:locale:alternate" content="fr_FR" />
  <meta property="og:site_name" content="Codepen.io Blob" />
  <meta property="og:title" content="Codepen.io Blob" />
  <meta property="og:description" content="Open graph description of Codepen.io blob." />
  <meta property="og:image" content="http://images/myicon-template.jpg" />
  <title>Basic HTML Template</title>
  <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
  <link rel="canonical" href="https://blob.bauska.org">
  <link rel="shortcut icon" type="image/jpg" href="/images/favicon.ico"/>
  
  <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/styles/default.min.css">
  <script src="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/highlight.min.js"></script>

  <link rel="stylesheet" href="./css/styles.css">
  <!-- and it's easy to individually load SOME additional languages in javascript -->
  <script src="https://unpkg.com/@highlightjs/cdn-assets@11.11.1/languages/go.min.js"></script>

  <!-- Facebook image must be at least 600x315px -->
  <meta property="og:image" content="https://www.meta.bauska.org/images/image.jpg" />
  <meta property="og:description" content="Codepen.io Blob" />
  <meta property="og:site_name" content="codepen.io Blob" />
  <meta property="fb:admins" content="https://www.facebook.com/help/211813265517027/?helpref=uf_share" />

  <!-- favicon images -->
  <link rel="apple-touch-icon" sizes="57x57" href="/images/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/images/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/images/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/images/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/images/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192"  href="/images/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
  <link rel="manifest" href="/manifest.json">
</head>
<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
<body>
  <!-- blob.js -->
  <script src="/js/blob.js"></script>

  <!-- external resources -->
  <script src="https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.121.1/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js"></script>

  <!-- my 'about' site -->
  <div class="banner">You can zoom in and click and drag to explore the scene.</div>
  <a href="https://www.bauska.org/about/" class="btn btn-left" target="_blank">My Works</a>
  <button class="btn btn-right" id="fullscreenBtn">Go Fullscreen</button>
  <div class="webgl"></div>
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.161.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.161.0/examples/jsm/"
      }
    }
  </script>
</body>
</html>
