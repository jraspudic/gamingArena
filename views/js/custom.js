/* Nav */

$(document).ready(function(){
   
    'use strict';
    
    $(window).scroll(function() {
        
        'use strict';
        
        if($(window).scrollTop() < 70 ) {
            
            $('.navbar').css ({
               'margin-top': '0px',
                'opacity': '1'
                
            });
            
            $('.navbar-default').css({
                'background-color': 'rgba(59, 60 ,59, 0.3)'
                
            });
            
        } else {
            
            $('.navbar').css ({
               'margin-top': '0px',
                'opacity': '1',
                
                
            });
            
            $('.navbar-default').css({
                'background-color': 'rgba(59, 59 , 59, 1)',
                'border-color': '#444',
                
                
            });
         
        }
       
        
    });
    
    
});
//=========Scroll==================================
$(document).ready(function() {
    
    'use strict';
   
    
    $('.nav-item, #scroll-to-top, .btn-sazn').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
    
    
});


/*Activni u meniu*/
$(document).ready(function(){
    
    'use strict';
    
    $('.navbar-nav li a').click(function(){
        
       'use strict';
        $('.navbar-nav li a').parent().removeClass("active");
        
        $(this).parent().addClass("active");
        

        
    });    
    
});

