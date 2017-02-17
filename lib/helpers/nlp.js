var normalize 	=      	require('chatbot-normalizer');
var ra 					= 			require('qtypes');
var rita 				= 			require('rita');
var wordNet 		=	   		require('wordnet-magic');
var util				= 			require("util");
let nlp         =       require('nlp_compromise');
var async       =       require("async");

//db location
var wn 					= 			wordNet("./lib/helpers/data/sqlite-31.db", false);

//var text="how many leaves can I take ?";
//var text="how much salary Radha ?";
//var text="how to apply for attendance?";

var text="how much is salary of Radha ?";


//exports.nlp=function(text,bigcall){
    console.log(text);
          normalize(text).then(output => {
          	var  a=output.replaceAll('+',' ');
            //	console.log(a);
            	new ra(function(q) {
            		var question=q.classify(a);
                    var rs = rita.RiString(a);    
                    var partofspeech=rs.pos();
                    //console.log(rita);
                    //console.log(partofspeech);
                    wordArray = rita.RiTa.tokenize(a);
                    console.log(partofspeech);

          function trueform(as,callback){
                    var a="";
                      a =nlp.verb(as).conjugate();
                      callback(a.infinitive);
          }

          // really very ugly shit
            function find_symbolic_meaning(array,callback){
                  var i=0;
                  var collect=[];
                  var show=false;
                  var findsynset="";
                asyncLoop(array.length , function(loop) {
                  //console.log(array);
                          i=loop.iteration();
                          trueform(array[i],function(a){
                            wn.morphy(a,"n", function(err, synset){
                              console.log(synset);
                             try{
                              findsynset=synset[0].lemma;
                            }catch(e){
                                console.log("someproblem bit its ok");
                            }
                              //console.log(findsynset);
                              wn.fetchSynset(findsynset+".n.1", function(err, synset){
                              collect.push(synset.lexdomain);
                              loop.next();
                              }); 
                            });
                          });
                      },function(){
                        show=true;
                        callback(null,collect);
                        //console.log(collect);
                        //console.log('cycle ended');
                      },setTimeout(function(){
                        if(show==false){
                        callback(null,collect);
                        }
                       },4000)
                  );
            }


          function search_person_node(test,callback){
                    var pronoun={
                      "firstperson":['I','we','me','us','my','mine','our','ours','myself','ourselves'],
                      "secondperson":['you','your','yours','youself','youselves'],
                      "thirdperson":['he','she','it','they','him','her','them','his','him','her','hers','its','their','theirs','himself','herself','itself','themselves']
                    };

                    var result="";
                    //var test=test4;
                    for (var i = 0; i < pronoun.firstperson.length; i++) {
                      if(test[0]==pronoun.firstperson[i]){
                        //console.log("user");
                        result="user";
                      }
                    }
                    for (var i = 0; i < pronoun.secondperson.length; i++) {
                      if(test[0]==pronoun.secondperson[i]){
                        //console.log("bot");
                        result="bot";
                      }
                    }
                    for (var i = 0; i < pronoun.thirdperson.length; i++) {
                      if(test[0]==pronoun.thirdperson[i]){
                        //console.log("only managers can access");
                        result="manager";
                      }
                    }
                    if(result==""){
                      //find the name in the db for confirm the man
                      //console.log("I cant find any of them");
                      callback(null,"user");
                    }else{
                      callback(null,result); 
                    }     
              }
              
            function asyncLoop(iterations, func, callback) {
                  var index = 0;
                  var done = false;
                  var loop = {
                      next: function() {
                          if (done) {
                              return;
                          }
                          if (index < iterations) {
                              index++;
                              func(loop);
                          } else {
                              done = true;
                              callback();
                          }
                      },
                      iteration: function() {
                          return index - 1;
                      },
                      break: function() {
                          done = true;
                          callback();
                      }
                  };
                  loop.next();
                  return loop;
              }
//}
});
});


