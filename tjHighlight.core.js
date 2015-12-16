/*
* Turbojet Syntax Highlight - native javascript code highlighter for various langs
*   (http://heap.tech)
*
* Copyright (c) 2015 Evgeny Zacharov
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
* 
* $Version: 16/12/2015
*/
(function (wnd) {

    wnd.tjHighlight = function (elementObject, options) {

        var core = {
            Options: {

                lines: false,
                onClick: null,
                onDblClick: null

            },
            Element: {},
            Pattern: {},
            ApplyOptions: function (o) {

                for (var io in options) {

                    for (var o in this.Options) {

                        if (o == io) {
                            this.Options[o] = options[io];
                        }

                    }
                }
            },
            Highlight: function (e) {

                var _methods = {

                    createPattern: function (syntaxReplaceRules) {

                        var basePattens = [
                            "('[\\s\\S]*?')",   //string in ''
                            "(\"[\\s\\S]*?\")", //string in ""
                            "(\\n)",            //newline
                            "(\\t)",            //tab
                            "(\\s{4})"          //4 spaces
                        ];

                        if (Object.prototype.toString.call(syntaxReplaceRules) == "[object Array]") {

                            for (var r in syntaxReplaceRules) {

                                basePattens.push(syntaxReplaceRules[r].pattern);

                            }
                        }

                        return new RegExp(basePattens.join('|'), "gim");
                    },

                    highlightKeywords: function (keywords, sourceText) {

                        var lines = sourceText.split('\n');

                        var regex = {};

                        //remove empty spaces
                        for (var l = 0 in lines) {

                            if (lines[l].length == 0) {
                                lines.splice(l * 1, 1);

                                break;
                            }
                        }

                        //format keywords by temp signs ~void~
                        for (var l = 0 in lines) {

                            for (var k in keywords) {

                                if (lines[l].length > 0) {

                                    regex = new RegExp("(" + keywords[k] + ")(?:[\\s\\W]{1})", "gi");

                                    if (regex.test(lines[l])) {

                                        lines[l] = lines[l].replace(regex, function (a, b) {

                                            return '~' + b + '~' + a.slice(b.length);

                                        });
                                    }
                                }
                            }

                            if (core.Options.lines) {
                                lines[l] = '@@' + (l * 1 + 1) + '@@' + lines[l];
                            }
                        }

                        return lines.join('\n');
                    },

                    highlightAdvanced: function (patternObject, sourceText, advancedRulesArray) {

                        return sourceText.replace(patternObject, function (a, b) {

                            var _regex = new RegExp(patternObject.source, "gim");

                            var _gr = _regex.exec(a);

                            if (_gr &&
                                _gr.length > 0) {

                                var i = 0;

                                for (var g in _gr) {

                                    switch (i) {

                                        case 1:                 //string in quotes

                                            if (typeof _gr[g] === "string") {
                                                return `<span class='string'>${a
                                                    .replace(/\n/gim, "<br/>\n")
                                                    .replace(/\s{4}|\t/gim, "<span class='tab'></span>")}</span>`;
                                            }

                                            break;

                                        case 2:                 //string in double quotes

                                            if (typeof _gr[g] === "string") {
                                                return `<span class='string'>${a
                                                    .replace(/\n/gim, "<br/>\n")
                                                    .replace(/\s{4}|\t/gim, "<span class='tab'></span>")}</span> `;
                                            }

                                            break;

                                        case 3:                 //newline

                                            if (typeof _gr[g] === "string") {
                                                return "<br/>\n";
                                            }

                                            break;

                                        case 4:                 //tab

                                            if (typeof _gr[g] === "string") {
                                                return "<span class='tab'></span>";
                                            }

                                            break;

                                        case 5:                 //4 spaces on a row -> "    ". Like one tab

                                            if (typeof _gr[g] === "string") {
                                                return "<span class='tab'></span>";
                                            }

                                            break;

                                        default:

                                            if (i > 5 &&
                                                typeof _gr[g] === "string") {

                                                try {
                                                    if (advancedRulesArray &&
                                                        advancedRulesArray[i - 6] &&
                                                        advancedRulesArray[i - 6].replace) {

                                                        return ((replaceTemplate, replaceValue) => {

                                                            return replaceTemplate.replace(/(\$)/gim, replaceValue
                                                                .replace(/(\n)/g, "<br/>\n")
                                                                .replace(/(\s{4}|\t)/g, "<span class='tab'></span>"));

                                                        })(advancedRulesArray[i - 6].replace, _gr[g]);
                                                    }
                                                    else throw { message: "syntax advanced rules array index error" };
                                                }
                                                catch (e) {
                                                    console.error(`error accessing to syntax advanced rule template ${e.message}`);
                                                }

                                                return "";
                                            }

                                            break;
                                    }
                                    i++;
                                }
                            }
                            return;
                        });
                    },

                    highlightFinally: function (sourceText) {

                        var replaced = sourceText.replace(/~(.*?)~/gi, "<span class='keyword'>$1</span>")

                        if (core.Options.lines) {
                            replaced = replaced.replace(/@@([0-9]{1,5})@@/g, "<div class='linenum'>$1</div>");
                        }

                        return replaced;
                    }

                };

                try {
                    if (e) {

                        if (e &&
                            e.tagName) {

                            this.Element = e;

                            var _elemSyntax = this.Element.attributes['syntax'] ? this.Element.attributes['syntax'].value : "";

                            if (_elemSyntax &&
                                _elemSyntax.length) {

                                var _protoLangs = tjHighlight.prototype.Langs;

                                var i = 0;

                                for (i in _protoLangs) {

                                    _lang = _protoLangs[i] ? _protoLangs[i].Lang : "";

                                    if (_protoLangs[i] &&
                                        _protoLangs[i].Lang &&
                                        _protoLangs[i].Lang.indexOf(_elemSyntax) >= 0) {

                                        this.Pattern = _methods.createPattern(_protoLangs[i].ReplaceRule);

                                        break;
                                    }
                                }

                                if (Object.prototype.toString.call(this.Pattern) === "[object RegExp]") {

                                    var readable = [];

                                    var highlightedKeywords = _methods.highlightKeywords(tjHighlight.prototype.Langs[i].Keywords, this.Element.innerHTML)

                                    var advancedHighlight = _methods.highlightAdvanced(this.Pattern, highlightedKeywords, tjHighlight.prototype.Langs[i].ReplaceRule);

                                    var finallyHighlight = _methods.highlightFinally(advancedHighlight);

                                    readable.push(`<div class='tjHighlight_wrap ${_elemSyntax}'>`);

                                    readable.push(finallyHighlight);

                                    readable.push("</div>");

                                    readable.push('<div class="tjHighlight_source">');

                                    readable.push(this.Element.innerHTML);

                                    readable.push('</div>');

                                    this.Element.innerHTML = readable.join('')

                                    this.Element.ondblclick = function () {

                                        var that = this,
                                            elementH = that.getElementsByClassName("tjHighlight_wrap")[0],
                                            elementS = that.getElementsByClassName("tjHighlight_source")[0];

                                        if (elementH &&
                                            elementH) {

                                            if (window.getComputedStyle(elementH).display === "block") {
                                                elementH.style.display = 'none';

                                                elementS.style.display = 'block';
                                            }
                                            else {
                                                elementH.style.display = 'block';

                                                elementS.style.display = 'none';
                                            }

                                        }

                                        if (core.Options.onDblClick &&
                                            typeof core.Options.onDblClick === "function") {

                                            core.Options.onDblClick();

                                        }
                                    };

                                    return;
                                }

                                throw { message: `syntax library for '${_elemSyntax}' not found!` };
                            }
                        }
                    }

                }
                catch (e) {
                    console.error('error: ' + e.message);
                }
            },

        };

        core.ApplyOptions(options);

        core.Highlight(elementObject);
    };

    function init() {
        wnd.tjHighlight.prototype.Langs = [];
    }

    init();

})(this);