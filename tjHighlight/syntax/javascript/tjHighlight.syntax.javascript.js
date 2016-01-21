/*
* Javascript language library for Turbojet Syntax Highlight
*   (http://heap.tech/author/zizzleZee)
*
* Copyright (c) 2015-2016 Evgeny Zacharov
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
* 
* $Version: 0.0.1a
*/
(function () {
    "use strict"

    const syntaxLang = "js|javascript";

    const cssSyntaxSelector = 'js';

    const syntaxVersion = "0.0.1a";

    var keywords = ["function", "new", "return", "var", "break",
        "case", "class", "catch", "const", "continue", "debugger", "default", "delete", "do",
        "else", "export", "extends", "finally", "for", "if", "import", "in", "instanceof",
        "let", "super", "switch", "this", "throw", "try", "typeof", "void", "while", "with", "yield"]

    if (tjHighlight &&
        typeof tjHighlight === "function") {
        
        tjHighlight.prototype.Langs.push({
            Lang: syntaxLang,
            cssSelector: cssSyntaxSelector,
            Version: syntaxVersion,
            ReplaceRule: [
                {
                    pattern: "(http[s]?://.*?)",
                    replace: "<span class='link'><a>$</a></span>"
                },
                {
                    pattern: "(\/.+?\/)",
                    replace: "<span class='regex'>$</span>"
                },
                {
                    pattern: "(//.*)",
                    replace: "<span class='comments'>$</span>"
                },
                {
                    pattern: "(/\\*[\\s\\S]*\\*/)",
                    replace: "<span class='comments'>$</span>"
                }
            ],
            Keywords: keywords
        });
    }

})();