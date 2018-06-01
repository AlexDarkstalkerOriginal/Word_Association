var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));

var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n1gdJ4bvPPiREzHS5z5uafJkoXQA9gtcZ7N";


$('.popup').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
});   
$('.transaction').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
});   

window.onload = function(){         
  if(typeof(webExtensionWallet) === "undefined"){     
        $(".noExtension").show();   
        $(".content").hide();
    }else{
    }
};  

$(document).ready(function(){
    var to = dappAddress;
    var value = 0;
    var callFunction = 'read';
    var callArgs = "[]";    
    nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbRead              
    });    
})

function cbRead(resp) {
  console.log('TYPEOF ' + typeof(resp));    
  console.log('RESULT ' + resp);
  try {
    var real_parse = JSON.parse(resp.result);   
  } catch (err) {
    return false;
  }

  for (var i = (real_parse.length - 1); i > (real_parse.length - 9); i--) {
    // if (real_parse[i].word) {      
      console.log('HUI POLETELI ' + real_parse[i].word); 
      switch(i) {
        case (real_parse.length - 8): 
          $('.three').html(real_parse[i].word);
          break;

        case (real_parse.length - 7): 
          $('.four').html(real_parse[i].word);
          break;

         case (real_parse.length - 6):  
          $('.five').html(real_parse[i].word);
          break;

        case (real_parse.length - 5):  
          $('.six').html(real_parse[i].word);
          break;

        case (real_parse.length - 4): 
          $('.seven').html(real_parse[i].word);
          break;

        case (real_parse.length - 3): 
          $('.eith').html(real_parse[i].word);
          break;

         case (real_parse.length - 2): 
          $('.nine').html(real_parse[i].word);
          break;

        case (real_parse.length - 1): 
          $('.ten').html(real_parse[i].word);
          $('.ten').attr('data-nonce', real_parse[i].nonce);
          break;


        default:          
          break;
      }      
  
    
  }

  $('#history ul').html('');
  real_parse.reverse();
  $.each(real_parse,function(index,value){  
    $('#history ul').append('<li>' + real_parse[index].word + ' <span>by <value>' + real_parse[index].from + '</value></span></li>');      
  })      
}


function cbAdd(resp) {
  console.log(JSON.stringify(resp));
    hash_value = resp.txhash;    

    if (resp.txhash == undefined) {
     } else {
       $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');     
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {
        console.log('recepient: ' + JSON.stringify(receipt));
        result_trans = receipt.status;
        console.log('doing doing ');
        if (result_trans == 1) {
          $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
          setTimeout(function(){ $('#transaction button').trigger('click') } , 2000);                    
          clearInterval(reload_trans);          
            var to = dappAddress;
            var value = 0;
            var callFunction = 'read';
            var callArgs = "[]";    
            nebPay.simulateCall(to, value, callFunction, callArgs, { 
              listener: cbRead              
            });    
            $('.your_word').val('');
        } else if (result_trans == 2) {
          $('#transaction .status_trans').html('<p style="color: blue"> pending </p>');
        } else {
          $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
          setTimeout(function(){ $('#transaction button').trigger('click') } , 2000);          
          clearInterval(reload_trans);          
        }
    })}, 1000);    
}


$('.add').click(function(){
  var to = dappAddress;
  var value = 0;
  var callFunction = 'push';  
  var assoc = $('.your_word').val();
  var nonce_last = $('.ten').attr('data-nonce');
  var args = [];
  args.push(assoc);  
  args.push(nonce_last);  
  var callArgs = JSON.stringify(args);    
  nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbAdd
  });     
})