function loadObject(evt) {
    var obj_file = evt.target.files[0];

    if (obj_file) {
        var reader1 = new FileReader();
        reader1.onload = function() {
            object = reader1.result;
        }
        reader1.readAsText(obj_file);
    } else {
        alert("Failed to load file");
    }
}

function loadCamera(evt) {
    var cam_file = evt.target.files[0];

    if (cam_file) {
        var reader2 = new FileReader();
        reader2.onload = function() {
            camera = reader2.result;
        }
        reader2.readAsText(cam_file);
    } else {
        alert("Failed to load file");
    }
}

function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function ortogonalize(toBe, parameter) {
    let multiplier = ((toBe.x * parameter.x) + (toBe.y * parameter.y) + (toBe.z * parameter.z))
        / ((parameter.x * parameter.x) + (parameter.y * parameter.y) + (parameter.z * parameter.z));
    let returner = {x: (toBe.x - (parameter.x * multiplier)) ,
        y: (toBe.y - (parameter.y * multiplier)) ,
        z: (toBe.z - (parameter.z * multiplier))};
    return returner;
}

function crossProductVector(aim,vertical) {
    let returner = {x:((aim.y * vertical.z) - (aim.z * vertical.y))
        , y:((aim.z * vertical.x) - (aim.x * vertical.z))
        , z:((aim.x * vertical.y) - (aim.y * vertical.x))};
    return returner;
}

function normalize(vector) {
    let norma = Math.sqrt(Math.pow((vector.x),2) + Math.pow(vector.y,2) + Math.pow(vector.z,2));
    vector.x = vector.x / norma;
    vector.y = vector.y / norma;
    vector.z = vector.z / norma;
}

function sizeXbyVector(toBe) {
    let vectComparison = {x:toBe.x - focusPoint.x,y:toBe.y - focusPoint.y,z:toBe.z - focusPoint.z};
    let multiplier = ((vectComparison.x * aimVector.x) + (vectComparison.y * aimVector.y) + (vectComparison.z * aimVector.z))
        / ((aimVector.x * aimVector.x) + (aimVector.y * aimVector.y) + (aimVector.z * aimVector.z));
    //let returner = Math.sqrt(Math.pow((aimVector.x*multiplier),2) + Math.pow(aimVector.y*multiplier,2) + Math.pow(aimVector.z*multiplier,2));
    return multiplier;
}

function sizeYbyVector(toBe) {
    let vectComparison = {x:toBe.x - focusPoint.x , y:toBe.y - focusPoint.y , z:toBe.z - focusPoint.z};
    let multiplier = ((vectComparison.x * verticalVector.x) + (vectComparison.y * verticalVector.y) + (vectComparison.z * verticalVector.z))
        / ((verticalVector.x * verticalVector.x) + (verticalVector.y * verticalVector.y) + (verticalVector.z * verticalVector.z));
    //let returner = Math.sqrt(Math.pow((verticalVector.x*multiplier),2) + Math.pow(verticalVector.y*multiplier,2) + Math.pow(verticalVector.z*multiplier,2));
    return multiplier;
}

function sizeZbyVector(toBe) {
    let vectComparison = {x:toBe.x - focusPoint.x,y:toBe.y - focusPoint.y,z:toBe.z - focusPoint.z};
    let multiplier = ((vectComparison.x * horizontalVector.x) + (vectComparison.y * horizontalVector.y) + (vectComparison.z * horizontalVector.z))
        / ((horizontalVector.x * horizontalVector.x) + (horizontalVector.y * horizontalVector.y) + (horizontalVector.z * horizontalVector.z));
    //let returner = Math.sqrt(Math.pow((horizontalVector.x*multiplier),2) + Math.pow(horizontalVector.y*multiplier,2) + Math.pow(horizontalVector.z*multiplier,2));
    return multiplier;
}

function isInsideScreen() {
    let returner = false;
    let relativeHeight = 0;
    let relativeWidth = 0;
    for (let i = 0;i < pointsToBe.length; i++) {
        returner = false;
        relativeHeight = ((pointsToBe[i].y * distanceD) / pointsToBe[i].x);
        relativeWidth = ((pointsToBe[i].z * distanceD) / pointsToBe[i].x);
        if (pointsToBe[i].x >= distanceD) {
            if (relativeHeight <= halfHeight && relativeHeight >= -halfHeight) {
                if (relativeWidth <= halfWidth && relativeWidth >= -halfWidth) {
                    returner = true;
                }
            }
        }
        pointsToBe[i].isInScreen = returner;
        //ctx.fillText(pointsToBe[i].x + " " +pointsToBe[i].y + " " +pointsToBe[i].z + " " +pointsToBe[i].isInScreen,10,140 + (i*20));
    }
}

function isTriangleInScreen() {
    for (let i = trianglesToDisplay.length - 1; i > -1; i--) {
        if (!(pointsToBe[trianglesToDisplay[i].first].isInScreen == true || pointsToBe[trianglesToDisplay[i].second].isInScreen == true || pointsToBe[trianglesToDisplay[i].third].isInScreen == true)){
            //trianglesToDisplay[i].isInScreen = false;
            trianglesToDisplay.splice(i,1);
        } else {
            //ctx.fillText("Triangle "+ (i)+" is in screen.",10,140 + (i*20));
        }
    }
}

function distanceTriangleOrigin() {
    let first = undefined;
    let second = undefined;
    let third = undefined;
    let distance = 0;
    for (let i = trianglesToDisplay.length - 1; i > -1; i--) {
        first = pointsToBe[trianglesToDisplay[i].first];
        second = pointsToBe[trianglesToDisplay[i].second];
        third = pointsToBe[trianglesToDisplay[i].third];
        let aux = {x:((first.x + second.x + third.x)/3)
            ,y:((first.y + second.y + third.y)/3)
            ,z:((first.z + second.z + third.z)/3)};
        distance = Math.sqrt(Math.pow(aux.x,2) + Math.pow(aux.y,2) + Math.pow(aux.z,2));
        trianglesToDisplay[i].distance = distance;
    }
}

function flatToScreenPoint() {
    let relativeHeight = 0;
    let relativeWidth = 0;
    for (let i = 0;i < pointsToBe.length; i++) {
        relativeHeight = ((pointsToBe[i].y * distanceD) / pointsToBe[i].x);
        relativeWidth = ((pointsToBe[i].z * distanceD) / pointsToBe[i].x);
        pointsToBe[i].x = distanceD;
        pointsToBe[i].y = relativeHeight;
        pointsToBe[i].z = relativeWidth;
        ctx.fillText(pointsToBe[i].x + " " +pointsToBe[i].y + " " +pointsToBe[i].z + " " +pointsToBe[i].isInScreen,10,140 + (i*10));
    }
}

function drawTriangles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    trianglesToDisplay.sort(function(a, b){return a.distance - b.distance});
    let firstX =0;
    let firstY =0;
    let secondX =0;
    let secondY =0;
    let thirdX =0;
    let thirdY =0;
    let proportion = verticalCanvas/(halfHeight*2);
    for (let i = trianglesToDisplay.length - 1; i > -1; i--) {
        firstY = Math.ceil(proportion * (halfHeight - Math.ceil(pointsToBe[trianglesToDisplay[i].first].y))) ;
        firstX = Math.ceil(proportion * (halfWidth + Math.ceil(pointsToBe[trianglesToDisplay[i].first].z))) ;
        secondY = Math.ceil(proportion * (halfHeight - Math.ceil(pointsToBe[trianglesToDisplay[i].second].y))) ;
        secondX = Math.ceil(proportion * (halfWidth + Math.ceil(pointsToBe[trianglesToDisplay[i].second].z))) ;
        thirdY = Math.ceil(proportion * (halfHeight - Math.ceil(pointsToBe[trianglesToDisplay[i].third].y)));
        thirdX = Math.ceil(proportion * (halfWidth + Math.ceil(pointsToBe[trianglesToDisplay[i].third].z))) ;
        ctx.beginPath();
        ctx.moveTo(firstX,firstY);
        ctx.lineTo(secondX,secondY);
        ctx.lineTo(thirdX,thirdY);
        ctx.lineTo(firstX,firstY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ff6b00';
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

let container = document.getElementById('container');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let btn_obj = document.getElementById('objInput');
let btn_cam = document.getElementById('camInput');
let button_container = document.getElementsByClassName('btns-group');
let button_loaders = document.getElementsByClassName('btns-load');
let btn_visual_obj = document.getElementById('btn_obj');
let btn_visual_cam = document.getElementById('btn_cam');
let btn_start = document.getElementById('btn_start');

btn_obj.addEventListener('change',loadObject);
btn_cam.addEventListener('change',loadCamera);
btn_visual_obj.onclick = function clickObj(){btn_obj.click();};
btn_visual_cam.onclick = function clickCam(){btn_cam.click();};
btn_start.onclick = function doTheThing() {
    let aux = [];
    let numberTruth = false;
    let auxiliarString = undefined;
    for (let i = 0; i<camera.length;i++) {
        if (i == camera.length -1 && numberTruth && (camera.charAt(i) != "\n" && camera.charAt(i) != " ")) {
            auxiliarString += camera.charAt(i);
            aux.push(auxiliarString);
            numberTruth = false;
        } else if (i == camera.length -1 && numberTruth && (camera.charAt(i) == "\n" || camera.charAt(i) == " ")) {
            aux.push(auxiliarString);
            numberTruth = false;
        } else if (i == camera.length -1 && !numberTruth && (camera.charAt(i) != "\n" && camera.charAt(i) != " ")) {
            auxiliarString = camera.charAt(i);
            aux.push(auxiliarString);
            numberTruth = false;
        } else if (i == camera.length -1 && !numberTruth && (camera.charAt(i) == "\n" || camera.charAt(i) == " ")) {
            numberTruth = false;
        } else if (i < camera.length -1 && numberTruth && (camera.charAt(i) != "\n" && camera.charAt(i) != " ")) {
            auxiliarString += camera.charAt(i);
            numberTruth = true;
        } else if (i < camera.length -1 && numberTruth && (camera.charAt(i) == "\n" || camera.charAt(i) == " ")) {
            aux.push(auxiliarString);
            numberTruth = false;
        } else if (i < camera.length -1 && !numberTruth && (camera.charAt(i) != "\n" && camera.charAt(i) != " ")) {
            auxiliarString = camera.charAt(i);
            numberTruth = true;
        } else if (i < camera.length -1 && !numberTruth && (camera.charAt(i) == "\n" || camera.charAt(i) == " ")) {
            numberTruth = false;
        }
    }
    camera = aux;
    focusPoint = {x:parseFloat(camera[0]),y:parseFloat(camera[1]),z:parseFloat(camera[2])};
    verticalVector = {x:parseFloat(camera[6]),y:parseFloat(camera[7]),z:parseFloat(camera[8])};
    aimVector = {x:parseFloat(camera[3]),y:parseFloat(camera[4]),z:parseFloat(camera[5])};
    distanceD = parseFloat(camera[9]);
    halfWidth = parseFloat(camera[10]);
    halfHeight = parseFloat(camera[11]);
    horizontalCanvas = Math.ceil((verticalCanvas/(halfHeight*2))*(halfWidth*2));
    resizeCanvas(horizontalCanvas,verticalCanvas);
    verticalVector = ortogonalize(verticalVector,aimVector);
    horizontalVector = crossProductVector(aimVector,verticalVector);
    normalize(aimVector);
    normalize(verticalVector);
    normalize(horizontalVector);
    pointsToBe = [];
    trianglesToDisplay = [];
    aux = [];
    numberTruth = false;
    auxiliarString = undefined;
    for (let i = 0; i<object.length;i++) {
        if (i == object.length -1 && numberTruth && (object.charAt(i) != "\n" && object.charAt(i) != " ")) {
            auxiliarString += object.charAt(i);
            aux.push(auxiliarString);
            numberTruth = false;
            //ctx.fillText(auxiliarString,10,140 + (aux.length*20));
        } else if (i == object.length -1 && numberTruth && (object.charAt(i) == "\n" || object.charAt(i) == " ")) {
            aux.push(auxiliarString);
            numberTruth = false;
            //ctx.fillText(auxiliarString,10,140 + (aux.length*20));
        } else if (i == object.length -1 && !numberTruth && (object.charAt(i) != "\n" && object.charAt(i) != " ")) {
            auxiliarString = object.charAt(i);
            aux.push(auxiliarString);
            numberTruth = false;
            //ctx.fillText(auxiliarString,10,140 + (aux.length*20));
        } else if (i == object.length -1 && !numberTruth && (object.charAt(i) == "\n" || object.charAt(i) == " ")) {
            numberTruth = false;
        } else if (i < object.length -1 && numberTruth && (object.charAt(i) != "\n" && object.charAt(i) != " ")) {
            auxiliarString += object.charAt(i);
            numberTruth = true;
        } else if (i < object.length -1 && numberTruth && (object.charAt(i) == "\n" || object.charAt(i) == " ")) {
            aux.push(auxiliarString);
            numberTruth = false;
            //ctx.fillText(auxiliarString,10,140 + (aux.length*20));
        } else if (i < object.length -1 && !numberTruth && (object.charAt(i) != "\n" && object.charAt(i) != " ")) {
            auxiliarString = object.charAt(i);
            numberTruth = true;
        } else if (i < object.length -1 && !numberTruth && (object.charAt(i) == "\n" || object.charAt(i) == " ")) {
            numberTruth = false;
        }
    }
    object = aux;
    let points = parseFloat(object[0]);
    let triangles = parseFloat(object[1]);
    let initPoints = 2;
    let initTriangles = 2 + (points*3);
    let end = initTriangles + (triangles * 3);
    for (let i = initPoints; i < initTriangles; i+=3) {
        pointsToBe.push({x:parseFloat(object[i]),y:parseFloat(object[i+1]),z:parseFloat(object[i+2]),isInScreen:false});
    }
    for (let i = initTriangles; i < end; i+=3) {
        trianglesToDisplay.push({first:(parseFloat(object[i])-1),second:(parseFloat(object[i+1]))-1,third:(parseFloat(object[i+2])-1),distance:0,isInScreen:true});
    }
    let z =0;
    let y = 0;
    let x = 0;
    for (let i = 0; i < pointsToBe.length; i++) {
        z = sizeZbyVector(pointsToBe[i]);
        y = sizeYbyVector(pointsToBe[i]);
        x = sizeXbyVector(pointsToBe[i]);
        pointsToBe[i].x = x;
        pointsToBe[i].y = y;
        pointsToBe[i].z = z;
    }
    //isInsideScreen();
    //isTriangleInScreen();
    distanceTriangleOrigin();
    flatToScreenPoint();
    drawTriangles();
};

let object = undefined;
let camera = undefined;
let distanceD = undefined;
let halfWidth = 16;
let halfHeight = 9;
let focusPoint = undefined;
let aimVector = undefined;
let verticalVector = undefined;
let horizontalVector = undefined;
let pointsToBe = [];
let trianglesToDisplay = [];
let verticalCanvas = 640;
let horizontalCanvas = Math.ceil((verticalCanvas/(halfHeight*2))*(halfWidth*2));
resizeCanvas(horizontalCanvas,verticalCanvas);