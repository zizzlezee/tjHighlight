/*
* C# language library for Turbojet Syntax Highlight
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

    const syntaxLang = 'c#|csharp';

    const cssSyntaxSelector = 'csharp';

    const syntaxVersion = '0.0.1a';

    var keywords = ["add", "alias", "ascending", "async", "await",
        "descending", "dynamic", "from", "get", "global", "group", "into", "join", "let",
        "orderby", "partial", "partial", "remove", "select", "set", "value", "var", "where",
        "yield", "abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char",
		"checked", "class", "const", "continue", "decimal", "default", "delegate", "do", "double", "else", "enum",
		"event", "explicit", "extern", "false", "finally", "fixed", "float", "for", "foreach", "goto", "if", "implicit",
		"in", "int", "interface", "internal", "is", "lock", "long", "namespace", "new", "null", "object", "operator", "out",
		"override", "params", "private", "protected", "public", "readonly", "ref", "return", "sbyte", "sealed", "short",
		"sizeof", "stackalloc", "static", "string", "struct", "switch", "this", "throw", "true", "try", "typeof", "uint",
		"ulong", "unchecked", "unsafe", "ushort", "using", "virtual", "void", "volatile", "while"];
		
    if (tjHighlight &&
        typeof tjHighlight === "function") {

        tjHighlight.prototype.Langs.push({
            Lang: syntaxLang,
            cssSelector: cssSyntaxSelector,
            Version: syntaxVersion,
            ReplaceRule: [
                {
                    pattern: "(http[s]+://.*? )",
                    replace: "<span class='link'><a>$</a></span>"
                },
                {
                    pattern: "(//.*\\n)",
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