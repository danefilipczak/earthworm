// 
//genes [0] codes for mode. genes [1] codes for rhythm. 

var part = new p5.Part(8);
var phrase;
var darwintoggle=false;
var count = -1;
var ubuntu;
var droneamp = 0.1;
var tonality = "modal";
var itoggle = true;
var atoggle = false;
var ibuttonstring = ""
var abuttonstring = ""
var dbuttonstring = ""
var tbuttonstring = ""
var loaded=false;
var ilockstring = ""
var rlockstring = ""
var notenum;
var drones = [];
var population;
var info;
var voice;
var dtoggle = false;
var volume;
var basicsliders = [];
var advancedsliders = [];
var bpm = 120;
var notecontrol;
var popmax = 5;
var mutationRate = 0.02;
var rlocktoggle = false;
var ilocktoggle = false;
var fontReady = false;
//var lowrange = -2;
//var highrange = 10;
var lowrange = 1;
var highrange = 8;
function setup() {
    atoggle=true;

  var canvas = createCanvas(window.innerWidth*0.618,window.innerHeight);
  canvas.position(0, 0);
  frameRate(24);
   darwin = loadImage("resources/Darwin.jpg");
   dna = loadImage("resources/dna.jpg")
    // //dna = loadGif('resources/dna.gif');
    // //tree = loadImage('resources/transtree.png');
    // tanpura = loadSound('resources/drone.mp3')
    // tanpura.amp(0.05);
    //delay = new p5.Delay();
  //delay.process(tanpura, .69, .8, 4300);
  //delay.setType('pingPong');
  //delay.amp(1);


  //advanced buttons
  dbutton = new Button(width-190, height-135, 150, 20, dbuttonstring);
  var buttonspace = height/2-165;
  //normal button
  tbutton = new Button(width-155, 165+buttonspace*0.2, 100, 20, tonality);
  sbutton = new Button(width-145, 165+buttonspace*0.4, 100, 20, "bounce");
  rbutton = new Button(width-165, 165+buttonspace*0.6, 100, 20, "start over");
  //make basic sliders in order
  volume = new Slider(width-180, height*0.618+(height*0.312/3), 100, 10, 0, 1);
  volume.pos = 40;
  basicsliders.push(volume);
  notecontrol = new Slider(width-180, height*0.618+(height*0.312*(2/3)), 100, 10, 2.1, 20);
  notecontrol.pos = 30;
  basicsliders.push(notecontrol);
   notenum = basicsliders[1].getvalue();
   bpmcontrol = new Slider(width-180, height*0.618, 100, 10, 40, 200);
  bpmcontrol.pos = 30;
  basicsliders.push(bpmcontrol);
   bpm = basicsliders[2].getvalue();
   //make advanced sliders in order
   popcontrol = new Slider(width-180, height-(height*0.433), 100, 10, 2.1, 20);
  popcontrol.pos = 30;
  advancedsliders.push(popcontrol);
  mutationcontrol = new Slider(width-180, height-(height*0.366), 100, 10, 0.0, 0.5);
  mutationcontrol.pos = 10;
  advancedsliders.push(mutationcontrol);
  //popmax = round(advancedsliders[0].getvalue());
  popmax = 10;
  population = new Population(mutationRate,popmax);
   
  
  population.decode();
  Soundfont.instrument(ac, 'flute').then(function (player) {
      print('player ready');
  voice = player;
  document.getElementById("loading").innerHTML = "";
  loaded=true;
    })
 

}

function mousePressed() {
    if(darwintoggle) {
        nextGen();
        //println("new batch!");
        //window.location.href = 'love';
    } 
    // else if (ibutton.rollover && itoggle) {
    //     itoggle = false;
    //     atoggle=false;
    // } else if (ibutton.rollover && !itoggle) {
    //     itoggle = true;
    // } else if (tbutton.rollover && tonality=="modal") {
        
    //     tonality = "chromatic";
    //     //population.decode();
        
    // } else if (tbutton.rollover && tonality=="chromatic") {
        
    //     //tonality = "pentatonic";
    //     tonality = "modal";
    //     //population.decode();
        
    // } else if (tbutton.rollover && tonality=="pentatonic") { //pentatonic isn't implemented yet
        
    //     tonality = "modal";
    //     //population.decode();
       
    // } else if (abutton.rollover && atoggle) {
    //     atoggle = false;
    // } else if (abutton.rollover && !atoggle) {
    //     atoggle = true;
    //} 
    if(population.rollover) {
        population.clicked();
    } 
    if(sbutton.rollover){
        population.save();
    }
    // if (dbutton.rollover && dtoggle) {
    //     dtoggle = false;
    //     // for(var i=0;i<drones.length;i++){
    //     //     drones[i].stop();
    //     // }
    //     // for(var i=0;i<drones.length;i++){
    //     //     drones[i].stop();
    //     // }
    //     tanpura.stop();
    // } else if (dbutton.rollover && !dtoggle) {
    //     dtoggle = true;
    //     // drone();
    //     // for(var i=0;i<drones.length;i++){
    //     //     drones[i].start();
    //     // }
    //     tanpura.loop();
        
    // } else if (ilock.rollover && !ilocktoggle){
    //     ilocktoggle = true;
    // } else if (ilock.rollover && ilocktoggle){
    //     ilocktoggle = false;
    // } else if (rlock.rollover && !rlocktoggle){
    //     rlocktoggle = true;
    //     population.decode();
    // }   else if (rlock.rollover && rlocktoggle){
    //     rlocktoggle = false;
    //     population.decode();
    // } else if (rbutton.rollover){
    //     //population = new Population(mutationRate,popmax);
    //     popmax = round(advancedsliders[0].getvalue());
    //     population = new Population(mutationRate, popmax);
    //     population.decode();
    // }
        
        
    // for(var i=0; i<basicsliders.length; i++) {
    //     if (basicsliders[i].over) {
    //     basicsliders[i].move = true;
    //     }
    // }
    // for(var i=0; i<advancedsliders.length; i++) {
    //     if (advancedsliders[i].over) {
    //     advancedsliders[i].move = true;
    //     }
    // }
    
}

function windowResized(){
  resizeCanvas(window.innerWidth*0.618, window.innerHeight);
}

function mouseReleased() {
    
        //popmax = round(advancedsliders[0].getvalue())
    
    
        //mutationRate = advancedsliders[1].getvalue().toFixed(2);
   
    if(basicsliders[1].move) {
        nextGen();
    } else if (advancedsliders[0].move) {
        //popmax = advancedsliders[0].getvalue();
        population = []; 
        population = new Population(mutationRate, popmax);
        population.decode();
    }
  for(var i=0; i<basicsliders.length; i++) {
  basicsliders[i].move = false;
}
    for(var i=0; i<advancedsliders.length; i++) {
  advancedsliders[i].move = false;
}
}




function draw() {
   
  background(230);
  
  
  population.display();
  population.rollover(mouseX,mouseY); 
  
  //translate(0,0);
  
  
 
  
  //   tbutton.label = tonality;
  // tbutton.over();
  // //tbutton.display();
  // sbutton.over();
  // //sbutton.display();
  // rbutton.over();
  // //rbutton.display();
 
  
  // //update basicsliders
  // if(!atoggle){
  // for(var i=0; i<basicsliders.length; i++) {
  //   basicsliders[i].update();
  //   //basicsliders[i].display();
  //   }
  // }
  
    
    //do slider things 
    // masterVolume(basicsliders[0].getvalue());
    // gain = basicsliders[0].getvalue();
    
    // notenum = basicsliders[1].getvalue();
    // popmax = advancedsliders[0].getvalue();
    
    // //basicslider text 
    // textAlign(LEFT, CENTER);
    // if(basicsliders[0].over) {
    //     fill(0);
        
    // } else {
        
    //     fill(140, 140, 100);
    // }
    // //text("volume " + round(map(basicsliders[0].getvalue(), 0, 1, 0, 10)), width-180,height*0.618+(height*0.312/3)-30, 180, 40);
    // if(basicsliders[1].over) {
    //     fill(0);
        
    // } else {
        
    //     fill(140, 140, 100);
    // }
    // //text("length " + floor(basicsliders[1].getvalue()+1), width-180,height*0.618+(height*0.312*(2/3))-30, 180, 40);
    // if(basicsliders[2].over) {
    //     fill(0);
        
    // } else {
        
    //     fill(140, 140, 100);
    // }
    // //text("speed " + floor(basicsliders[2].getvalue()), width-180,height*0.618-30, 180, 40);
    // translate(0,0);
    // //
    // textAlign(LEFT, LEFT);
    
    //text(" generation " + population.getGenerations(), width-180, height-(height/9), 195, 20);
    
    //advanced screen 
  //  if(atoggle) {
  //   abuttonstring = "hide advanced";
  //   textAlign(LEFT, CENTER);
  //   fill(140, 140, 100);
  //   //rect(width-195, height/2, 190, height/2);
  //   fill(255, 180);
  //   //rect(width-195, height/2, 190, height/2);
  //   fill(0);
  //   textSize(18);
  //   } if (!atoggle) {
  //   abuttonstring = "show advanced";
  // }
  // abutton = new Button(width-190, height/2-23, 180, 20, abuttonstring);
  // abutton.over();
  
  // abutton.display();
  // if(atoggle){
  //   //update advanced sliders
  //   for(var i=0; i<advancedsliders.length; i++) {
  //    advancedsliders[i].update();
  //    //advancedsliders[i].display();
  //   }
  
  // //advanced text
  // textAlign(LEFT, CENTER);
  
  //   if(advancedsliders[0].over) {
  //       fill(0);
  //   } else {
  //       fill(140, 140, 100);
  //   }
  //   //text("population size " + round(advancedsliders[0].getvalue()), width-180,height-(height*0.433)-30, 180, 40);
  //   if(advancedsliders[1].over) {
  //       fill(0);
  //   } else {
  //       fill(140, 140, 100);
  //   }
  //   //text("mutation rate " + advancedsliders[1].getvalue().toFixed(2), width-180,height-(height*0.366)-30, 180, 40);
    
  //   //drone button
  //   if(dtoggle) {
  //   dbuttonstring = "drone off";
  //   } if (!dtoggle) {
  //   dbuttonstring = "drone on";
  // }
  //   dbutton = new Button(width-190, height-(height*0.3), 150, 20, dbuttonstring);
  // dbutton.over();
  // //dbutton.display();
  // //ionian lock button 
  //   if(ilocktoggle) {
  //   ilockstring = "lock to ionian ON";
  //   } if (!ilocktoggle) {
  //   ilockstring = "lock to ionian";
  // }
  // ilock = new Button(width-190, height-(height*0.2), 150, 20, ilockstring);
  // ilock.over();
  // //ilock.display();
  // //ionian lock button 
  //   if(rlocktoggle) {
  //   rlockstring = "monorhythm OFF";
  //   } if (!rlocktoggle) {
  //   rlockstring = "monorhythm";
  // }
  // rlock = new Button(width-190, height-(height*0.1), 180, 20, rlockstring);
  // rlock.over();
  // //rlock.display();
  
  
  // }
  //insructions
  // if(itoggle) {
  //   ibuttonstring = "got it";
    
  //   fill(140, 140, 100, 230);
  //   //rect(width-(width*0.618), 0, width*0.618, height);
  //   //image(tree, 0, 0);
  //   fill(0);
  //   textSize(18);
  //   textAlign(LEFT, CENTER);
  //   //text("click on darwin >>\nto evolve a new generation.",width-310, 10, 200, 100);
  //   textAlign(LEFT, TOP);
  //   // text("mouse over a melody to play it.\nclick on a melody to add it to the mating pool."
  //   //   ,width-(width*0.618)+10, 100, (width*0.618)/2, height/2);
  //   textSize(14);
  //   // //text("click modal to switch back and forth from chromatic mode. modal can yeild any of the diatonic modes excluding locrian, while chromatic uses all twelve tones.\n\nselect a melody and click bounce to save it to your computer as a MIDI file.\n\nshow advanced for more options."
  //   //   ,(width*0.618), height*0.618, (width*0.618)/2, height/2);
    
  //   textAlign(RIGHT, TOP);
  //   fill(255);
  //   // text("v 0.2"
  //   //   ,0, height-20, width, 100);
     
  // } if (!itoggle) {
  //   ibuttonstring = "show instructions";
  // }
  // ibutton = new Button(width-190, 165, 180, 20, ibuttonstring);
  // ibutton.over();
  //ibutton.display();
  
  ///darwin button, always on top :' )  RIP beautiful soul 
  //image is 106×145 and hangs at the top, everything else should be scaled porportionally and start at 324
//   noTint();
//   //image (darwin, width-200+94/2, 10);
//   //if mouse is over darwin set darwin toggle
//   if(mouseX>width-200+94/2 && mouseX<width-47 && mouseY>10 && mouseY<155){
//       darwintoggle = true;
//   } else {
//       darwintoggle = false;
//   }
//   //note that this is actually a cruddy solution. 
//   //tint() can't be called on dna until it is loaded,
//   //which takes a second. if the user mouses over
//   //darwin before dna is loaded, it won't display. 
//   //I'm betting on dna being fully loaded after 4 seconds 
//   if(darwintoggle && millis()>3000){
//      tint(255, 80);
//     //image (dna, width-200+94/2, 10); 
//   } 
  
// }
}
// If the button is clicked, evolve next generation
function nextGen() {
    //notenum = basicsliders[1].getvalue();
  render();
  population.selection();
  population.reproduction();
  population.decode();
  document.getElementById("generations").innerHTML = "generations: " + population.getGenerations();
}

function counter() {
    count+=1;
    print(count);
}

//synthesizing a drone is cool but why. 
// function drone() {
//     drones = []
//      var harmonic = 2;
//     for(var i=0; i<8; i++){
       
//         var drone = new p5.Oscillator();
//         drone.setType('sine');
//         drone.freq(droneamp);
//         drone.pan(random(0, 0.5));
//         drone.amp(droneamp-(i*0.1));
//         drones.push(drone);
//         var drone2 = new p5.Oscillator();
//         drone2.setType('sine');
//         drone2.freq(midiToFreq(43)*harmonic+random(-2, 2));
//         drone2.pan(random(-0.5, 0));
//         drone2.amp(droneamp-(i*0.1));
//         drones.push(drone2);
//         harmonic *= harmonic;
//         if (harmonic> 32){
//             harmonic = 2;
//         }
//     }
   
// }
// //dynamic response to window resizing is cool but doesn't work when objects are instantiated with positions in setup()
// function windowResized() {
//   resizeCanvas(
//     window.innerWidth,
//     window.innerHeight
//   );
//   redraw();
// }


function changeInstrument() {
  document.getElementById("loading").innerHTML = "loading...";
  print('yada yada ');
  var dataCap = document.getElementById("selected2").value;
  print(dataCap);
  Soundfont.instrument(ac, dataCap).then(function (player) {
      print('player ready');
  voice = player;
  document.getElementById("loading").innerHTML = "";
    })
}

function reset(){
    population = new Population(mutationRate, popmax);
    population.decode();
}


function bounce(){
  population.save();
}


function makeVoice(){

  var pitches;
  var durations;

  for (var i = 0; i < population.population.length; i++) {
    if(population.population[i].willibeaparent){
      pitches = population.population[i].pitches;
      durations = population.population[i].durations;

      }
  }


  var parse = parseNotes(pitches, durations);
  var notes = parse[0];
  var ticks = parse[1];

  //console.log()


  // Create a voice in 4/4 and add above notes
  var voice = new VF.Voice({num_beats: ticks,  beat_value: 8});
  
  voice.addTickables(notes);




  return [voice, notes];
}

function parseNotes(pitches, durations){
  //console.log(pitches, durations);
  var ticks = 0;
  var notes = [];
  var naturals = [54, 56, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76];
  console.log(durations);
  for(var i=0;i<pitches.length; i++){
    var dur = convertDurs(durations[i]);
    var key = convertPitches(pitches[i]);
    console.log(key, pitches[i]);
    var note = new VF.StaveNote({clef: "treble", 
      keys: [key], 
      duration: dur });

    if(durations[i]=="d4"){
      note.addDotToAll();
    }

    var natural = false;
    naturals.forEach(function(nat){
      if(pitches[i]==nat){
        natural=true;
      }
    })

    if(!natural){
      note.addAccidental(0, new VF.Accidental("b"));
    }





    notes.push(note);
    //console.log(note, dur)
  }

  ticks = getTicks(durations);

  return [notes, ticks];
}


function getTicks(durs){
  var ti=0;
  for(var i = 0;i<durs.length;i++){
    var dur = durs[i];
    switch(dur){
    case "8":
      ti++;
      break;
    case "4":
      ti+=2;
      break;
    case "d4":
      ti+=3;
      break;
    case "2":
      ti+=4;
      break;
    }
  }

  return ti;
}

function convertDurs(dur, ticks){
  var newdur;
  switch(dur){
    case "8":
      newdur = "8";
      break;
    case "4":
      newdur = "q";
      break;
    case "d4":
      newdur = "qd"
      break;
    case "2":
      newdur = "h";
      break;
    
  }
  return newdur;
  //console.log(newdur)
}

function convertPitches(pitch){
  var newdur;
 switch(pitch){
    case 54:
      newdur = "gb/3";
      break;
    case 55:
      newdur = "g/3";
      break;
    case 56:
      newdur = "ab/3";
      break;
    case 57:
      newdur = "a/3";
      break;
    case 58:
      newdur = "bb/3";
      break;
    case 59:
      newdur = "b/3";
      break;
    case 60:
      newdur = "c/4";
      break;
    case 61:
      newdur = "db/4";
      break;
    case 62:
      newdur = "d/4"
      break;
    case 63:
      newdur = "eb/4";
      break;
    case 64:
      newdur = "e/4";
      break;
    case 65:
      newdur = "f/4";
      break;
    case 66:
      newdur = "gb/4";
      break;
    case 67:
      newdur = "g/4";
      break;
    case 68:
      newdur = "ab/4";
      break;
    case 69:
      newdur = "a/4";
      break;
    case 70:
      newdur = "bb/4";
      break;
    case 71:
      newdur = "b/4";
      break;
    case 72:
      newdur = "c/5";
      break;
    case 73:
      newdur = "db/5";
      break;
    case 74:
      newdur = "d/5";
      break;
    case 75:
      newdur = "eb/5";
      break;
    case 76:
      newdur = "e/5";
      break;
    
  }


  return newdur;
}

// var notes = [
//     new VF.StaveNote({clef: "treble", keys: ["e##/5"], duration: "8d" }).
//       addAccidental(0, new VF.Accidental("##")).addDotToAll(),

//     new VF.StaveNote({clef: "treble", keys: ["eb/5"], duration: "16" }).
//       addAccidental(0, new VF.Accidental("b")),

//     new VF.StaveNote({clef: "treble", keys: ["d/5", "eb/4"], duration: "h" }).
//       addDot(0),

//     new VF.StaveNote({clef: "treble", keys: ["c/5", "eb/5", "g#/5"], duration: "q" }).
//       addAccidental(1, new VF.Accidental("b")).
//       addAccidental(2, new VF.Accidental("#")).addDotToAll()
//   ];
   // var notes = [
    //   // A quarter-note C.
    //   new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }),

    //   // A quarter-note D.
    //   new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }),

    //   // A quarter-note rest. Note that the key (b/4) specifies the vertical
    //   // position of the rest.
    //   new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),

    //   // A C-Major chord.
    //   new VF.StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" })
    // ];

    // // Create a voice in 4/4 and add above notes
    // var voice = new VF.Voice({num_beats: 8,  beat_value: 8});
    // voice.addTickables(notes);

