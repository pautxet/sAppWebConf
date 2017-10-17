var url = {
    machine: "",
    pathlocation: "",
    ip: "",
    pathToImages: "",
    pathToXML: "",
    pathToXMLCBC: ""
};

var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

var x = "#910700",
        y = 4;
var sForm = "line";
var lx = "empty";
var ly = "empty";

var oldColorObjid = "#910700";

function initDrawCanvas() {
    x = "#910700";
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    ChangeNumberSelector(4);

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
    canvas.addEventListener("click", function (e) {
        PaintForm(e)
    }, false);


}

function color(obj) {
    document.getElementById(oldColorObjid).style.width = "15px";
    document.getElementById(oldColorObjid).style.height = "15px";
    obj.style.width = "20px";
    obj.style.height = "20px";
    oldColorObjid = obj.id;
    switch (obj.id) {
        case "#46D300":
            x = "#46D300";
            break;
        case "green":
            x = "green";
            break;
        case "#00AF81": //bluegreen
            x = "#00AF81";
            break;
        case "blue":
            x = "blue";
            break;
        case "#004370": // dark blue
            x = "#004370";
            break;
        case "#3A007C": //dark purple
            x = "#3A007C";
            break;
        case "#910700": //dark red
            x = "#910700";
            break;
        case "red":
            x = "red";
            break;
        case "orange":
            x = "orange";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "gray":
            x = "gray";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }

    if (x == "white")
        y = 4;
    else
        y = 4;

}
function form(obj) {
    switch (obj.id) {
        case "square":
            sForm = "square";
            document.getElementById("toolSelected").innerHTML = "square";
            break;
        case "triangle1":
            sForm = "triangle1";
            document.getElementById("toolSelected").innerHTML = "triangle to right";
            break;
        case "triangle2":
            sForm = "triangle2";
            document.getElementById("toolSelected").innerHTML = "triangle to left";
            break;
        case "line":
            sForm = "line";
            document.getElementById("toolSelected").innerHTML = "point to point line";
            break;
        case "handdraw":
            sForm = "handdraw";
            document.getElementById("toolSelected").innerHTML = "hand drawing";
            break;
    }
    document.getElementById("toolSelected").style.color = x;
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}


function findPos(id) {
    var node = document.getElementById(id);
    var currtop = 0;
    var currleft = 0;
    var currtopscroll = 0;
    if (node.offsetParent) {
        do {
            currtop += node.offsetTop;
            currleft += node.offsetLeft;
            currtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
        } while (node = node.offsetParent);

        offsets = {
            top: currtop - currtopscroll,
            left: currleft,
        };
        return(offsets);
    }
}
function PaintForm(e) {
    offsets = findPos('can');
    currX = e.clientX - offsets.left;
    currY = e.clientY - offsets.top;
    var c = document.getElementById("can");
    var ctx = c.getContext("2d");
    ctx.strokeStyle = x;
    trisize = 30;
    if (sForm == "square") {
        width = 50;
        height = 50;
        currX = currX - 25;
        currY = currY - 25;
        ctx.rect(currX, currY, width, height);
    } else if (sForm == "triangle1") {
        currX = currX - (trisize / 2);
        currY = currY - (trisize / 2);
        ctx.beginPath();
        ctx.moveTo(currX, currY);
        ctx.lineTo(currX + trisize, currY + (trisize / 2));
        ctx.lineTo(currX, currY + trisize);
        ctx.closePath();
        ctx.fill();
    } else if (sForm == "triangle2") {
        currX = currX + (trisize / 2);
        currY = currY + (trisize / 2);
        ctx.beginPath();
        ctx.moveTo(currX, currY);
        ctx.lineTo(currX - trisize, currY - (trisize / 2));
        ctx.lineTo(currX, currY - trisize);
        ctx.closePath();
        ctx.fill();
    } else if (sForm == "line") {
        switch (lx) {
            case "empty":
                lx = currX;
                ly = currY;
                break;
            default:
                ctx.beginPath();
                ctx.moveTo(lx, ly);
                ctx.lineTo(currX, currY);
                ctx.stroke();
                // triangle
                if ((Math.abs(currX - lx) > 60) || (Math.abs(currY - ly) > 60)) {
                    var v1x, v1y, v2x, v2y, v3x, v3y, vr, modVr;
                    trisize = 5;
                    modVr = Math.sqrt(Math.pow(currX - lx, 2) + Math.pow(currY - ly, 2));
                    v1x = (lx + currX) / 2 + ((-currY + ly) / modVr) * trisize;
                    v1y = (ly + currY) / 2 + ((currX - lx) / modVr) * trisize;
                    v2x = (lx + currX) / 2 - ((-currY + ly) / modVr) * trisize;
                    v2y = (ly + currY) / 2 - ((currX - lx) / modVr) * trisize;
                    v3x = (lx + currX) / 2 + ((currX - lx) / modVr) * (trisize + 4);
                    v3y = (ly + currY) / 2 + ((currY - ly) / modVr) * (trisize + 4);

                    ctx.beginPath();
                    midX = lx + (currX - lx) / 2;
                    midY = ly + (currY - ly) / 2;
                    ctx.moveTo(midX, midY);
                    ctx.lineTo(v1x, v1y);
                    ctx.lineTo(v3x, v3y);
                    ctx.lineTo(v2x, v2y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                lx = "empty";
                break;
        }
    }
    ctx.stroke();
}

function ChangeNumberSelector(ngiv) {
    y = ngiv;
    ctx.lineWidth = y;
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        if (sForm == "handdraw") {
            draw();
        }
        var el = canvas.getBoundingClientRect();
        var auxX = e.clientX - canvas.offsetLeft - el.left;
        var auxY = e.clientY - canvas.offsetTop - el.top;
        auxX = Math.round(auxX);
        auxY = Math.round(auxY);
        document.getElementById('idXY').innerHTML = "X: " + auxX + ", Y: " + auxY;
    }
}

function CreateDrawCanvas() {
    var haux = "";
    haux += "<div style='position:absolute;height:300px;z-index:100;'>";
    haux += "        <canvas id='can' width='640' height='280' style='background:rgba(0,0,0,0);position:relative;z-index:1000;border:2px solid;cursor:crosshair;margin-top:0px;'></canvas>";
    haux += "        <img id='canvasimg' style='position:absolute;top:10%;left:52%;' style='display:none;'>";
    haux += "</div>";
    return(haux);
}

function CreateDrawCanvasTools() {
    var haux = "";
    haux += "        <div style='display:inline-block;top:0%; position:relative;'>";
    haux += "            <div style='display:inline-block;width:15px;height:15px;background:blue;' id='blue' onclick='color(this)'></div>";
    haux += "            <div style='display:inline-block;width:20px;height:20px;background:#910700;' id='#910700' onclick='color(this)'></div>";
    haux += "            <div style='display:inline-block;width:15px;height:15px;background:gray;' id='gray' onclick='color(this)'></div>";
    haux += "            <div style='display:inline-block;width:15px;height:15px;background:black;' id='black' onclick='color(this)'></div>";
    haux += "            <div style='display:inline-block;width:15px;height:15px;background:white;' id='white' onclick='color(this)'></div>";
    haux += "     <div id='idXY' style='display: inline-block'></div>";
    haux += "     <div style='display:inline-block;margin-left:150px'>";
    haux += "            <div style='display:inline-block;width:80px;height:20px;background:white;border:2px solid;text-align:center;cursor:default;' onclick='MergeImageCanvas()'>Save</div>";
    haux += "            <div style='display:inline-block;width:80px;height:20px;background:white;border:2px solid;text-align:center;cursor:default;' onclick='erase()'>Clear</div>";
    haux += "            <div style='display:inline-block;width:80px;height:20px;background:white;border:2px solid;text-align:center;cursor:default;' onclick='InitializeGui()'>Cancel</div>";
    haux += "     </div>";
    haux += "        </div>";
    return(haux);
}
