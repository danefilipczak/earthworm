var ac = new AudioContext();
// var env = new p5.Env();
// env.set(0.05, 0, 0.005, 1, 0.1, 0.0, 0.5, 0);
// var osc = new p5.Oscillator();
// var osc2 = new p5.Oscillator();
// osc.amp(0);
// osc2.amp(0);
//osc2.start();
var sequence;
var milliseconds;
var pitches;
var gain = 1;
var dur;
this.mode;
//osc.start();
// reverb = new p5.Reverb();
// reverb.process(osc, 1, 0.6);
// reverb.amp(1);
// reverb2 = new p5.Reverb();
// reverb2.process(osc2, 1, 0.9);
// reverb2.amp(1); // turn it up!
var motion=0; 
// osc.setType('sine');
//         osc.amp(env);
//         osc.pan(-1);
//         osc2.setType('sine');
//         osc2.amp(env);
//         osc2.pan(1);

function Melody(dna_, x_, y_) {
    //each melody is fed some dna that's an array of floats between 0 and 1.  
    this.pattern = []; //for sequencing and playing audio (p5.sound library format)
    this.part = new p5.Part();
    this.pphrase;
    this.fitness = 1;
    this.dna = dna_;
    //this.ppart.setBPM(bpm);
    this.x = x_;
    this.y = y_;
    this.rolloverOn = false;
    this.playing = false;
    this.willibeaparent = false;
    this.count=-1;
    this.pitches = []; //for midi rendering, using the MidiWriter.js library format
    this.durations = [];
    this.worm = []; // stores note locations for drawing the worm shape around them. 
    this.tinypattern = [];
    this.tinystring = '';
    this.milliseconds = []; //millisecond cumulative delta array
    this.timeouts = [];
    this.durs = [] // millisecond durations array 
    
    
    this.getFitness = function() {
    return this.fitness;
    }
    this.getDNA = function() {
    return this.dna;
    }
    
    this.save = function(){//save to MIDI

    //     <li>1  : whole</li>
				// 	<li>2  : half</li>
				// 	<li>d2 : dotted half</li>
				// 	<li>4  : quarter</li>
				// 	<li>d4 : dotted quarter</li>
				// 	<li>8  : eighth</li>
				// 	<li>8t : eighth triplet</li>
				// 	<li>d8 : dotted eighth</li>
				// 	<li>16 : sixteenth</li>

    var track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}));
    
    for(var i=0; i<this.pitches.length; i++){
        var note = new MidiWriter.NoteEvent({pitch:[this.pitches[i]], duration: this.durations[i]});
        track.addEvent(note);
    }
    var tempo = basicsliders[2].getvalue();
    track.setTempo(tempo);
    print(tempo);
    
    var write = new MidiWriter.Writer([track]);
    console.log(write.dataUri());
    //promt the user, save the file (dependent on browser implementations, might change later to be more universal)
    window.location.assign(write.dataUri());

    }
    
    this.sound = function(time, hz){
        motion=0;
        
        
        if(tonality=="modal"||tonality=="chromatic"){//in modal or chramatic modes, convert midi note nums to frequency  
            osc.freq(midiToFreq(hz));
        } else if (tonality=="pentatonic"){// in (not yet implemented) pentatonic mode, we're using raw herz (to acheive pythagorean temperment)
            osc.freq(hz);
        }
        

        
        if(tonality=="modal"||tonality=="chromatic"){
            osc2.freq(midiToFreq(hz)+random(-3,3));
        } else if (tonality=="pentatonic"){
            osc2.freq(hz+random(-3,3));
        }
        
       
        env.play(); //the oscillators are running the whole time, but the envelope is triggered by the sequencer. 
        //count+=1; //this variable allows us to keep track of where the sequencer is for visualisation's sake
    
        
       
        
    }
   
    
    
    this.decode = function(){
        
        //take a breath, and don't be scared of the enormity of the task 
        var genes = this.dna.genes;
        //empty out the arrays 
        this.worm = [];
        this.pattern = [];
        this.durations = [];
        this.pitches = [];
        this.tinypattern = [];
        this.tinystring = '';
        
        //figure out what mode it should be based on first gene
        // 1 ionian 
        // 2 dorian 
        // 3 phrygian 
        // 4 lydian 
        // 5 mixolydian 
        // 6 aeolian 
        // we're not using locrian because screw it, I want the drone to be a perfect fifth. 
        
        var mode;
        if (genes[0] < 0.16){//remember that every gene is a float from 0.0 to 1.0
            mode = 1;
        } else if (genes[0] < 0.33){
            mode = 2;
        } else if (genes[0] < 0.5){
            mode = 3;
        } else if (genes[0] < 0.66){
            mode = 4;
        } else if (genes[0] < 0.83){
            mode = 5;
        } else {
            mode = 6;
        }
        if(ilocktoggle){
            mode = 1;
        }
        
        this.mode = mode;
        //var last = 1;
        
        for(var i=2; i<notenum*2+2; i+=2){
            var temp = genes[i];
            //map to abstract modal degree
            temp = round(map(temp, 0, 1, lowrange, highrange));

            /*
            //forcing a few things here using arbitrary genes. maybe will put back in the future 
            if(genes[2]<0.5 && !last==-2 || abs(temp-last>4)){
                if(genes[3]<0.7 || temp-last>4){
                    temp = last-1;
                } else {
                    temp = last+1;
                }
            }
            
            last = temp;
            //make sure it doesn't go outta range
            if(last<-2){
                temp = -2;
            }
            */

            //code to "autotune" temp based on setting (modal, pentatonic or chromatic)
            if(tonality=="modal"){
                if(temp == -2){
                    temp = 55;
                } else if(temp == -1){
                    if(mode == 1|| mode ==2||mode==4||mode==5){
                        temp = 57;
                    } else if(mode == 3||mode==6){
                        temp = 56;
                    }
                } else if(temp == 0){
                    if(mode == 1||mode==4){
                        temp = 59;
                    } else if(mode == 2||mode==3||mode==5||mode==6) {
                        temp = 58;
                    } 
                } else if(temp == 1){
                    temp = 60;
                } else if(temp == 2){
                    if(mode == 1||mode==2||mode==4||mode==5||mode==6){
                        temp = 62;
                    } else if(mode == 3){
                        temp = 61;
                    }
                } else if(temp == 3){
                    if(mode == 1||mode==4||mode==5){
                        temp = 64;
                    } else if(mode == 2||mode==3||mode==6){
                        temp = 63;
                    }
                } else if(temp == 4){
                    if(mode == 1||mode==2||mode==3||mode==5||mode==6){
                        temp = 65;
                    } else if(mode == 4){
                        temp = 66;
                    }
                } else if(temp == 5){
                    temp = 67;
                } else if(temp == 6){
                    if(mode == 1||mode==2||mode==4||mode==5){
                        temp = 69;
                    } else if(mode == 3||mode==6){
                        temp = 68;
                    }
                } else if(temp == 7){
                    if(mode == 1||mode==4){
                        temp = 71;
                    } else if(mode == 2||mode==3||mode==5||mode==6){
                        temp = 70;
                    }
                } else if(temp == 8){
                    temp = 72;
                } else if(temp == 9){
                    if(mode == 1||mode==2||mode==4||mode==5||mode==6){
                        temp = 74;
                    } else if(mode == 3){
                        temp = 73;
                    }
                } else if(temp == 10){
                    if(mode == 1||mode==4||mode==5){
                        temp = 76;
                    } else if(mode == 2||mode==3||mode==6){
                        temp = 75;
                    }
                } 
                //make the first note a tonic
                if(i==2){
                    if(genes[2]<0.5){
                        temp = 60;
                    } else {
                        temp = 72;
                    }
                }
                //make the last note usually a tonic but sometimes a dominant 
                //this index math is confusing because the notenum is a float (maybe fix that ya lazy id)
                if(i==floor(notenum)*2+2){
                    if(genes[floor(notenum)*2+2]<0.33){
                        temp = 60;
                    } else if(genes[floor(notenum)*2+2]<0.66){
                        temp = 72;
                    } else {
                        if(genes[floor(notenum)*2+2]<0.83){
                            temp = 67;
                        } else {
                            temp = 55;
                        }
                    }
                }
            } else if (tonality=="chromatic"){
                temp = round(map(temp, lowrange, highrange, 55, 77))
            }
            //for p5.sound sequencer:
            this.pattern.push(temp);
            this.pitches.push(temp);
            //for TinyMusic sequencer:
            var tempstring = MIDIUtils.noteNumberToName( temp );//convert 
            tempstring = tempstring.replace("-", "");//get rid of the - in between note and octave
         
            
            //deciphering what the rhythm's to be! based on the second gene you can have 4 options,
            //which don't really correspond to any metric concept but are probably best understood 
            //on a scale from least complicated to most complicated
            //remember that this.durations[] is only for midi rendering. 
            
            if(!rlocktoggle){//r lock is the rythmic homophony setting
            if(genes[1]<0.25){ //'full' syncopation, four possibilities 
                if(genes[i+1]<0.25){
                    this.pattern.push(0);
                    this.durations.push('4');
                    this.tinystring = tempstring.concat(' q');
                } else if (genes[i+1]<0.5){
                    this.pattern.push(0,0);
                    this.durations.push('d4');
                    this.tinystring = tempstring.concat(' qe');
                } else if (genes[i+1]<0.75){
                    this.pattern.push(0,0,0);
                    this.durations.push('2');
                    this.tinystring = tempstring.concat(' h');
                } else {
                    this.durations.push('8');
                    this.tinystring = tempstring.concat(' e');
                }
            } else if(genes[1]<0.5){ //'partial' syncopation, three possibilities
                if(genes[i+1]>0.333 && genes[i+1]<0.666){
                    this.pattern.push(0);
                    this.durations.push('4');
                    this.tinystring = tempstring.concat(' q');
                } else if (genes[i+1]>0.666){
                    this.pattern.push(0,0);
                    this.durations.push('d4');
                    this.tinystring = tempstring.concat(' qe');
                } else {
                    this.durations.push('8');
                    this.tinystring = tempstring.concat(' e');
                }
            } else if(genes[1]<0.75){ //two possibilities, one note and 1/2 note
                if(genes[i+1]>0.5){
                    this.pattern.push(0);
                    this.durations.push('4');
                    this.tinystring = tempstring.concat(' q');
                } else if (genes[i+1]<0.5){
                    this.pattern.push(0,0,0);
                    this.durations.push('2');
                    this.tinystring = tempstring.concat(' h');
                } 
            } else { //rhythmic homophony 
                this.pattern.push(0);
                this.durations.push('4');
                this.tinystring = tempstring.concat(' q');
            }
        } else if (rlocktoggle){
            this.pattern.push(0);
                this.durations.push('4');
                this.tinystring = tempstring.concat(' q');
        }
        
        this.tinypattern.push(this.tinystring);    
        }
        //print(this.tinypattern);
        this.convertDurations();
        
        //println(this.pattern);
        //println(mode);
        //stick it all in a sequencer object 
        //this.pphrase = new p5.Phrase('chanson', this.sound, this.pattern);
        //this.ppart = new p5.Part();
        //this.ppart.addPhrase(this.pphrase);
        //  part.removePhrase('chanson');
        // phrase = new p5.Phrase('chanson', this.sound, this.pattern);
        
        // part.addPhrase(phrase);
    } 
    
  
    
    
    this.display = function(order) {
    //stroke(0.25);
    noStroke();
    fill(140, 140, 100);
    rect(this.x, this.y, width, height/popmax);
    
    if (this.willibeaparent) {
        fill(0, 204, 204);
    } else if (this.rolloverOn) {
        fill(140, 140, 100);
    }
    else {
        var a = map(order, 1, popmax, 80, 255);
        fill(255, a);
    }
    rect(this.x, this.y, width, height/popmax);
    
    noFill();
    stroke(140, 140, 100);
    //worm
    strokeWeight(height/popmax*0.618);
    // beginShape();
    // for(var i=0; i<this.worm.length; i+=2){
    //     var x = this.worm[i];
    //     var y = this.worm[i+1];
    //     curveVertex(x, y);
    // }
    
    // endShape();
    var b = map(order, 1, popmax, 255, 80);
    stroke(255,b);
    beginShape();
    for(var i=0; i<this.worm.length; i+=2){
        var x = this.worm[i];
        var y = this.worm[i+1];
        curveVertex(x, y);
    }
    
    endShape();
    noStroke();
    
    var schema = this.pattern;
    //making an array with only pitched notes (no rests) turned into countnumbers. 
    //every time the 'sound' synthesis function is called it counts up, allowing us to keep track of which note is playing,
    //which allows us to display it accordingly. 
    var countup = []
    var c = 0;
    for(var i=0; i<schema.length; i++){
        if (!schema[i]==0){
            countup.push(c);
            c++;
        } else if (schema[i]==0){
            countup.push(0);
        }
    }

    for(var r=0; r<schema.length; r++){
        push();
        translate(this.x+((width)/schema.length)*r+20, this.y+height/popmax/2);
        //if this note is playing, draw it white, otherwise draw it black
        if(count==countup[r] && this.rolloverOn){
            translate(0, sin(motion*70));
            fill(0);
            motion--;
            }else{
            fill(120); 
            }
        //worm math
        if(this.worm.length/2 < notenum){
            if(schema[r]>0){
                
                var wormx = this.x+((width)/schema.length)*r+20
                var wormy = (this.y+height/popmax/2)+(map(schema[r], 55, 76, height/popmax/4, (height/popmax/4)*-1));
                this.worm.push(wormx);
                this.worm.push(wormy)
                //println(this.worm);
                //println("thatwasaworm");
            }
        }
        
        ellipse(0, map(schema[r], 55, 76, height/popmax/4, (height/popmax/4)*-1), schema[r]/4, schema[r]/4);
        pop();
        
    
    }
    
    }
    
    this.rollover = function(mx, my) {
    if (mx>this.x && mx<this.x+width && my>this.y+5 && my<this.y+height/popmax) {
      this.rolloverOn = true;
    } else {
      this.rolloverOn = false;
    }
    if (!this.playing && this.rolloverOn){
        this.decode();
        //bpm = basicsliders[2].getvalue();
        // part.setBPM(bpm);
        count=0;
        // phrase = new p5.Phrase('chanson', this.sound, this.pattern);
        // part.addPhrase(phrase);
        
        //the above sequencing operations are for p5.sound, which isn't working at the moment.
        //they're still being used to trigger visuals but the below TinyMusic sequence is actually making the audio.
        // sequence = new TinyMusic.Sequence( ac, bpm*2, this.tinypattern);
        // sequence.loop = false;
        // sequence.staccato = 0.1;
        // sequence.waveType = 'sine';
        // sequence.smoothing = 0.1;
        // sequence.gain.gain.value = basicsliders[0].getvalue();
        // // part.start();
        // sequence.play();
        this.convertDurations();
        this.schedule();
        
        
        this.playing = true;
    } else if (!this.rolloverOn && this.playing){
        
        // part.noLoop();
        // part.stop();
        // part.removePhrase('chanson');
        
        //sequence.stop();
        this.clearSchedule();
        
        //the next three lines are only neccisary because .stop() only pauses and doesn't cue it pack to zero!  
        //part = new p5.Part();
        //bpm = basicsliders[2].getvalue();
        //part.setBPM(bpm);
        //part.addPhrase(phrase);
        //println("stopped!");
        count = 1;
        c = 0;
        this.playing = false;
    }
  }
  
  this.clicked = function(){
      if (!this.willibeaparent){
        this.fitness = 50;
        this.willibeaparent = true;
      //println("u picked me :')      " + this.fitness);
      } else if (this.willibeaparent){
          this.fitness = 1;
          this.willibeaparent = false;
          //print("i thot u liked me :'(       " + this.fitness)
      }
  }
  
  this.schedule = function(){
    if(loaded){
    print(this.durs);
    durations = this.durs;
      this.timeouts = [];
      voice.play(this.pitches[0], ac.currentTime, {gain:gain}).stop(ac.currentTime + this.milliseconds[0]/1000);
      //gotta use global variables here so the timeout functions can access them *shrug*
      pitches = this.pitches;
      for(var i=0; i<this.milliseconds.length; i++){
            var when = this.milliseconds[i];
            this.timeouts.push(setTimeout(function(){count++;
                var pitch = pitches[count];
                dur = durations[count]/1000;
                print(dur);
                voice.play(pitch, ac.currentTime, {gain:gain}).stop(ac.currentTime + dur);
            }, when));
        }
    }
  }
  
  this.clearSchedule = function(){
      for (var i=0; i<this.timeouts.length; i++) {
        clearTimeout(this.timeouts[i]);
        }
  }
  
  this.convertDurations = function(){ //convert duration array into delta time array
      this.milliseconds = []; //clear
      this.durs = [];
      //bpm = basicsliders[2].getvalue();
      var eighth = 60000/bpm/4;

      
      
      //print(eighth);
      for(var i=0; i<this.durations.length; i++){
          var delta = this.durations[i];
          
          if(delta == '2'){
              delta = eighth*4;
          } else if (delta == '4'){
              delta = eighth*2;
          } else if (delta == 'd4'){
              delta = eighth*3;
          } else if (delta == '8'){
              delta = eighth;
          }
          this.durs.push(delta);
          if(i>0){
              delta = delta+this.milliseconds[i-1];
          }
          this.milliseconds.push(delta);
          
      }
      //print(this.milliseconds);
  }
  
 
  
}

