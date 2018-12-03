function regvalidation() {
     console.log("povezan");
    var var_user= document.getElementById('id_username').value.replace(/^\s+/, '').replace(/\s+$/, '');
    var var_email= document.getElementById('id_email').value.replace(/^\s+/, '').replace(/\s+$/, '');
    var var_pass= document.getElementById('id_pass').value;         
    var var_cpass= document.getElementById('id_confim').value;
    
               if(var_user==""){
                   clearBordersAndWarnings();
                   document.getElementById('id_username').style.border = "1px solid red";
                   document.getElementById('username_span').innerHTML="*Molimo unesite ime";
                   return false;
                   
               }
               else {
                    document.getElementById('id_username').style.border = "0px";
                   document.getElementById('username_span').innerHTML="";
               }   
                
                if(!validateEmail(var_email)){
                   clearBordersAndWarnings2();
                   document.getElementById('id_email').style.border = "1px solid red";
                   document.getElementById('email_span').innerHTML="*Molimo unesite valjanu e-mail adresu";
                   return false;
               }
               else {
                    document.getElementById('id_email').style.border = "0px";
                    document.getElementById('email_span').innerHTML="";
               } 
                   
               if(var_pass==""){
                   clearBordersAndWarnings3();
                   document.getElementById('id_pass').style.border = "1px solid red";
                   document.getElementById('pass_span').innerHTML="*Molimo unesite lozinku";
                   clearPasswordFields();
                   return false;
                }
                else if(var_pass.length < 6){
                   clearBordersAndWarnings3();
                   document.getElementById('id_pass').style.border = "1px solid red";
                   document.getElementById('pass_span').innerHTML="*Molimo unesite lozinku s minimalno 6 karaktera";
                   clearPasswordFields();
                   return false; 
                }
                else{
                   document.getElementById('id_pass').style.border = "0px";
                   document.getElementById('pass_span').innerHTML="";
                }
                
                if(var_cpass==""){
                    document.getElementById('id_confim').style.border = "1px solid red";
                    document.getElementById('confim_span').innerHTML="*Molimo potvrdite lozinku";
                    return false;
                }
                else if(var_pass != var_cpass){
                    clearPasswordFields();
                    document.getElementById('id_confim').style.border = "1px solid red";
                    document.getElementById('id_pass').style.border = "1px solid red";
                    document.getElementById('confim_span').innerHTML="*Neispravo potvrđena lozinka";
                    return false;
                }
              
                   
                return true;
  }
  
  function clearPasswordFields(){
      document.getElementById('id_pass').value= "";
      document.getElementById('id_confim').value= "";
  }
  
  function clearBordersAndWarnings(){
          document.getElementById('id_email').style.border = "0px";
          document.getElementById('email_span').innerHTML="";
          document.getElementById('id_pass').style.border = "0px";
          document.getElementById('pass_span').innerHTML="";
          document.getElementById('id_confim').style.border = "0px";
          document.getElementById('confim_span').innerHTML="";
  }
  
  function clearBordersAndWarnings2(){
          document.getElementById('id_pass').style.border = "0px";
          document.getElementById('pass_span').innerHTML="";
          document.getElementById('id_confim').style.border = "0px";
          document.getElementById('confim_span').innerHTML="";
  }
  
  function clearBordersAndWarnings3(){
          document.getElementById('id_confim').style.border = "0px";
          document.getElementById('confim_span').innerHTML="";
  }
  
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
  
  
  