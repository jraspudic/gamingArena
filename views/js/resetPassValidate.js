function resetValidate() {


    var var_pass= document.getElementById('id_pass').value;         
    var var_cpass= document.getElementById('id_confim').value;
    
            
                   
               if(var_pass==""){
                   clearBordersAndWarnings();
                   document.getElementById('id_pass').style.border = "1px solid red";
                   document.getElementById('pass_span').innerHTML="*Molimo unesite lozinku";
                   clearPasswordFields();
                   return false;
                }
                else if(var_pass.length < 6){
                   clearBordersAndWarnings();
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
          document.getElementById('id_confim').style.border = "0px";
          document.getElementById('confim_span').innerHTML="";
  }