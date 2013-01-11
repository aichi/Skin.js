; (function (exports, doc) {
    
    var skinPayloadUrl = "out/payload.js",
        onLoadLib,
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
        (new Function(authCodeSrc))(); // invoke auth with Nokia
        // appendSkinScript
         doc.head.appendChild(skinPayLoadTag);
    }

    // Prepare callback when everything else is done
    finalCallBack = new Function(callBackSrc);

    // Prepare skin lib script
    skinPayLoadTag.setAttribute("type", "text/javascript");
    skinPayLoadTag.setAttribute("src", skinPayloadUrl);
    // Detect when the skin script has loaded and invoke the final callback specified in the skin.js url declaration
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

    authenticateAndSkin();
})(window, document);