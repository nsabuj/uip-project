  $(function(){



  $("#submit-form").click(function(e){
   e.preventDefault();
   var uname=$("#uname").val();
   var password=$("#password").val();
   var users=DATABASE.users;

    if(uname==''){
     alert("Username field cannot be empty");
    }else if(password==''){
      alert("Password field cannot be empty.");
    }else{
    if(users.some(person => person.username === uname && person.password===password)){
        localStorage.setItem('loggedin', true);
        localStorage.setItem('username', uname);
        window.location.href = "index.html";
    } else{
        alert("User not found");
    }
    }

  });

        $("#logout").click(function(e){
         e.preventDefault();     
         localStorage.setItem('loggedin', false);
         window.location.href = "login.html";
        }); 



// redo button click

 $('.btn-redo').click(function(e){                   // redo starts
   

var actions=JSON.parse(localStorage.getItem('latestActions'));

if(!actions || actions.length<1){
  alert('No action to Redo');
}else{
  var last_action=actions[actions.length - 1];

  var beverages=[];
  beverages=beverages.concat(BEVERAGES.beers,BEVERAGES.wines,BEVERAGES.spirits);

  var item= search(last_action[1], beverages);

  $('#'+last_action[0]).find('.panel-body').append('<li class="draggable-item" id="'+item.nr+'">'+item.name+'('+item.priceinclvat+' SEK)</li>');

  var ids=getAllItems($('#'+last_action[0]).find('.panel-body'));
  localStorage.setItem(last_action[0], ids);
  $('#'+last_action[0]).find('.amount').html(update_total(ids));

  actions.push([last_action[0],last_action[1]]);

  localStorage.setItem('latestActions',JSON.stringify(actions));
  }


                    
 });                        /// redo ends

// redo button click event ends
        


$('.btn-undo').click(function(){                                              /// undo starts
  
           
            var actions=JSON.parse(localStorage.getItem('latestActions'));

            if(!actions || actions.length<1){
                alert('No action to Undo');
              }else{
                var last_action=actions[actions.length - 1];

                var item= last_action[1];

                $('#'+last_action[0]).find('#'+item).remove();

                var ids=getAllItems($('#'+last_action[0]).find('.panel-body'));
                localStorage.setItem(last_action[0], ids);
                $('#'+last_action[0]).find('.amount').html(update_total(ids));

                  actions.pop();

                  localStorage.setItem('latestActions',JSON.stringify(actions));
              }

                      

});              // undo ends

$('.table-toggle').click(function(e){
e.preventDefault();
const selector= $(this).parents('.table').attr('id');
$('#'+selector).find('.collapse-in').toggleClass('hide');
$('#'+selector).find('.collapse').toggleClass('hide');
$('#'+selector).find('.panel-body-wrapper').toggleClass('hide');
$('#'+selector).find('.panel-footer-wrapper').toggleClass('hide');


});


});

       function getAllItems(elem){
          var childs= elem.children();
          var child_ids=[];
            for (i = 0; i < childs.length; i++) {
             var item_id= $(childs[i]).attr('id');
             child_ids.push(item_id);

          }

          return child_ids;
       }

       function update_total(ids){
         var total=0;
         var data=[];
         data=data.concat(BEVERAGES.beers,BEVERAGES.wines,BEVERAGES.spirits);        
         ids.forEach(id => {
          let resultObject = search(id, data);
          total=total+parseFloat(resultObject.priceinclvat);
         
         });   /// end of foreach
         total=total.toFixed(2);

         return total;
       }


       function refreash(){     
           var tables=['table1','table2','table3'];

           tables.map(function(table){
            var table_items=localStorage.getItem(table);
            
          if(!table_items || table_items.length<1){
            table_items= [];
          }else{

           table_items=table_items.split(',');

          table_items.forEach(id => {

           var beverages=[];
          beverages=beverages.concat(BEVERAGES.beers,BEVERAGES.wines,BEVERAGES.spirits);

          var item= search(id, beverages);

        $('#'+table).find('.panel-body').append('<li class="draggable-item" id="'+item.nr+'">'+item.name+'('+item.priceinclvat+' SEK)</li>');

        var ids=getAllItems($('#'+table).find('.panel-body'));
         
         $('#'+table).find('.amount').html(update_total(ids));

          });    // end of foreach          
          }  
           });




       }      // end of function



        search = (key, inputArray) => {
      for (let i=0; i < inputArray.length; i++) {
      if (inputArray[i].nr === key) {
          return inputArray[i];
                       }
                 }
                   }