

/*
Function Tree
    --routetoDevice (identify type of device)
      --StateUpdateDevice (Identify states from message)
        --DeviceStates (populateStates)
*/

//<V1>B894857495549162611-V1-C/D/A/blue-B101-1-71

//db start\
var db
var callbutton =[]
var dripos =[]
var n=12;




function dbFetch(){
  const dbName = "evelabsdb";
  var request = indexedDB.open(dbName, 3);

request.onerror = function(event) {
  // Handle errors.
  alert("Database Error")
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  // console.log("onupgrade db:",db)

 // Create an objectStore to hold information about dripo. We're
 // going to use "id" as our key path because it's guaranteed to be
 // unique 
 var objectStore = db.createObjectStore("dripos", { keyPath: "id" });

   // Create an objectStore to hold information about callbuttons. We're
 // going to use "id" as our key path because it's guaranteed to be
 // unique 

 var callbuttonStore=db.createObjectStore("callbuttons",{keyPath:"id"})


 var bedStore=db.createObjectStore("beds",{keyPath:"bedName" ,  autoIncrement:true})

 // Create an index to search dripos by name. We may have duplicates
 // so we can't use a unique index.
 objectStore.createIndex("name", "name", { unique: true });

   // Create an index to search dripos by name. We may have duplicates
 // so we can't use a unique index

 callbuttonStore.createIndex("name","name",{ unique: false });
 callbuttonStore.createIndex("location","location",{ unique: false });





// console.log("object store : ",objectStore)
 // Use transaction oncomplete to make sure the objectStore creation is
 // finished before adding data into it.
 objectStore.transaction.oncomplete = function(event) {
   // Store values in the newly created objectStore.
  //  console.log("oncomplete:",event)
   var customerObjectStore = db.transaction("dripos", "readwrite").objectStore("dripos");
   dripos.forEach(function(dripo) {
     customerObjectStore.put(dripo);
   });
 };

 callbuttonStore.transaction.oncomplete = function(event) {
   // Store values in the newly created objectStore.
  //  console.log("oncomplete:",event)
   var customercallbuttonStore = db.transaction("callbuttons", "readwrite").objectStore("callbuttons");
   callbuttons.forEach(function(callbutton) {
     customercallbuttonStore.put(callbutton);
   });
 };


 bedStore.transaction.oncomplete = function(event) {
  // Store values in the newly created objectStore.
 //  console.log("oncomplete:",event)
  // var customerbedStore = db.transaction("beds", "readwrite").objectStore("beds");
  // beds.forEach(function(bedName) {
  //   customerbedStore.put(bedName);
  // });
};
};



request.onsuccess= function(event){
  db = event.target.result;
  console.log("db created - name: ",db.name,"version :",db.version)

  db.transaction(["callbuttons"],'readwrite').objectStore("callbuttons").openCursor().onsuccess=function(event){
  let cursor = event.target.result
  
  if (cursor){  
    callbutton.push(cursor.value)
    cursor.continue();
  }else{
    populateCallbutton();
    console.log("callbutton entries fetched")
  }
  
 
  //   callbutton.push(event.target.result)

  //  console.log(event.target.result)
};


db.transaction(["dripos"],'readwrite').objectStore("dripos").openCursor().onsuccess=function(event){
  // console.log(event.target.result)
  let cursor = event.target.result
  if (cursor){  

    dripos.push(cursor.value)

    cursor.continue();



    
  }else{
    populateDripos();
    console.log(" dripo entries fetched")
  }
  
  
  
 
 
  // console.log(event.target.result)
  //  dripos.push(event.target.result)
 
};

};

}




function populateDripos() {
  // console.log(dripos ,"yye")
  
  dripos.forEach(iterateDripo);
  function iterateDripo(item) {
    var html = $("#dripoStatusTemplate").html();
    html = $.parseHTML(html)    
    $.each(html, function (i, el) {
      if (el.id == "dripoRoot") 
      
        el.classList.add(item.id);
        
    });
    $("#dripoStatus").append(html);
    //baseStateDripo(item.id);
    $("." + item.id + " .rate").html(item.name);
    $("." + item.id + " .unit").html("Offline");
    $("." + item.id + " .bed").html("");
    $("." + item.id + " .time").html(item.id);
    $("." + item.id + " .volume").html("");
    $("." + item.id + " .volStatusBar").css('width', "0px");
    $("." + item.id + " .volCard").css('display', "none");
    $("." + item.id + " .volStatusBar").removeClass("blink_me");
    $("." + item.id + " .volStatusBar").css('display', "none");
    $("." + item.id + " .action").css("display", "none");
  }
}

function populateCallbutton() {
  callbutton.forEach(iterateCallbutton);

  function iterateCallbutton(item) {
    var html = $("#callButtonTemplate").html();
    html = $.parseHTML(html)
    $.each(html, function (i, el) {
      if (el.id == "callButtonRoot")
        el.classList.add(item.id);
    });
    $("#patientCall").append(html);

    $("." + item.id + "#callButtonRoot").css('display', 'none')
    //baseStateDripo(item.id);


  }
}
dbFetch();
// populateDripos();
// populateCallbutton()


let ws
start("ws://192.168.4.1:5276")
function start(websocketServerLocation){
ws = new WebSocket(websocketServerLocation)
ws.onmessage = function (event) {
  routeToDeviceFn(event.data);
  $("#connection").css('color','green');


  



};
ws.onclose = function(){
  // setTimeout(function(){
    window.location.reload
    start("ws://192.168.4.1:5276")
    $("#connection").css('color','red');

    
// },5000)
console.log("onclose")
}

ws.onerror=function(event){
  console.log(event,"onerror")
  $("#connection").css('color','red');

}
ws.addEventListener('open', function (event) {
  console.log('Hello Server!');
  $("#connection").css('color','green');

});



}


function getIndexDripo(dripodeviceid) {
  const index = dripos.findIndex(item => item.id === dripodeviceid);
  
  return index

}
function getDripoSoundAlert(deviceid){
  if(dripos[getIndexDripo(deviceid)].acked == true)
    music.pause()
    else
    music.play()

  
}
function routeToDeviceFn(value) {
  const dataArr = value.split("-");

  let countData= value.split("-").length-1
  console.log(dataArr, "dataarr",countData)

  if (dataArr.length > 1 && (countData == 11 || countData == 5 || countData == 3)) {
    var device = dataArr[0].split(">");
    if (device.length > 1) {
      var devType = device[1].substr(0, 1)
      var devID = device[1];
    } else {
      var devType = device[0].substr(0, 1)
      var devID = device[0];
    }
    if (devType == 'D') {
      // console.log("dripo")
      // dripo = dripos.find(dripo => dripo.id === devID);
      if (getIndexDripo(devID)>=0)
        stateUpdateDripo(dataArr);
    } else if (devType == 'B') {
      stateNurseCall(dataArr);
    }
  }
}

const music = new Audio('./drugmed.wav');
function stateUpdateDripo(message) {

  /* states
             -- baseStateDripo
             -- onStateDripo
             -- monitoringStateDripo
             -- medAlertStateDripo
             -- highAlertStateDripo
    Serial Msg types
    
            -- ACK - DID-ACK len=2
            -- ON/OFF - DID-V2-ON len=3
            -- STATUSMSH - DID------- Len=12
  */

  //get Device ID Split <>
  var deviceid = message[0].split(">");
  var deviceid = deviceid[1];
  wsDelaySend(deviceid + "-ack");
  //discard ack msg ny using condition len>2
  if (message.length > 3) {
    //Assiging Values
    // console.log(message);
    baserRate = message[7];
    dpf = message[5];
    unit = unit_convert(message[4]);
    function unit_convert(num) {
      if (num == 1)
        return "dpm"
      else
        return "ml/hr"
    }
    if (unit == 'dpm')
      rate = message[6] / 60 * dpf;
    else
      rate = message[6];
    status = message[2];
    bed = message[3];
    infusedVol = message[8];
    totalVol = message[9];
    battery = message[10];
    volPercentage = Math.ceil(infusedVol / totalVol * 100);
    timeRemaining = totalVol / rate * 60;
    function time_convert(num) {
      var hours = Math.floor(num / 60);
      var minutes = Math.ceil(num % 60);
      return "<b>" + hours + "h " + minutes + "mts</b> remaining";
    }
    timeRemainingText = time_convert(timeRemaining)

    //routing to stateFunctions
    if (status == "I") {
      monitoringStateDripo(deviceid)
    } else if (status == "B") {
      getDripoSoundAlert(deviceid)
      $("." + deviceid + " .rate").html("Flow Error");
      highAlertStateDripo(deviceid);
    } else if (status == "P") {
      $("." + deviceid + " .rate").html("Infusion Paused");
      medAlertStateDripo(deviceid);
    }else if (status == "R") {
      $("." + deviceid + " .rate").html(rate+"/"+baserRate+"<br> Rate Error");
      medAlertStateDripo(deviceid);
    } 
    else if (status == "C") {
      getDripoSoundAlert(deviceid)
      $("." + deviceid + " .rate").html("Infusion Ending Soon");
      highAlertStateDripo(deviceid);
    } else if (status == "E") {
      music.play()
      $("." + deviceid + " .rate").html("Infusion Ended");
      highAlertStateDripo(deviceid);
    } else if (status == "X") {
      baseStateDripo(deviceid);
    }
  }
}

function monitoringStateDripo(deviceid) {
  resetAlertDripo(deviceid);
  if (baserRate == 0){
    $("." + deviceid + " .rate").html(rate);
    dripos[getIndexDripo(deviceid)].acked = false

    $("." + deviceid + " #action").text('ACKNOWLEDGE').css('color', '#F31D1DAB')  
 
  $("." + deviceid + " .unit").html(unit);
  $("." + deviceid + " .bed").html(bed);
  $("." + deviceid + " .time").html(timeRemainingText);
  $("." + deviceid + " .volume").html("<b>" + infusedVol + "/" + totalVol + "ml</b> Infused");  
  $("." + deviceid + " .volStatusBar").css('width', volPercentage + "%");
  $("." + deviceid + " .volCard").css('display', "block");
  $("." + deviceid + " .volStatusBar").css('display', "block");
  $("." + deviceid + " .volStatusBar").removeClass("blink_me");
  $("." + deviceid + " .action").css("display", "none");
  $("." + deviceid + " .volCard").css('display', "block");
  if(battery <= 20){
    $("." + deviceid + " .battery").html("Battery: "+battery + "%").css('color','red');
  }else{
    $("." + deviceid + " .battery").html("Battery: "+battery + "%").css('color','black');

  }

    
  }
    
  else{
    dripos[getIndexDripo(deviceid)].acked = false

    $("." + deviceid + " #action").text('ACKNOWLEDGE').css('color', '#F31D1DAB')  
    $("." + deviceid + " .rate").html(rate + "/" + baserRate);
  $("." + deviceid + " .unit").html(unit);
  $("." + deviceid + " .bed").html(bed);
  $("." + deviceid + " .time").html(timeRemainingText);
  $("." + deviceid + " .volume").html("<b>" + infusedVol + "/" + totalVol + "ml</b> Infused");  
  $("." + deviceid + " .volStatusBar").css('width', volPercentage + "%");
  $("." + deviceid + " .volCard").css('display', "block");
  $("." + deviceid + " .volStatusBar").css('display', "block");
  $("." + deviceid + " .volStatusBar").removeClass("blink_me");
  $("." + deviceid + " .action").css("display", "none");
  $("." + deviceid + " .volCard").css('display', "block");
  if(battery <= 20){
    $("." + deviceid + " .battery").html("Battery: "+battery + "%").css('color','red');
  }else{
    $("." + deviceid + " .battery").html("Battery: "+battery + "%").css('color','black');

  }
}
}

function baseStateDripo(deviceid) {
  resetAlertDripo(deviceid);
  dripo = dripos.find(dripo => dripo.id === deviceid);
  //console.log(dripo);

  $("." + deviceid + " .rate").html(dripo.name);
  $("." + deviceid + " .unit").html("Offline");
  $("." + deviceid + " .bed").html("");
  $("." + deviceid + " .time").html(deviceid);
  $("." + deviceid + " .volume").html("");
  $("." + deviceid + " .volStatusBar").css('width', "0px");
  $("." + deviceid + " .volCard").css('display', "none");
  $("." + deviceid + " .volStatusBar").removeClass("blink_me");
  $("." + deviceid + " .volStatusBar").css('display', "none");
  $("." + deviceid + " .action").css("display", "none");
}

function highAlertStateDripo(deviceid) {
  $("." + deviceid + " .unit").html(unit);
  $("." + deviceid + " .bed").html(bed);
  $("." + deviceid + " .time").html(timeRemainingText);
  $("." + deviceid + " .volume").html("<b>" + infusedVol + "/" + totalVol + "ml</b> Infused");
  $("." + deviceid + " .rate").css("color", "#EB5757");
  $("." + deviceid + " .action").css("display", "block");
  $("." + deviceid + " .volStatusBar").css("background-color", "#EB5757");
  $("." + deviceid + " .volStatusBar").addClass("blink_me");
  $("." + deviceid + " .volCard").css('display', "block");
  if(battery <= 20){
    $("." + deviceid + " .battery").html("Battery: "+battery + "%").css('color','red');
  }else{
    $("." + deviceid + " .battery").html("Battery: "+battery + "%").css('color','black');

  }

  $(document).on('click', "." + deviceid + ' #action', function () {

    dripos[getIndexDripo(deviceid)].acked = true
    $("." + deviceid + " #action").text('ACKNOWLEDGED').css('color', '#F2C94C')



  });
}

function medAlertStateDripo(deviceid) {
  dripos[getIndexDripo(deviceid)].acked = false
  $("." + deviceid + " #action").text('ACKNOWLEDGE').css('color', '#F31D1DAB')
  $("." + deviceid + " .unit").html(unit);
  $("." + deviceid + " .bed").html(bed);
  $("." + deviceid + " .time").html(timeRemainingText);
  $("." + deviceid + " .volume").html("<b>" + infusedVol + "/" + totalVol + "ml</b> Infused");
  $("." + deviceid + " .action").css("display", "none");
  $("." + deviceid + " .rate").css("color", "#F2C94C");
  $("." + deviceid + " .volStatusBar").css("background-color", "#F2C94C");
  $("." + deviceid + " .volStatusBar").addClass("blink_me");
  $("." + deviceid + " .volCard").css('display', "block");
  if(battery <= 20){
    $("." + deviceid + " .battery").html("Battery: "+battery + "%").css('color','red');
  }else{
    $("." + deviceid + " .battery").html("Battery: "+battery + "%").css('color','black');

  }
}


// helper functions for states dripo

function resetAlertDripo(deviceid) {
  $("." + deviceid + " .rate").css("color", "#6D7587");
  $("." + deviceid + " .volStatusBar").css("background-color", "#6202EE");
}


function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}

async function wsDelaySend(msg) {
    await sleep(20);
    ws.send(msg)
    ws.send(msg)
  }

function stateNurseCall(message) {
  // console.log(message,"nursecall")
   function getIndex(calldeviceid) {
    const index = callbutton.findIndex(item => item.id === calldeviceid);
    
    return index

  }
  
  

  let calldeviceid = message[0].split(">");
  calldeviceid = calldeviceid[1];
  let callStatus = message[2];
  let newCallFlag = message[4];
  let callButtonBattery =message[5]
  

  
  if(callStatus == "blue"&& getIndex(calldeviceid)>=0){
  

    $("." + calldeviceid + " .calltitle").html(" CODE BLUE ").css('color','red')
    $("." + calldeviceid + "#callButtonRoot").css('display', 'inline');
    $("." + calldeviceid + " .bedname").html(callbutton[getIndex(calldeviceid)].name);
    $("." + calldeviceid + " .location").html(callbutton[getIndex(calldeviceid)].location);
    $("." + calldeviceid + " #callaction").text('ACKNOWLEDGE').css({'display':'none'})
    music.play()
    
  
  }

  if (callStatus == "config"){
    n=calldeviceid

  }

  
  if (callStatus == "C" && getIndex(calldeviceid)>=0) {
    // console.log(getIndex("B223344"))
  

    //console.log("Call");
    //console.log(newCallFlag);
   // alert("ok")

    //wsDelaySend("HAI");
    if(callButtonBattery <=10)
    $("." + calldeviceid + " .callButtonBattery").html("Battery: "+callButtonBattery + "%").css('color','red');
    else
    $("." + calldeviceid + " .callButtonBattery").html("Battery: "+callButtonBattery + "%").css('color','black');
    $("." + calldeviceid + " .calltitle").html(" PATIENT CALL ").css('color','#6D7587');

    $("." + calldeviceid + "#callButtonRoot").css('display', 'inline');
    $("." + calldeviceid + " .bedname").html(callbutton[getIndex(calldeviceid)].name);
    $("." + calldeviceid + " .location").html(callbutton[getIndex(calldeviceid)].location);
    if (callbutton[getIndex(calldeviceid)].acked == true){
      if (newCallFlag == 1){
        
        wsDelaySend(calldeviceid + "-ack");
        callbutton[getIndex(calldeviceid)].acked = false
        music.play()
      $("." + calldeviceid + " #callaction").text('ACKNOWLEDGE').css({'color': 'red', 'display':'inline'})
     }
      else{

        wsDelaySend(calldeviceid + "-ackT");
      $("." + calldeviceid + " #callaction").text('ACKNOWLEDGED').css({'color':'#F2C94C','display':'inline'})
     }
      
    }else{
      if (newCallFlag == 1 || newCallFlag == 0){
      
        
        wsDelaySend(calldeviceid + "-ack");
        // console.log("data send")
        music.play()

      }


      $("." + calldeviceid + " #callaction").text('ACKNOWLEDGE').css({'color':'red','display':'inline'})
    }

    $(document).on('click', "." + calldeviceid + ' #callaction', function () {

      callbutton[getIndex(calldeviceid)].acked = true
      $("." + calldeviceid + " #callaction").text('ACKNOWLEDGED').css({'color':'#F2C94C','display':'inline'})



    });

    
  } else if (callStatus == "D" && getIndex(calldeviceid)>=0) {
    wsDelaySend(calldeviceid + "-ack");
   //ws.send(calldeviceid + "ack")
    callbutton[getIndex(calldeviceid)].acked = false
    $("." + calldeviceid + "#callButtonRoot").css('display', 'none')

    // console.log("Cancel");
  } else if (callStatus == "A" && getIndex(calldeviceid)>=0) {
    wsDelaySend(calldeviceid + "-ack");
    //ws.send(calldeviceid + "ack")
    callbutton[getIndex(calldeviceid)].acked = false

    $("." + calldeviceid + "#callButtonRoot").css('display', 'none')
    // console.log("Acknowledge");
  }
}
