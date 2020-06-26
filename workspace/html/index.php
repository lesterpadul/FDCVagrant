<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="http://examples.hmp.is.it/css/normalize.min.css">
        <link rel="stylesheet" href="http://examples.hmp.is.it/css/main.css">
        <link rel="stylesheet" href="http://examples.hmp.is.it/vendor/jquery-ui/css/ui-lightness/jquery-ui-1.10.3.custom.min.css">
        <link rel="stylesheet/less" type="text/css" href="http://examples.hmp.is.it/less/chromakey.less" />

        <script src="http://examples.hmp.is.it/js/vendor/modernizr-2.6.2.min.js"></script>
        <script src="http://examples.hmp.is.it/js/less.min.js"></script>
        <script src="http://examples.hmp.is.it/js/jquery.min.js"></script>
        <script src="http://examples.hmp.is.it/vendor/jquery-ui/js/jquery-ui-1.10.3.custom.min.js"></script>
        <style>
        </style>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        <div id="container">
            <img id="source" src="http://examples.hmp.is.it/img/chromakey/manwithbriefcase.jpg" alt="Lady with guns against a greenscreen background" />
        </div>
        <div id="controls">
            <label for="tolerance">Tolerance</label><br />
            <input name="tolerance" id="tolerance" type="text" value="150" />
            <div id="tolerance-control"></div>
            <label for="color">Color</label><br />
            <input name="color" id="color" readonly type="text" value="#A90" />
            <div id="color-r" class="color-slider"></div>
            <div id="color-g" class="color-slider"></div>
            <div id="color-b" class="color-slider"></div>
        </div>
        <script src="js/plugins.js"></script>
        <script src="js/chromakey.js"></script>
    </body>
</html>
