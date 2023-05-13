var Typer = {
    hostname: 'binsky.org',
    username: 'root',
    enableBottomScrollingDuringInitialAnimation: false,
    tmp_usercommand: "",                // usercommand on time of writing before pressing enter
    cursorChars: '<span id="blinkingcursor" style="display: inline;">|</span>',
    cursorCharsHidden: '<span id="blinkingcursor" style="display: none;">|</span>',
    usercommands: [''],
    usercommandCurrentSelectionPosition: 0,
    userontyping: 0,
    text: null,
    accessCountimer: null,
    index: 0,                           // current cursor position
    speed: 2,                           // speed of the Typer
    file: "",                           // file, must be setted
    accessCount: 0,                     // times alt is pressed for Access Granted
    deniedCount: 0,                     // times caps is pressed for Access Denied

    init: function () {                   // initialize Hacker Typer
        Typer.accessCountimer = setInterval(function () {
            Typer.updLstChr();
        }, 500);  // inizialize timer for blinking cursor
        $.get(Typer.file, function (data) {  // get the text file
            Typer.text = data;          // save the textfile in Typer.text
            Typer.text = Typer.text.slice(0, Typer.text.length - 1);
        });
    },

    content: function () {
        return $("#console").html();    // get console content
    },

    write: function (str) {              // append to console content
        this.removeCursor();
        $("#console").append(str);
        return false;
    },

    removeCursor: function (hideOnly = false) {
        let cont = this.content();      // get console
        if (hideOnly) {
            if (cont.substring(cont.length - this.cursorChars.length, cont.length) === this.cursorChars) {   // if last characters are the online cursor
                $("#blinkingcursor").css("display", "none");
                return true;
            }
        } else {
            if (cont.substring(cont.length - this.cursorChars.length, cont.length) === this.cursorChars) {   // if last characters are the online cursor
                $("#console").html($("#console").html().substring(0, cont.length - this.cursorChars.length)); // remove it
                return true;
            } else if (cont.substring(cont.length - this.cursorCharsHidden.length, cont.length) === this.cursorCharsHidden) {   // if last characters are the offline cursor
                $("#console").html($("#console").html().substring(0, cont.length - this.cursorCharsHidden.length)); // remove it
                return true;
            }
        }
        return false;
    },

    addCursor: function () {
        let cont = this.content();      // get console
        if (cont.substring(cont.length - this.cursorCharsHidden.length, cont.length) === this.cursorCharsHidden) {   // if last characters are the cursor
            $("#blinkingcursor").css("display", "inline");
        } else if (cont.substring(cont.length - this.cursorChars.length, cont.length) !== this.cursorChars) {
            this.write(this.cursorChars);
        }
    },

    makeAccess: function () {            //create Access Granted popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
        Typer.hidepop();                // hide all popups
        Typer.accessCount = 0;          //reset count
        let ddiv = $("<div id='gran'>").html(""); // create new blank div and id "gran"
        ddiv.addClass("accessGranted"); // add class to the div
        ddiv.html("<h1>ACCESS GRANTED</h1>"); // set content of div
        $(document.body).prepend(ddiv); // prepend div to body
        return false;
    },

    makeDenied: function () {            //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
        Typer.hidepop();                // hide all popups
        Typer.deniedCount = 0;          //reset count
        let ddiv = $("<div id='deni'>").html("");   // create new blank div and id "deni"
        ddiv.addClass("accessDenied");  // add class to the div
        ddiv.html("<h1>ACCESS DENIED</h1>"); // set content of div
        $(document.body).prepend(ddiv); // prepend div to body
        return false;
    },

    hidepop: function () {               // remove all existing popups
        $("#deni").remove();
        $("#gran").remove();
    },

    addText: function (key) {            //Main function to add the code
        if (key.keyCode === 18) {          // key 18 = alt key
            Typer.accessCount++;        //increase counter
            if (Typer.accessCount >= 3) { // if it's presed 3 times
                Typer.makeAccess();     // make access popup
            }
        } else if (key.keyCode === 20) {  // key 20 = caps lock
            Typer.deniedCount++;        // increase counter
            if (Typer.deniedCount >= 3) { // if it's pressed 3 times
                Typer.makeDenied();     // make denied popup
            }
        } else if (key.keyCode === 27) {  // key 27 = esc key
            Typer.hidepop();            // hide all popups
        } else if (Typer.text) {         // otherway if text is loaded
            this.removeCursor();

            if (key.keyCode !== 8) {       // if key is not backspace
                Typer.index += Typer.speed; // add to the index the speed
            } else {
                if (Typer.index > 0)     // else if index is not less than 0
                    Typer.index -= Typer.speed; // remove speed for deleting text
            }
            let text = Typer.text.substring(0, Typer.index) // parse the text for stripping html enities
            const rtn = new RegExp("\n", "g");  // newline regex

            $("#console").html(text.replace(rtn, "<br/>"));// replace newline chars with br, tabs with 4 space and blanks with an html blank
            if (Typer.enableBottomScrollingDuringInitialAnimation) {
                window.scrollBy(0, 50); // scroll to make sure bottom is always visible
            }
        }
        if (key.preventDefault && key.keyCode !== 122) { // prevent F11(fullscreen) from being blocked
            key.preventDefault();
        }
        if (key.keyCode !== 122) { // otherway prevent keys default behavior
            key.returnValue = false;
        }
    },

    updLstChr: function () {             // blinking cursor
        if (!this.removeCursor(true)) {       // if last char is not the cursor
            if (Typer.userontyping === 0) {   //stop cursor writing while user is typing
                this.addCursor();           // else write it
                //console.log(Typer.userontyping);
            } else {
                //console.log(Typer.userontyping);
                Typer.userontyping = 0;
            }
        }
    }
}

function consoleOnKeyPressCallback(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    //console.log(e.keyCode);
    if (charCode) {
        Typer.userontyping = 1;
        Typer.write((String.fromCharCode(charCode)).replace("|", ""));
        Typer.tmp_usercommand += (String.fromCharCode(charCode)).replace("|", "");
    }
}

function consoleOnKeyDownCallback(e) {
    e = e || window.event;
    //console.log(e.keyCode);
    //console.log(Typer.usercommands);

    Typer.removeCursor();
    Typer.userontyping = 1;
    let cont = Typer.content(); // get console

    if (e.keyCode === 37 || e.keyCode === 8) {  //arrow left
        $("#console").html(cont.substring(0, cont.length - 1)); // remove last char
        Typer.tmp_usercommand = Typer.tmp_usercommand.substring(0, Typer.tmp_usercommand.length - 1);
    }
    if (e.keyCode === 38) {  //arrow up
        if (Typer.usercommandCurrentSelectionPosition === 0) {
            if (Typer.usercommands[Typer.usercommandCurrentSelectionPosition] !== Typer.tmp_usercommand) {
                Typer.usercommands.unshift(Typer.tmp_usercommand);
            }
            Typer.tmp_usercommand = "";
        }

        if (Typer.usercommandCurrentSelectionPosition < Typer.usercommands.length - 1) {
            Typer.usercommandCurrentSelectionPosition += 1;

            //console.log("cut off: " + cont.substring(cont.length - Typer.tmp_usercommand.length));
            cont = cont.substring(0, cont.length - Typer.tmp_usercommand.length);

            // load and show next usercommand from history
            $("#console").html(cont + Typer.usercommands[Typer.usercommandCurrentSelectionPosition]);
            Typer.tmp_usercommand = Typer.usercommands[Typer.usercommandCurrentSelectionPosition];
            //Typer.usercommandCurrentSelectionPosition += 1;
        }
    }
    if (e.keyCode === 40 && Typer.usercommandCurrentSelectionPosition > 0) {  //arrow down
        cont = cont.substring(0, cont.length - Typer.tmp_usercommand.length); // remove tmp_usercommand (clear history input from line)

        Typer.usercommandCurrentSelectionPosition -= 1;
        Typer.tmp_usercommand = Typer.usercommands[Typer.usercommandCurrentSelectionPosition];
        $("#console").html(cont + Typer.tmp_usercommand);
    }
    if (e.keyCode === 13) {  //enter

        if (Typer.tmp_usercommand.includes("hostname") && Typer.tmp_usercommand.length >= 10) {
            Typer.hostname = Typer.tmp_usercommand.substring(9).trim();
        }
        if (Typer.tmp_usercommand.includes("username") && Typer.tmp_usercommand.length >= 10) {
            Typer.username = Typer.tmp_usercommand.substring(9).trim();
        }

        $("#console").html(cont + '<br/><span id="a">' + Typer.username + '@' + Typer.hostname + '</span>:<span id="b">~</span><span id="c">$</span>');   // add new line for next user command input

        if (Typer.tmp_usercommand.includes("help") && Typer.tmp_usercommand.length <= 6) {
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

            $("#console").html(cont + help + '<span id="a">' + Typer.username + '@' + Typer.hostname + '</span>:<span id="b">~</span><span id="c">$</span>');
            /*setTimeout(function(){
                var e = jQuery.Event("keypress");
                e.which = 13; //choose the one you want
                e.keyCode = 13;
                $("#console").trigger(e);
            }, 500);*/
        }
        if (Typer.tmp_usercommand.includes("reboot") && Typer.tmp_usercommand.length <= 8) {
            location.reload();
        }
        if (Typer.tmp_usercommand.includes("start") && Typer.tmp_usercommand.length <= 7) {
            if (!isVideoPlaying()) playVid();
        }
        if (Typer.tmp_usercommand.includes("pause") && Typer.tmp_usercommand.length <= 7) {
            pauseVid();
        }
        if (Typer.tmp_usercommand.includes("clear") && Typer.tmp_usercommand.length <= 7) {
            $("#console").html('<span id="a">' + Typer.username + '@' + Typer.hostname + '</span>:<span id="b">~</span><span id="c">$</span>');
        }
        if (Typer.tmp_usercommand.includes("fullscreen") && Typer.tmp_usercommand.length <= 12) {
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
        if (Typer.tmp_usercommand.includes("goto") && Typer.tmp_usercommand.length > 6) {
            location.replace(Typer.tmp_usercommand.substring(5));
            console.log(Typer.tmp_usercommand.substring(5));
        }
        if (Typer.tmp_usercommand.includes("video1") && Typer.tmp_usercommand.length <= 8) {
            vid.pause()
            document.getElementById("vid_webm").src = "https://www.binsky.org/back-vid/fog-videoplayback.webm";
            document.getElementById("vid_mp4").src = "https://www.binsky.org/back-vid/fog-videoplayback.mp4";
            vid.load();
            vid.play();
        }
        if (Typer.tmp_usercommand.includes("video2") && Typer.tmp_usercommand.length <= 8) {
            vid.pause()
            document.getElementById("vid_webm").src = "https://binsky.org/back-vid/shiny-organe-background-animation.webm";
            document.getElementById("vid_mp4").src = "https://binsky.org/back-vid/shiny-organe-background-animation.mp4";
            vid.load();
            vid.play();
        }

        let clear = true;

        Typer.usercommandCurrentSelectionPosition = 0;
        if (Typer.tmp_usercommand !== '' && Typer.tmp_usercommand !== '\r' && Typer.tmp_usercommand !== '\n') {
            Typer.usercommands.unshift(Typer.tmp_usercommand);
        }
        if (clear) {
            Typer.tmp_usercommand = "";
        }
        scrollToBottom();
    }
}

function scrollToBottom() {
    $('html,body').animate({scrollTop: document.body.scrollHeight}, "fast");
}

export {
    Typer,
    consoleOnKeyPressCallback,
    consoleOnKeyDownCallback
}
