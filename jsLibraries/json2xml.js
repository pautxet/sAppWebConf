function json2xml(o, removeTabs) {
    removeTabs = typeof removeTabs !== 'undefined' ? removeTabs : false;

    var toXml = function (v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            for (var i = 0, n = v.length; i < n; i++) {
                xml += toXml(v[i], name, ind + "");
            }
        } else if (typeof (v) === "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) === "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">\n" : "/>\n";
            if (hasChild) {
                for (var m in v) {
                    if (m === "#text")
                        xml += makeSafe(v[m]);
                    else if (m === "#cdata")
                        xml += "<![CDATA[" + lines(v[m]) + "]]>";
                    else if (m.charAt(0) !== "@")
                        xml += toXml(v[m], m, ind + "\t");
                }
                xml += (xml.charAt(xml.length - 1) === "\n" ? ind : "") + "</" + name + ">\n";
            }
        } else {
            xml += ind + "<" + name + ">" + makeSafe(v.toString()) + "</" + name + ">\n";
        }
        return xml;
    }, xml = "";
    for (var m in o) {
        xml += toXml(o[m], m, "");
    }
    return removeTabs ? xml.replace(/\t/g, "") : xml;
}

function normalizeLineEndings(str) {
    str = str.replace(/\r\n/g, '\n');
    return str;
}

function makeSafe(str) {
    return normalizeLineEndings(str.replace(/</g, '&lt;').replace(/&/g, '&amp;'));
}
