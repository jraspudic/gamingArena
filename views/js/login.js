function validation() {
    var var_user =document.getElementById('id_username').value.replace(/^\s+/, '').replace(/\s+$/, '');
    var var_pass= document.getElementById('id_pass').value;           
               
               
               if(var_user==""){    
                   document.getElementById('id_username').style.border = "1px solid red";
                   document.getElementById('username_span').innerHTML="*Molimo unesite korisničko ime";
                   return  false;
               }else {
                    document.getElementById('id_username').style.border = "0px";
                   document.getElementById('username_span').innerHTML="";
               }
               
               if(var_pass==""){
                    document.getElementById('id_pass').style.border = "1px solid red";
                   document.getElementById('pass_span').innerHTML="*Molimo unesite lozinku";
                   return  false;
                }
               
         return true;      
               
    }
    
    