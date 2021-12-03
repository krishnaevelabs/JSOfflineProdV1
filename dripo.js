
// if (!window.indexedDB) {
//     console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
// }

var db
var dbgetValue=[]
var dbDripoGetval=[]
var dbBedsGetval=[]
var dbFormBedValue=[]



/**
 * @description function to append device id to formfield
 * @param {message object of websocket} event 
 */


// option

setTimeout(function () {
  // This will be executed after 1,000 milliseconds

  var getReqs= db.transaction("beds").objectStore("beds")
 
requests = getReqs.openCursor();

requests.onerror = function(event) {
   console.log("error fetching data");
};
requests.onsuccess = function(event) {





   let cursor = event.target.result;
   if (cursor) {
    //  console.log(cursor,"cursor")
       let key = cursor.primaryKey;
       let value = cursor.value;
       dbFormBedValue.push(key)
      //  console.log(value,"value",key)
       
      
      
       cursor.continue();

   } 
   else {
       // here we get db get result to be displayed
      //  console.log(dbFormBedValue,"getbeds")
   

        var $mySelect = $('#getbed');
        //
        $.each(dbFormBedValue, function(key,value) {
          var $option = $("<option/>", {
            value: value,
            text: value
          });
          $mySelect.append($option);
        });
        }}
          
        }, 1000);






//test option complete


ws.onmessage = function (event) {
  // console.log(event.data)
  var msg = event.data;
  var splitter = msg.split(">");
  msg = splitter[1]
  splitter = msg.split("-");
  var deviceId = splitter[0];
  msg = splitter[2];
  if(msg=="ping"){  
    $('input[name="dripoId"]').val(deviceId)
  }
  else if(msg=="config"){
    $('input[name="buttonId"]').val(deviceId)

  }
}


function getDbdata(){
    dbgetValue.splice(0,dbgetValue.length)//to empty dbgetValue -  to avoid multiple get outputs 


var getReq= db.transaction("callbuttons").objectStore("callbuttons")
 
request = getReq.openCursor();

request.onerror = function(event) {
   console.log("error fetching data");
};
request.onsuccess = function(event) {


  $( ".devalert").css('display', 'block');
  setTimeout(function(){ 
   $( ".devalert").css('display', 'none');
 }, 3000);


   let cursor = event.target.result;
   if (cursor) {
    //  console.log(cursor,"cursor")
       let key = cursor.primaryKey;
       let value = cursor.value;
       dbgetValue.push(value)
       
      //  alert( value);
      
      
       cursor.continue();

   } 
   else {
       // here we get db get result to be displayed
      //  console.log(dbgetValue)


      //  test


       $("#patientCall").html('');

        dbgetValue.forEach(iterateCallbutton);

      
        function iterateCallbutton(item) {
          var html = $("#callButtonTemplate").html();
          // console.log(html,"1st html")
          html = $.parseHTML(html)
          // console.log(html,"2nd html")

          $.each(html, function (i, el) {
           
            if (el.id == "callButtonRoot")
              el.classList.add(item.id);
              // console.log(item.id,"id")
          });
          $("#patientCall").append(html);
          // console.log(item.id,"after append")


          $("." + item.id+ " .callbuttonid").html(item.id)
          $("." + item.id+ " .callbuttonname").html(item.name)
          $("." + item.id+ " .callbuttonlocation").html(item.location)




          $(document).on('click', "." + item.id + ' #callaction', function () {

            // delete items

            var requestUpdate = db.transaction("callbuttons","readwrite").objectStore("callbuttons").delete(item.id);
            requestUpdate.onerror = function(event) {
              // Do something with the error
              alert("CallbuttonId/Altname already exist")
            };
            requestUpdate.onsuccess = function(event) {


              // $( " #callButtonRoot" ).remove( ":contains("+ item.id+")" );
              $( " #callButtonRoot" ).remove( " ."+item.id );



             
         
              
            };

            




          });
      
          // $("." + item.id + "#callButtonRoot").css('display', 'none')
          //baseStateDripo(item.id);
      
      
        }
      

      // testend


       
   }
};
}







//dripo getdb

function getDripoDbdata(){
  dbDripoGetval.splice(0,dbDripoGetval.length)//to empty dbgetValue -  to avoid multiple get outputs 


var getDripoReq= db.transaction("dripos").objectStore("dripos")

request = getDripoReq.openCursor();

request.onerror = function(event) {
 console.err("error fetching data");
};
request.onsuccess = function(event) {

  $( ".devalert").css('display', 'block');
  setTimeout(function(){ 
   $( ".devalert").css('display', 'none');
 }, 3000);


 let cursor = event.target.result;
 if (cursor) {
  //  console.log(cursor,"cursor")
     let key = cursor.primaryKey;
     let value = cursor.value;
     dbDripoGetval.push(value)
     
    //  alert( value);
    
    
     cursor.continue();

 } 
 else {
     // here we get db get result to be displayed
    //  console.log(dbDripoGetval)


    //  test


     $("#dripodiv").html('');

     dbDripoGetval.forEach(iterateCallbutton);

    
      function iterateCallbutton(item) {
        var html = $("#dripoTemplate").html();
        // console.log(html,"1st html")
        html = $.parseHTML(html)
        // console.log(html,"2nd html")

        $.each(html, function (i, el) {
         
          if (el.id == "dripoRoot")
            el.classList.add(item.id);
            // console.log(item.id,"id")
        });
        $("#dripodiv").append(html);
        // console.log(item.id,"after append")


        $("." + item.id+ " .dripoid").html(item.id)
        $("." + item.id+ " .driponame").html(item.name)
        // $("." + item.id+ " .callbuttonlocation").html(item.location)




        $(document).on('click', "." + item.id + ' #dripoaction', function () {

          // delete items

          var requestUpdate = db.transaction("dripos","readwrite").objectStore("dripos").delete(item.id);
          requestUpdate.onerror = function(event) {
            // Do something with the error
            alert("DripoId/Altname already exist")
          };
          requestUpdate.onsuccess = function(event) {


            // $( " #callButtonRoot" ).remove( ":contains("+ item.id+")" );
            $( " #dripoRoot" ).remove( " ."+item.id );



           
       
            
          };

          




        });
    
        // $("." + item.id + "#callButtonRoot").css('display', 'none')
        //baseStateDripo(item.id);
    
    
      }
    

    // testend


     
 }
};
}

//dripo getdb end


// beds getDB


function getBedsDbdata(){
  dbBedsGetval.splice(0,dbBedsGetval.length)//to empty dbgetValue -  to avoid multiple get outputs 


var getBedReq= db.transaction("beds").objectStore("beds")

request = getBedReq.openCursor();

request.onerror = function(event) {
 console.err("error fetching data");
};
request.onsuccess = function(event) {

  $( ".devalert").css('display', 'block');
  setTimeout(function(){ 
   $( ".devalert").css('display', 'none');
 }, 3000);


 let cursor = event.target.result;
 if (cursor) {
  //  console.log(cursor,"cursor")
     let key = cursor.primaryKey;
     let value = cursor.value;
     dbBedsGetval.push(value)
     
    //  alert( value);
    
    
     cursor.continue();

 } 
 else {
     // here we get db get result to be displayed
    //  console.log(dbDripoGetval)


    //  test


     $("#bedsdiv").html('');

     dbBedsGetval.forEach(iterateBeds);

    
      function iterateBeds(item) {
        var html = $("#bedsTemplate").html();
        // console.log(html,"1st html")
        html = $.parseHTML(html)
        // console.log(html,"2nd html")

        $.each(html, function (i, el) {
         
          if (el.id == "bedsRoot" )
            el.classList.add(item.bedName);
            // console.log(item.id,"id")
        });
        $("#bedsdiv").append(html);
        // console.log(item.id,"after append")


        $("." + item.bedName+ " .bedname").html(item.bedName)
        // $("." + item.id+ " .callbuttonlocation").html(item.location)




        $(document).on('click', "." + item.bedName + ' #bedsaction', function () {

          // delete items

          var requestUpdate = db.transaction("beds","readwrite").objectStore("beds").delete(item.bedName);
          requestUpdate.onerror = function(event) {
            // Do something with the error
            alert("Bedname already exist")
          };
          requestUpdate.onsuccess = function(event) {


            // $( " #callButtonRoot" ).remove( ":contains("+ item.id+")" );
            $( " #bedsRoot" ).remove( " ."+item.bedName );



           
       
            
          };

          




        });
    
        // $("." + item.id + "#callButtonRoot").css('display', 'none')
        //baseStateDripo(item.id);
    
    
      }
    

    // testend


     
 }
};
}




// beds getDB end

function formSubmit(){
  var id = document.getElementById("id").value;
  var name = document.getElementById("name").value;

 
  dripos.push({'name':name , 'id':id});

 
// console.log(dripos)

//get from db



  var addDripo ={
    name : name,
     id:id
  }
 
 

  // Put this updated object back into the database.
  var requestUpdate = db.transaction("dripos","readwrite").objectStore("dripos").put(addDripo);
   requestUpdate.onerror = function(event) {
     // Do something with the error
     alert("DripoId/Altname already exist")
   };
   requestUpdate.onsuccess = function(event) {
     // Success - the data is updated!
     $( ".alert").css('display', 'inline');
     setTimeout(function(){ 
      $( ".alert").css('display', 'none');
    }, 3000);
    

     
   };
// };

//get db finish


}

//callbuttonstart
// var inputVal = document.getElementById('id');
// inputVal.value=n
// alert(n)
function callButtonSubmit(){
  var id = document.getElementById("id").value;
  var location = document.getElementById("location").value;
  var bedname = document.getElementById("getbed").value;
 
  // ca.push({'name':name , 'id':id});

 
// console.log(name)

//get from db

  // db.transaction("dripos").objectStore("dripos").get("12233").onsuccess = function(event) {
  // console.log("Name for SSN 444-44-4444 is " + event.target.result.name);

  var addCallbutton ={
    
     id:id,
     name:bedname,
     location : location,
  }
 
  

  // Put this updated object back into the database.
  var requestUpdate = db.transaction("callbuttons","readwrite").objectStore("callbuttons").put(addCallbutton);
   requestUpdate.onerror = function(event) {
     // Do something with the error
     alert("Callbutton Id/Altname already exist")
   };
   requestUpdate.onsuccess = function(event) {
    
     // Success - the data is updated!
     $( ".alert").css('display', 'inline');

     setTimeout(function(){ 
      $( ".alert").css('display', 'none');
    }, 3000);
    
    //  console.log(event)
   };
// };

//get db finish


}




function bedNameSubmit(){
  var bedName = document.getElementById("bedName").value;
  bedName=bedName.split(",")
  
  addBedNames= []

   
  bedName.forEach(addBedOutput)
 function addBedOutput(val,index){
  // addBedNames.push({bedName:val})
  // console.log(addBedNames, val,index)

 
 
  
   let tempVal = val.replace(/[^a-z0-9]*/gi,'');
   if (val!=""){
     regedVal=tempVal

   }else{
     console.log("emty error")
   }
  // console.log(val,"regex")

  addBedNames={
    bedName:regedVal
  }
  // console.log(addBedNames)
  // Put this updated object back into the database.
  var requestUpdate = db.transaction("beds","readwrite").objectStore("beds").add(addBedNames);
   requestUpdate.onerror = function(event) {
     // Do something with the error
     if (val ==""){}else{alert("Bedname already exist ")}
     
   };
   requestUpdate.onsuccess = function(event) {
    
     // Success - the data is updated!
     $( ".alert").css('display', 'inline');

     setTimeout(function(){ 
      $( ".alert").css('display', 'none');
    }, 3000);
    
    //  console.log(event)
   };


  }

}



//callbutton end
// dripos=[{
//   id:"12233",
//   name:"D1",
  
// },{
//   id:"12234",
//   name:"D2",
  
// }]

// callbuttons=[{
//   id:"B123",
//   name:"B1",
//   location:"Bed"
  
// }]


// const dbName = "evelabsdb";

// var request = indexedDB.open(dbName, 3);

// request.onerror = function(event) {
//   // Handle errors.
//   alert("Database Error")
// };
// request.onsuccess= function(event){
//   // setTimeout(function(){ alert("Hello"); }, 3000);

//   db = event.target.result;
// console.log("db created - name: ",db.name,"version :",db.version)
// };


// request.onupgradeneeded = function(event) {
//    db = event.target.result;
//   //  console.log("onupgrade db:",db)

//   // Create an objectStore to hold information about dripo. We're
//   // going to use "id" as our key path because it's guaranteed to be
//   // unique 
//   var objectStore = db.createObjectStore("dripos", { keyPath: "id" });

//     // Create an objectStore to hold information about callbuttons. We're
//   // going to use "id" as our key path because it's guaranteed to be
//   // unique 

//   var callbuttonStore=db.createObjectStore("callbuttons",{keyPath:"id"})

// //  Create bed store

//   var bedStore=db.createObjectStore("beds",{keyPath:"bedName"})

//   // Create an index to search dripos by name. We may have duplicates
//   // so we can't use a unique index.
//   objectStore.createIndex("name", "name", { unique: true });

//     // Create an index to search dripos by name. We may have duplicates
//   // so we can't use a unique index

//   callbuttonStore.createIndex("name","name",{ unique: false });
//   callbuttonStore.createIndex("location","location",{ unique: false });



// // console.log("object store : ",objectStore)
//   // Use transaction oncomplete to make sure the objectStore creation is
//   // finished before adding data into it.
//   objectStore.transaction.oncomplete = function(event) {
//     // Store values in the newly created objectStore.
//     // console.log("oncomplete:",event)
//     var customerObjectStore = db.transaction("dripos", "readwrite").objectStore("dripos");
//     dripos.forEach(function(dripo) {
//       customerObjectStore.put(dripo);
//     });
//   };

//   callbuttonStore.transaction.oncomplete = function(event) {
//     // Store values in the newly created objectStore.
//     // console.log("oncomplete:",event)
//     var customercallbuttonStore = db.transaction("callbuttons", "readwrite").objectStore("callbuttons");
//     callbuttons.forEach(function(callbutton) {
//       customercallbuttonStore.put(callbutton);
//     });
//   };

//   bedStore.transaction.oncomplete = function(event) {
//     // Store values in the newly created objectStore.
//     // console.log("oncomplete:",event)
//     var customerbedStore = db.transaction("beds", "readwrite").objectStore("beds");
//     beds.forEach(function(bed) {
//       customerbedStore.put(bed);
//     });
//   };
// };





