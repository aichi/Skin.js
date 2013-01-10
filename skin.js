; (function (exports, doc) {
    
    var dropInLibUrl = "http://api.maps.nokia.com/2.2.3/jsl.js",
        skinPayloadUrl = "out/payload.js",
        onLoadLib,
        dropInLibTag = doc.createElement("script"),
        skinPayLoadTag = doc.createElement("script"),
        detector = /(?:skin\.js\??([^\/].*?)$)/i,
        scriptTags = doc.getElementsByTagName("script"),
        libParamMatches,
        paramPairs = [0],
        appId = "",
        authToken = "",
        authCodeSrc = "",
        callBackSrc = "",
        authenticateAndSkin,
        finalCallBack,
        tmpParamValPair = [0],
        tmpParam = "",
        tmpParamValue = "";

    // Find ourselves among the other scripts
    for (var i=0, scriptTag; scriptTag=scriptTags[i++];) {
       if (scriptTag.src) {
            if (libParamMatches = detector.exec(scriptTag.src)) {
                break;
            }
       }
    }

    // Build callback invocation source and authentication calls
    if (libParamMatches.length == 2) {
        paramPairs = (libParamMatches[1]).split("&");
        for (var i=0, j=paramPairs.length; i < j; i++) {
            tmpParamValPair = paramPairs[i].split("=");
            if (tmpParamValPair.length == 2) {
                tmpParam = tmpParamValPair[0];
                tmpParamValue = tmpParamValPair[1];
                if (tmpParam && tmpParamValue) {
                    switch(tmpParam.toLowerCase()) {
                        case "callback":
                            callBackSrc = tmpParamValue + "();";
                            break;
                        case "appid":
                            appId = tmpParamValue;
                            break;
                        case "token":
                            authToken = tmpParamValue;
                            break;
                    }
                }
            }
        }
    }

    // Build post jsl-load script source
    if (appId.length > 0 && authToken.length > 0) {
        authCodeSrc = "nokia.Settings.set(\"appId\", \"" + appId + "\");\n" +
                      "nokia.Settings.set(\"authenticationToken\", \"" + authToken + "\");\n";
    }

    authenticateAndSkin = function () {
        console.log("hey");
        (new Function(authCodeSrc))(); // invoke auth with Nokia
        // appendSkinScript
         doc.head.appendChild(skinPayLoadTag);
    }
    
    // Prepare jsl.js manager and load extra features
    onLoadLib = function () {
        //debugger;
        /*nokia.Features.load({
                "map": "js-p2d-dom",
                "gfx": "canvas",
                "behavi1or": "all",
                "positioning": "w3c",
                "ui": "nokia_generic",
                "language": "en-US",
                "places": "dataonly"
            }, 
            function(){alert('sss')},
            function(){alert('errrrrr')},
            doc,
            false); //authenticate with nokia when jsl finishes loading packages
        */

    };

    // Prepare to invoke callback when everything else is done
    finalCallBack = new Function(callBackSrc);

/*    // Prepare jsl.js injection code and callback code for after loading
    dropInLibTag.setAttribute("type", "text/javascript");
    dropInLibTag.setAttribute("src", dropInLibUrl);

    // Detect when the jsl loader script has loaded and invoke the Features Manager to load all of the rest packages
    if (dropInLibTag.readyState) {
        script.onreadystatechange = function() {
            if (dropInLibTag.readyState === 'loaded' || dropInLibTag.readyState === 'complete') {
                dropInLibTag.onreadystatechange = null;
                onLoadLib();
            }
        };
    } else {
        dropInLibTag.onload = onLoadLib;
    }*/


    // Prepare skin lib script
    skinPayLoadTag.setAttribute("type", "text/javascript");
    skinPayLoadTag.setAttribute("src", skinPayloadUrl);
    // Detect when the skin script has loaded and invoke the final callback
    if (skinPayLoadTag.readyState) {
        script.onreadystatechange = function() {
            if (skinPayLoadTag.readyState === 'loaded' || dropInLibTag.readyState === 'complete') {
                skinPayLoadTag.onreadystatechange = null;
                finalCallBack();
            }
        };
    } else {
        skinPayLoadTag.onload = finalCallBack;
    }

    // Append the jsl.js script tag and start the whole sequence
    //doc.head.appendChild(dropInLibTag);
    authenticateAndSkin();
})(window, document);