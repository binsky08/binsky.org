/* Copyright (c) 2020 All Rights Reserved
 * Author: Timo Triebensky
 * Project: binsky.org Website Animation
 */

import {consoleOnKeyDownCallback, consoleOnKeyPressCallback, Typer} from './js/console.js';

///// title explosion intro

let title = 'binsky.org';
let titleColourCode = '#fe5000';
let titleStartColouredLettersAtPosition = 7;
let spanAnimationSeconds = 0.1;
let secondsWaitBeforeExplode = 0;
let CSSAnimationSeconds = 3;

function startTitleAnimation() {
    for (let i = 0; i < title.length; i++) {
        let titleH1 = document.getElementById('titleH1');
        titleH1.innerHTML += '<span>' + title[i] + '</span>';
    }
    for (let i = 0; i < title.length; i++) {
        let styleblock = document.getElementById('explosionStyleBlock');

        let newstyle = 'opacity: 0; animation-delay: ' + ((i + 1) * spanAnimationSeconds) + 's;';
        if (i >= (titleStartColouredLettersAtPosition - 1)) {
            newstyle += ' color: ' + titleColourCode + ';';
        }

        styleblock.innerHTML = styleblock.innerHTML + '#titleH1 span:nth-child(' + (i + 1) + '){ ' + newstyle + ' }';
    }
}

document.fonts.ready.then((fontFaceSet) => {
    setTimeout(startTitleAnimation, 1200);
});


function setPageContent() {
    document.getElementById('titleAnimationSection').style.display = 'none';
    document.getElementById('body').style.paddingTop = '40px';
    document.getElementById('body').style.display = 'block';
    document.getElementById('logo').style.display = 'block';

    document.getElementById('console-legend').addEventListener('click', () => {
        document.getElementById('console').style.display = 'block';
        document.getElementById('projects').style.display = 'none';
    });
    document.getElementById('projects-legend').addEventListener('click', () => {
        document.getElementById('console').style.display = 'none';
        document.getElementById('projects').style.display = 'block';
    });
    startPageContentLoading();
}

setTimeout(setPageContent, ((spanAnimationSeconds * title.length) + secondsWaitBeforeExplode + CSSAnimationSeconds) * 1000 + 1200);

/////


///// background video control
/*
var vid = document.getElementById("bgvid"); 
var now = new Date();
var outtime = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 365));

function playVid() { 
    vid.play();
    document.getElementById("button_startvid").style.display="none";
    document.getElementById("button_stopvid").style.display="block";
    document.cookie = "bgvidcc=play; expires=" + outtime.toGMTString() + ";";
} 

function pauseVid() { 
    vid.pause();
    document.getElementById("button_startvid").style.display="block";
    document.getElementById("button_stopvid").style.display="none";
    document.cookie = "bgvidcc=stop; expires=" + outtime.toGMTString() + ";";
}

function isVideoPlaying() {
    if(document.getElementById("button_startvid").style.display == "none") return true;
    return false;
}
*/
/////


///// automatically building website start animation

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function widthAnimator(id, innerId, start, end, step, sleepMSeconds, afterFunction) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.width = start + "%";
        document.getElementById(innerId).style.display = "none";
        document.getElementById(id).style.display = "block";
        for (var i = start; i <= end; i += step) {
            document.getElementById(id).style.width = i + "%";
            await Sleep(sleepMSeconds);
            if (i == 100) {
                document.getElementById(innerId).style.display = "block";
            }
        }
    }
    //document.getElementById(id).style.width = end+"%";
    afterFunction();
}

async function heightPxAnimator(id, start, end, step, sleepMSeconds, afterFunction) {
    document.getElementById(id).style.height = start + "px";
    for (var i = start; i <= end; i += step) {
        document.getElementById(id).style.height = i + "px";
        await Sleep(sleepMSeconds);
    }
    //document.getElementById(id).style.width = end+"%";
    afterFunction();
}

async function paddingAnimator(id, start, end, step, sleepMSeconds, afterFunction) {
    document.getElementById(id).style.padding = start + "px";
    document.getElementById(id).style.display = "block";
    for (var i = start; i <= end; i += step) {
        document.getElementById(id).style.padding = i + "px";
        await Sleep(sleepMSeconds);
    }
    afterFunction();
}

var timer = null;

function t(Typer) {
    Typer.addText({"keyCode": 123748});
    if (Typer.text && Typer.index > Typer.text.length) {
        clearInterval(timer);
    }
}

function startPageContentLoading() {
    widthAnimator("panel-default", "panel-heading", 0, 100, 1, 7, function () {
    });
    document.getElementById("panel-heading").style.padding = "0px";
    document.getElementById("panel-heading").style.height = "0px";
    //widthAnimator("navigation", "rightnavcontents", 0, 100, 1, 7, function(){ heightPxAnimator("panel-heading", 20, 44, 1, 10, function(){ paddingAnimator("panel-heading", 0, 10, 1, 10); }); });
    widthAnimator("navigation", "rightnavcontents", 0, 100, 1, 7, function () {
        paddingAnimator("panel-heading", 0, 10, 1, 13, function () {
            heightPxAnimator("panel-heading", 20, 44, 1, 13, function () {
            });
        });
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 8) e.preventDefault();
    });

    timer = setInterval(function () {
        t(Typer);
    }, 30);
}

/////


///// typer animation

Typer.speed = 2;
Typer.file = "console.html";
Typer.init();

document.onkeypress = consoleOnKeyPressCallback;
document.onkeydown = consoleOnKeyDownCallback;

/////
