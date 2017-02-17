'use strict';


var express 	=		 	require('express');
var router 		= 			express.Router();
var passport 	= 			require('passport');
var bycrypt 	= 			require('bcrypt');



module.exports = function (router) {
  
    router.get('/bot', function (req, res) {
        var sentence = req.query.sentence;
        console.log(sentence);

        //add a parts of speach tagger

        res.send("hello");
    });
    
};
