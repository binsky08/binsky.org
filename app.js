/* Copyright (c) 2020 All Rights Reserved
 * Author: Timo Triebensky
 * Project: binsky.org Website Animation
 */

///// title explosion intro

let title = 'binsky.org';
let titleColourCode = '#fe5000';
let titleStartColouredLettersAtPosition = 7;
let spanAnimationSeconds = 0.1;
let secondsWaitBeforeExplode = 0;
let CSSAnimationSeconds = 3;
    
function startTitleAnimation() {
    for(let i=0; i<title.length; i++){
        let titleH1 = document.getElementById('titleH1');
        titleH1.innerHTML += '<span>' + title[i] + '</span>';
    }
    for(let i=0; i<title.length; i++){
        let styleblock = document.getElementById('explosionStyleBlock');
        
        let newstyle = 'opacity: 0; animation-delay: ' + ((i+1) * spanAnimationSeconds) + 's;';
        if(i >= (titleStartColouredLettersAtPosition-1)){
            newstyle += ' color: ' + titleColourCode + ';';
        }
        
        styleblock.innerHTML = styleblock.innerHTML + '#titleH1 span:nth-child(' + (i+1) + '){ ' + newstyle + ' }';
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
    startPageContentLoading();
}
setTimeout(setPageContent, ((spanAnimationSeconds*title.length)+secondsWaitBeforeExplode+CSSAnimationSeconds)*1000 + 1200);

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
    if(document.getElementById(id)){
        document.getElementById(id).style.width = start+"%";
        document.getElementById(innerId).style.display = "none";
        document.getElementById(id).style.display = "block";
        for(var i=start; i<=end; i+=step){
            document.getElementById(id).style.width = i+"%";
            await Sleep(sleepMSeconds);
            if(i == 100){
                document.getElementById(innerId).style.display = "block";
            }
        }
    }
    //document.getElementById(id).style.width = end+"%";
    afterFunction();
}
async function heightPxAnimator(id, start, end, step, sleepMSeconds, afterFunction) {
    document.getElementById(id).style.height = start+"px";
    for(var i=start; i<=end; i+=step){
        document.getElementById(id).style.height = i+"px";
        await Sleep(sleepMSeconds);
    }
    //document.getElementById(id).style.width = end+"%";
    afterFunction();
}
async function paddingAnimator(id, start, end, step, sleepMSeconds, afterFunction) {
    document.getElementById(id).style.padding = start+"px";
    document.getElementById(id).style.display = "block";
    for(var i=start; i<=end; i+=step){
        document.getElementById(id).style.padding = i+"px";
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
    widthAnimator("panel-default", "panel-heading", 0, 100, 1, 7, function(){});
    document.getElementById("panel-heading").style.padding = "0px";
    document.getElementById("panel-heading").style.height = "0px";
    //widthAnimator("navigation", "rightnavcontents", 0, 100, 1, 7, function(){ heightPxAnimator("panel-heading", 20, 44, 1, 10, function(){ paddingAnimator("panel-heading", 0, 10, 1, 10); }); });
    widthAnimator("navigation", "rightnavcontents", 0, 100, 1, 7, function(){ paddingAnimator("panel-heading", 0, 10, 1, 13, function(){ heightPxAnimator("panel-heading", 20, 44, 1, 13, function(){}); }); });
    
    $(document).keydown(function(e) { if (e.keyCode == 8) e.preventDefault(); });
    
    timer = setInterval("t(Typer);", 30);
}

/////


///// basic implementation of a email registration form

var enableEmailRegistration = false;
var maildialogStarted = false;
var backend = "mailregister.php";

var MailReg={
    invitationCode:"",
    user:"",
    currentMail:"",
    checkInvitation: function(callback) {
    
        let obj = {
            "invitationCode": MailReg.invitationCode
        };
        
        MailReg.postData(backend, obj, function(res){
            callback((res == "true"));
        });
        
    },
    checkUserPrefix: function(callback) {
        let obj = {
            "invitationCode": MailReg.invitationCode,
            "user": MailReg.user,
            "checkPrefix": true
        };
        
        MailReg.postData(backend, obj, function(res){
            callback((res == "true"));
        });
    },
    doRegistration: function(callback) {
        
        let obj = {
            "invitationCode": MailReg.invitationCode,
            "user": MailReg.user,
            "currentMail": MailReg.currentMail,
            "doRegistration": true
        };
        
        MailReg.postData(backend, obj, function(res){
            callback(res);
        });
        
    },
    postData: function(url, obj, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4) {    //ready
                //console.log(xhr.responseText.trim());
                callback(xhr.responseText.trim());
            }
        }
        let stringToSend = "";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)){
                //console.log("key: " + key + " value: " + obj[key]);
                stringToSend += key + "=" + obj[key] + "&";
            }
        }
        xhr.send(stringToSend.slice(0, -1));
    }
}

/////


///// typer animation

var Typer = {
    nup: 0,
    setted_tmp: 0,
    hostname: 'binsky.org',
    username: 'root',
    tmp_usercommand: "",
    usercommands: [''],
    usercommandnumber: 0,
    userontyping: 0,
    text: null,
    accessCountimer: null,
    index: 0,                           // current cursor position
    speed: 2,                           // speed of the Typer
    file: "",                           // file, must be setted
    accessCount: 0,                     // times alt is pressed for Access Granted
    deniedCount: 0,                     // times caps is pressed for Access Denied
    init: function(){                   // inizialize Hacker Typer
        accessCountimer = setInterval(function() { Typer.updLstChr(); }, 500);  // inizialize timer for blinking cursor
        $.get(Typer.file, function(data) {  // get the text file
            Typer.text = data;          // save the textfile in Typer.text
            Typer.text = Typer.text.slice(0, Typer.text.length - 1);
        });
    },

    content: function() {
        return $("#console").html();    // get console content
    },

    write: function(str) {              // append to console content
        let cont = this.content();      // get console
        if(cont.substring(cont.length - 1, cont.length) == "|") {   // if last char is the cursor
            $("#console").html($("#console").html().substring(0, cont.length - 1)); // remove it
        }
        $("#console").append(str);
        return false;
    },

    makeAccess: function() {            //create Access Granted popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
        Typer.hidepop();                // hide all popups
        Typer.accessCount = 0;          //reset count
        let ddiv = $("<div id='gran'>").html(""); // create new blank div and id "gran"
        ddiv.addClass("accessGranted"); // add class to the div
        ddiv.html("<h1>ACCESS GRANTED</h1>"); // set content of div
        $(document.body).prepend(ddiv); // prepend div to body
        return false;
    },
    
    makeDenied: function() {            //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
        Typer.hidepop();                // hide all popups
        Typer.deniedCount = 0;          //reset count
        let ddiv = $("<div id='deni'>").html("");   // create new blank div and id "deni"
        ddiv.addClass("accessDenied");  // add class to the div
        ddiv.html("<h1>ACCESS DENIED</h1>"); // set content of div
        $(document.body).prepend(ddiv); // prepend div to body
        return false;
    },

    hidepop: function() {               // remove all existing popups
        $("#deni").remove();
        $("#gran").remove();
    },

    addText: function(key) {            //Main function to add the code
        if(key.keyCode == 18){          // key 18 = alt key
            Typer.accessCount++;        //increase counter 
            if(Typer.accessCount >= 3){ // if it's presed 3 times
                Typer.makeAccess();     // make access popup
            }
        } else if(key.keyCode == 20) {  // key 20 = caps lock
            Typer.deniedCount++;        // increase counter
            if(Typer.deniedCount >= 3) { // if it's pressed 3 times
                Typer.makeDenied();     // make denied popup
            }
        } else if(key.keyCode == 27) {  // key 27 = esc key
            Typer.hidepop();            // hide all popups
        } else if(Typer.text) {         // otherway if text is loaded
            let cont = Typer.content(); // get the console content
            if(cont.substring(cont.length - 1, cont.length) == "|") // if the last char is the blinking cursor
                $("#console").html($("#console").html().substring(0, cont.length - 1)); // remove it before adding the text
            if(key.keyCode != 8){       // if key is not backspace
                Typer.index += Typer.speed; // add to the index the speed
            } else {
                if(Typer.index > 0)     // else if index is not less than 0 
                    Typer.index -= Typer.speed; // remove speed for deleting text
            }
            let text = Typer.text.substring(0, Typer.index) // parse the text for stripping html enities
            const rtn = new RegExp("\n", "g");  // newline regex
    
            $("#console").html(text.replace(rtn, "<br/>"));// replace newline chars with br, tabs with 4 space and blanks with an html blank
            window.scrollBy(0, 50); // scroll to make sure bottom is always visible
        }
        if (key.preventDefault && key.keyCode != 122) { // prevent F11(fullscreen) from being blocked
            key.preventDefault()
        };  
        if(key.keyCode != 122){ // otherway prevent keys default behavior
            key.returnValue = false;
        }
    },

    updLstChr: function() {             // blinking cursor
        let cont = this.content();      // get console 
        if(cont.substring(cont.length - 1, cont.length) == "|"){    // if last char is the cursor
            $("#console").html($("#console").html().substring(0, cont.length - 1)); // remove it
        } else {
            if(Typer.userontyping == 0) {   //stop cursor writing while user is typing
                this.write("|");        // else write it
                //console.log(Typer.userontyping);
            } else {
                //console.log(Typer.userontyping);
                Typer.userontyping = 0;
            }
        }
    }
}

function scrollToBottom() {
    $('html,body').animate({scrollTop: document.body.scrollHeight}, "fast");
}
    
function replaceUrls(text) {
    var http = text.indexOf("https://");
    var space = text.indexOf(".org", http);
    if (space != -1) { 
        var url = text.slice(http, space-1);
        return text.replace(url, "<a href=\""  + url + "\">" + url + "</a>");
    } else {
        return text;
    }
}

Typer.speed = 2;
Typer.file = "console.html";
Typer.init();

document.onkeypress = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    //console.log(e.keyCode);
    if (charCode) {
        Typer.userontyping = 1;
        Typer.write((String.fromCharCode(charCode)).replace("|", ""));
        Typer.tmp_usercommand += (String.fromCharCode(charCode)).replace("|", "");
    }
};

document.onkeydown = function(e) {
    e = e || window.event;
    //console.log(e.keyCode);
    let cont = Typer.content(); // get console 
    
    if(e.keyCode == 37 || e.keyCode == 8){  //arrow left
        if(cont.substring(cont.length-1, cont.length) == "|"){   // if last char is the cursor
            $("#console").html($("#console").html().substring(0, cont.length - 2)); // remove it
        } else {
            $("#console").html($("#console").html().substring(0, cont.length - 1)); // remove it
        }
        Typer.tmp_usercommand = Typer.tmp_usercommand.substring(0, Typer.tmp_usercommand.length - 1);
    }
    if(e.keyCode == 38) {  //arrow up
        let temp_tmp_usercommand = "";
        if(Typer.tmp_usercommand != "" && Typer.setted_tmp == 0) {
            temp_tmp_usercommand = Typer.tmp_usercommand;
        }
        
        if(Typer.nup < Typer.usercommands.length - 1) {
            //console.log(Typer.usercommands[Typer.nup][0]);
        
            if(cont.substring(cont.length-1,cont.length)=="|"){ // if last char is the cursor
                $("#console").html($("#console").html().substring(0,cont.length+1-Typer.tmp_usercommand.length-1)); // remove it
            } else {
                $("#console").html($("#console").html().substring(0,cont.length+1-Typer.tmp_usercommand.length)); // remove it
            }
            
            /*
            let tl = Typer.usercommands[Typer.nup][1];
            if(Typer.nup!=0){
                $("#console").html($("#console").html().substring(0,cont.length-Typer.tmp_usercommand.length)); // remove it
            } else {
                $("#console").html($("#console").html().substring(0,cont.length-Typer.tmp_usercommand.length)+Typer.usercommands[tl-1]); // remove it
            }
            Typer.tmp_usercommand=0;
            */
            
            $("#console").html($("#console").html() + Typer.usercommands[Typer.nup][0]);
            Typer.tmp_usercommand = Typer.usercommands[Typer.nup][0];
            Typer.nup = Typer.nup + 1;
        }
        if(temp_tmp_usercommand != "") {
            let ua = new Array();
            ua.push(temp_tmp_usercommand);
            ua.push(temp_tmp_usercommand.length);
            Typer.usercommands.unshift(ua);
            //Typer.tmp_usercommand = "";
            Typer.usercommandnumber = Typer.usercommandnumber + 1;
            Typer.nup = Typer.nup + 1;
            Typer.setted_tmp = 1;
        }
    }
    if(e.keyCode == 40 && Typer.nup > 1) {  //arrow down
        let tc = 0;
        if(Typer.setted_tmp == 1 && Typer.nup == 1) {
            Typer.nup = Typer.nup + 1;
            //console.log("---setted");
            tc = 1;
            //Typer.setted_tmp = 0;
        }
        Typer.nup = Typer.nup - 1;
        
        //console.log(Typer.usercommands[Typer.nup-1][0]);
            
        if(cont.substring(cont.length - 1, cont.length) == "|") { // if last char is the cursor
            $("#console").html($("#console").html().substring(0,cont.length-1+tc-Typer.usercommands[Typer.nup][1]-1)); // remove it
        } else {
            $("#console").html($("#console").html().substring(0,cont.length-1+tc-Typer.usercommands[Typer.nup][1])); // remove it
        }
        cont = Typer.content();
            
        $("#console").html($("#console").html() + Typer.usercommands[Typer.nup-1][0]);
        
        
        if(Typer.setted_tmp == 1) {
            Typer.setted_tmp = 0;
            //Typer.nup=Typer.nup-1;
        }
        
        /*
        if(Typer.nup  >1) {
            if(Typer.nup <= -1) Typer.nup = -1;
            if((Typer.nup) != tl) Typer.nup = Typer.nup -1;
            var tl = Typer.usercommands.length;
            console.log(Typer.usercommandnumber);
            console.log(tl);
            console.log(Typer.usercommands[tl-Typer.nup-1]);
            console.log(Typer.nup);
            console.log(Typer.usercommands[tl-Typer.nup]);
            if((Typer.nup + 1) == tl){
                $("#console").html($("#console").html().substring(0,cont.length-Typer.usercommands[tl-Typer.nup-1].length)+Typer.usercommands[tl-Typer.nup]); // remove it
            }
            else $("#console").html($("#console").html().substring(0,cont.length-Typer.usercommands[tl-Typer.nup-1].length)+Typer.usercommands[tl-Typer.nup]); // remove it
            
            Typer.tmp_usercommand=0;
            
            
            $("#console").html($("#console").html()+Typer.usercommands[Typer.usercommandnumber-Typer.nup]); // remove it
         }.then()
         else{
             console.log(Typer.nup);
             console.log(Typer.usercommands[Typer.usercommandnumber].length);
             $("#console").html($("#console").html().substring(0,cont.length-Typer.usercommands[Typer.nup].length)); // remove it
             Typer.nup = 0;
         }
         */
    }
    if(e.keyCode == 13) {  //enter
        if(cont.substring(cont.length - 1, cont.length) == "|") { // if last char is the cursor
            $("#console").html($("#console").html().substring(0,cont.length-1)+'<br/><span id="a">'+Typer.username+'@'+Typer.hostname+'</span>:<span id="b">~</span><span id="c">$</span>'); // remove it
        } else {
            $("#console").html($("#console").html()+'<br/><span id="a">'+Typer.username+'@'+Typer.hostname+'</span>:<span id="b">~</span><span id="c">$</span>'); // remove it
        }
        let ua = new Array();
        let clear = true;
        
        if(Typer.tmp_usercommand.includes("help") && Typer.tmp_usercommand.length <= 6){
            let help = " Available commands:<br>";
            help += "'reboot' - reload page<br>";
            //help += "'start' - start background video<br>";
            //help += "'pause' - pause background video<br>";
            help += "'clear' - clear console<br>";
            help += "'fullscreen' - open virtual console in fullscreen<br>";
            help += "'goto' - website redirection<br>";
            help += "'username' - replace virtual console username<br>";
            help += "'hostname' - replace virtual console hostname<br>";
            //help += "'video1' - set background video 1<br>";
            //help += "'video2' - set background video 2<br>";
            
            $("#console").html($("#console").html()+help+'<span id="a">'+Typer.username+'@'+Typer.hostname+'</span>:<span id="b">~</span><span id="c">$</span>');
            /*setTimeout(function(){
                var e = jQuery.Event("keypress");
                e.which = 13; //choose the one you want
                e.keyCode = 13;
                $("#console").trigger(e);
            }, 500);*/
        }
        if(Typer.tmp_usercommand.includes("reboot") && Typer.tmp_usercommand.length <= 8) {
            location.reload();
        }
        if(Typer.tmp_usercommand.includes("start") && Typer.tmp_usercommand.length <= 7) {
            if(!isVideoPlaying()) playVid();
        }
        if(Typer.tmp_usercommand.includes("pause") && Typer.tmp_usercommand.length <= 7) {
            pauseVid();
        }
        if(Typer.tmp_usercommand.includes("clear") && Typer.tmp_usercommand.length <= 7) {
            $("#console").html('<span id="a">'+Typer.username+'@'+Typer.hostname+'</span>:<span id="b">~</span><span id="c">$</span>');
        }
        if(Typer.tmp_usercommand.includes("hostname") && Typer.tmp_usercommand.length >= 10) {
            Typer.hostname = Typer.tmp_usercommand.substring(9).trim();
        }
        if(Typer.tmp_usercommand.includes("username") && Typer.tmp_usercommand.length >= 10) {
            Typer.username = Typer.tmp_usercommand.substring(9).trim();
        }
        if(Typer.tmp_usercommand.includes("fullscreen") && Typer.tmp_usercommand.length <= 12) {
            var elem = document.getElementById("console");
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
              elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            }
        }
        if(Typer.tmp_usercommand.includes("goto") && Typer.tmp_usercommand.length > 6) {
            location.replace(Typer.tmp_usercommand.substring(5));
            console.log(Typer.tmp_usercommand.substring(5));
        }
        if(Typer.tmp_usercommand.includes("video1") && Typer.tmp_usercommand.length <= 8) {
            vid.pause()
            document.getElementById("vid_webm").src = "https://www.binsky.org/back-vid/fog-videoplayback.webm";
            document.getElementById("vid_mp4").src = "https://www.binsky.org/back-vid/fog-videoplayback.mp4";
            vid.load();
            vid.play();
        }
        if(Typer.tmp_usercommand.includes("video2") && Typer.tmp_usercommand.length <= 8) {
            vid.pause()
            document.getElementById("vid_webm").src = "https://binsky.org/back-vid/shiny-organe-background-animation.webm";
            document.getElementById("vid_mp4").src = "https://binsky.org/back-vid/shiny-organe-background-animation.mp4";
            vid.load();
            vid.play();
        }
        
        ///// basic implementation of a email registration form
        /*
        if(Typer.tmp_usercommand.includes("email") && Typer.tmp_usercommand.length <= 7 && enableEmailRegistration){
            $("#console").html($("#console").html()+" Enter your invitation code: ");
            Typer.tmp_usercommand=" Enter your invitation code: ";
            maildialogStarted=true;
            clear=false;
        }
        if(Typer.tmp_usercommand.includes("Enter your invitation code:") && maildialogStarted && clear){
            let n = Typer.tmp_usercommand.lastIndexOf(':');
            let invitationcode = Typer.tmp_usercommand.substring(n + 1).trim();
            MailReg.invitationCode = invitationcode;
            
            MailReg.checkInvitation(function(res) {
                if(res){
                    $("#console").html($("#console").html()+" Enter your desired mail prefix (eg. xd for xd@binsky.org): ");
                    Typer.tmp_usercommand=" Enter your desired mail prefix (eg. xd for xd@binsky.org): ";
                    clear=false;
                } else {
                    $("#console").html($("#console").html()+" <font color='red'>Wrong code, registration cancelled!</font> <br>");
                    maildialogStarted=false;
                }
            });
        }
        if(Typer.tmp_usercommand.includes("Enter your desired mail prefix") && maildialogStarted && clear){
            let n = Typer.tmp_usercommand.lastIndexOf(':');
            let userprefix = Typer.tmp_usercommand.substring(n + 1).trim();
            MailReg.user = userprefix;
            
            MailReg.checkUserPrefix(function(res) {
                if(res){
                    $("#console").html($("#console").html()+" To confirm, please enter your current mail: ");
                    Typer.tmp_usercommand=" To confirm, please enter your current mail: ";
                    clear=false;
                } else {
                    $("#console").html($("#console").html()+" Prefix already used, please use an other:<br>Enter your desired mail prefix (eg. xd for xd@binsky.org): ");
                    Typer.tmp_usercommand=" Prefix already used, please use an other:<br>Enter your desired mail prefix (eg. xd for xd@binsky.org): ";
                    MailReg.user = "";
                    clear=false;
                }
            });
            
        }
        if(Typer.tmp_usercommand.includes("To confirm, please enter your current mail:") && maildialogStarted && clear){
            let n = Typer.tmp_usercommand.lastIndexOf(':');
            let currentuseremail = Typer.tmp_usercommand.substring(n + 1).trim();
            MailReg.currentMail = currentuseremail;
            
            $("#console").html($("#console").html()+" ... one moment please ...");
            
            MailReg.doRegistration(function(res) {
                if(res.includes("successfully")){
                    $("#console").html($("#console").html()+"<br><font color='green'><b>Thank you for your registration</b></font><br> Please check your mailbox (including spam folder)<br><br> see you ...  ;)<br>");
                    scrollToBottom();
                } else {
                    $("#console").html($("#console").html()+res+"<br>");
                    scrollToBottom();
                }
                maildialogStarted=false;
                if(cont.substring(cont.length-1,cont.length)=="|") // if last char is the cursor
                    $("#console").html($("#console").html().substring(0,cont.length-1)+'<br/><span id="a">'+Typer.username+'@'+Typer.hostname+'</span>:<span id="b">~</span><span id="c">$</span>'); // remove it
                else
                    $("#console").html($("#console").html()+'<br/><span id="a">'+Typer.username+'@'+Typer.hostname+'</span>:<span id="b">~</span><span id="c">$</span>'); // remove it
            });
        }
        */
        /////
        
        ua.push(Typer.tmp_usercommand);
        ua.push(Typer.tmp_usercommand.length);
        Typer.usercommands.unshift(ua);
        if(clear) {
            Typer.tmp_usercommand = "";
        }
        Typer.usercommandnumber = Typer.usercommandnumber + 1;
        scrollToBottom();
    }
};
