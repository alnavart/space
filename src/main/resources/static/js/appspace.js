var appspace = {
    comms : {
        stompClient: null,
        connected: false,

        connect: function(rcvMessage, rcvEvent, email) {
            var socket = new SockJS('/message');
            appspace.comms.stompClient = Stomp.over(socket);
            appspace.comms.stompClient.connect({'X-Email':email}, function(frame) {
                console.log('Connected: ' + frame);
                appspace.comms.stompClient.subscribe('/topic/chat', rcvMessage, {});
                appspace.comms.stompClient.subscribe('/topic/events', rcvEvent, {});
                appspace.comms.getAllParticipants();
                appspace.comms.getAllSpacecrafts();
                appspace.comms.connected = true;
            }, function(error){
                appspace.gui.connectionError(error);
                console.log('Error while connect: ' + error);
            });
        },

        disconnect: function() {
            if (appspace.comms.stompClient != null) {
                appspace.comms.stompClient.disconnect();
                appspace.comms.connected = false;
                console.log("Disconnected");
            }
        },

        sendMessage: function(email, text) {
            appspace.comms.stompClient.send("/app/message", {}, JSON.stringify({'text': text, 'email': email }));
            console.log('Send message from email' + email + ' with text' + text);
        },

        getAllParticipants: function () {
            $.getJSON("participants", function (data) {
                console.log('COMMS participants: ' + data);
                if(appspace.comms.connected == true)
                {
                    appspace.gui.showAllParticipants(data);
                }
            })
                .done(function () {
                    console.log("All participants done");
                })
                .fail(function () {
                    console.log("All participants error");
                })
                .always(function () {
                    console.log("All participants complete");
                })
        },

        getAllSpacecrafts: function () {
            $.getJSON("all-spacecrafts", function (data) {
                console.log('COMMS all-spacecrafts: ' + data);
                if(appspace.comms.connected == true)
                {
                    appspace.gui.showAllSpacecrafts(data);
                }
            })
                .done(function () {
                    console.log("All spacecrafts done");
                })
                .fail(function () {
                    console.log("All spacecrafts error");
                })
                .always(function () {
                    console.log("All spacecrafts complete");
                })
        }
    },
    ////////////////////////////// GUI ///////////////////////////////////////////
    gui : {
        email: "",
        login: function(){
            appspace.gui.email = $("#email").val();
            var gravatar = appspace.gui.getGravatar(appspace.gui.email);
            $("#login").hide();
            $("#application").show();
            $("#avatar").attr('src', gravatar);
            appspace.comms.connect(appspace.gui.receiveMessage, appspace.gui.receiveEvent, appspace.gui.email)
            console.log('GUI: login complete');
        },

        connectionError: function (error) {
            appspace.gui.exit();
            if (error.headers.message.indexOf('IllegalArgumentException')  != -1) {
                alert("No permission! Check your email address and try again");
            } else {
                alert("Unexpected error while try to connect");
            }
        },

        exit: function(){
            appspace.comms.disconnect();
            $("#participants").empty();
            $("#history").empty();
            $("#spacecrafts").empty();
            $("#application").hide();
            $("#login").show();
            console.log('Exit: looking to the floor.');
        },

        receiveMessage: function(message) {
            var jsonMsg = JSON.parse(message.body);
            appspace.gui.showMessage(jsonMsg.email, jsonMsg.text);
            console.log('GUI: receive message' + message);
        },

        sendMessage: function(){
            var text = $("#text").val();
            $("#text").val("");
            appspace.comms.sendMessage(appspace.gui.email, text);
            console.log('GUI: send message');
        },

        showMessage: function(email, text){
            var gravatar = appspace.gui.getGravatar(email);
            var message;
            if (email != appspace.gui.email) {
                message = $("<div class='message'><span><img title='" + email + "' src='" + gravatar + "'/>&nbsp;<span>" + text + "</span></div>");
            } else {
                message = $("<div class='message right'><span>" + text + "&nbsp;</span><span><img title='" + email + "' src='" + gravatar + "'/></div>");
            }
            $("#history").append(message);
            $("#history").scrollTop ($("#history")[0].scrollHeight);
            console.log('GUI: show message from:' + email);
        },

        receiveEvent: function(event) {
            var jsonEvent = JSON.parse(event.body);
            if (jsonEvent.type == "CONNECT") {
                console.log('GUI: receive CONNECT event: ' + event);
                appspace.gui.addParticipant(jsonEvent.email);
            } else {
                appspace.gui.removeParticipant(jsonEvent.email);
            }
            console.log('GUI: receive event: ' + event);
        },

        addParticipant: function(email){
            console.log('GUI: Add participant: ' + email);
            var gravatar = appspace.gui.getGravatar(email, 40);
            var participant = $("<span class='participant' data-email='" + email + "'><img title='" + email + "' src='" + gravatar + "'/><span>");
            $("#participants").append(participant);
        },

        showAllParticipants: function(emails){
            console.log('GUI: Show all participants: ' + emails);
            var index;
            for (index = 0; index < emails.length; ++index) {
                console.log(emails[index]);
                appspace.gui.addParticipant(emails[index]);
            }
        },

        removeParticipant: function(email){
            console.log('GUI: Remove participant: ' + email);
            $(".participant[data-email='" + email + "']").remove();
        },

        getGravatar: function(email, size) {
            // MD5 (Message-Digest Algorithm) by WebToolkit
            var MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
            var size = size || 80;
            return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?&d=wavatar&s=' + size;
        },

        removeSpacecraft: function(spacecraft){
            console.log('GUI: Remove spacecraft: ' + spacecraft);
            $(".spacecraft[data-spacecraft='" + spacecraft + "']").remove();
        },

        addSpacecraft: function(spacecraft){
            console.log('GUI: Add spacecraft: ' + spacecraft);
            var spacecraftElement = $("<p class='spacecraft' data-spacecraft='" + spacecraft + "'>" + spacecraft + "</p>");
            $("#spacecrafts").append(spacecraftElement);
        },

        showAllSpacecrafts: function(spacecrafts){
            console.log('GUI: Show all spacecrafts: ' + spacecrafts);
            var index;
            for (index = 0; index < spacecrafts.length; ++index) {
                console.log(spacecrafts[index]);
                appspace.gui.addSpacecraft(spacecrafts[index]);
            }
        }
    }
};


$( document ).ready(function() {
    $("#loginForm").submit(function( event ) {
        event.preventDefault();
        appspace.gui.login();
    });

    $("#messageForm").submit(function( event ) {
        event.preventDefault();
        appspace.gui.sendMessage();
    });

    $("#exit-button").click(function() {
        appspace.gui.exit();
    });
});
