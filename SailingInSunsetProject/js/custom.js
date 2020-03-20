  $(function() { /* once jquery is loaded */



      $("#submit-form").click(function(e) { /* handle login form starts */
          e.preventDefault();
          var uname = $("#uname").val();
          var password = md5($("#password").val()); /* md5 dycription of password */
          var users = DATABASE.users;

          if (uname == '') {
              alert("Username field cannot be empty");
          } else if (password == '') {
              alert("Password field cannot be empty.");
          } else {
              if (users.some(person => person.username === uname && person.password === password)) {
                  localStorage.setItem('loggedin', true); /* storing the status of user in  localstorage */
                  localStorage.setItem('username', uname);
                  window.location.href = "bartender-home.html";
              } else {
                  alert("User not found");
              }
          }

      }); /* end of login form */

      $(".logout").click(function(e) { /* logout starts here */
          e.preventDefault();
          localStorage.setItem('loggedin', false);
          window.location.href = "bartender-login.html"; /* redirect to login page */
      }); /* logout ends here */





      $('.btn-redo').click(function(e) { /* After redo button clicked */


          var actions = localStorage.getItem('latestActions') ? JSON.parse(localStorage.getItem('latestActions')) : null;

          if (!actions || actions.length < 1) { /* checking if any previous action stored on the system */
              alert('No action to Redo');
          } else {
              var last_action = actions[actions.length - 1];

              var beverages = [];
              beverages = beverages.concat(BEVERAGES.beers, BEVERAGES.wines, BEVERAGES.spirits);

              var item = search(last_action[1], beverages);

              if (itemsInStock(last_action[1])) { /* checking if the item is available in stock */
                  $('#' + last_action[0]).find('.panel-body').append('<li class="draggable-item" id="' + item.nr + '">' + item.name + '(' + item.priceinclvat + ' SEK)</li>');

                  var ids = getAllItems($('#' + last_action[0]).find('.panel-body'));
                  localStorage.setItem(last_action[0], ids);
                  $('#' + last_action[0]).find('.amount').html(update_total(ids)); /* updaing total amount on the table */

                  actions.push([last_action[0], last_action[1]]);

                  localStorage.setItem('latestActions', JSON.stringify(actions));
                  Updatestock(last_action[1]);

              } else {
                  alert('The last item you dragged in is out of stock');
              }

          }



      }); /* redo functionlities ends here */

      // redo button click event ends



      $('.btn-undo').click(function() { /* undo starts here */


          var actions = localStorage.getItem('latestActions') ? JSON.parse(localStorage.getItem('latestActions')) : null;

          if (!actions || actions.length < 1) {
              alert('No action to Undo');
          } else {
              var last_action = actions[actions.length - 1];

              var item = last_action[1];

              $('#' + last_action[0]).find('#' + item).remove(); /* undo the last action */

              var ids = getAllItems($('#' + last_action[0]).find('.panel-body'));
              localStorage.setItem(last_action[0], ids);
              $('#' + last_action[0]).find('.amount').html(update_total(ids));

              actions.pop();

              localStorage.setItem('latestActions', JSON.stringify(actions)); /* saving the remaining actions */
              Updatestock(last_action[1]);
          }



      }); /* undo functionlities end here */

      $('.table-toggle').click(function(e) { /* Show/hide tables in bartender home page */
          e.preventDefault();
          const selector = $(this).parents('.table').attr('id');
          $('#' + selector).find('.collapse-in').toggleClass('hide');
          $('#' + selector).find('.collapse').toggleClass('hide');
          $('#' + selector).find('.panel-body-wrapper').toggleClass('hide');
          $('#' + selector).find('.panel-footer-wrapper').toggleClass('hide');
      }); /* end of Show/hide tables in bartender home page */




      $('.btn-checkout').click(function(e) { /* once checkout button is clicked */
          e.preventDefault();
          var selected_table = $('#selected-table').val();
          if (selected_table !== null && selected_table !== '') {

              resetTable(selected_table); /* rEmoving the items from the table where the payment is done */
          } else {
              alert('Please select an option from the dropdown');
          }
      });
  }); /* end of checkout */

  function getAllItems(elem) { /* get all dragged elements in each table */
      var childs = elem.children();
      var child_ids = [];
      for (i = 0; i < childs.length; i++) { /* loop through the childrens of the element */
          var item_id = $(childs[i]).attr('id');
          child_ids.push(item_id);

      }

      return child_ids;
  } /* end of get all dragged elements in each table */

  function update_total(ids) { /* Update total in each table after drag and drop */
      var total = 0;
      var data = [];
      data = data.concat(BEVERAGES.beers, BEVERAGES.wines, BEVERAGES.spirits); /* cancatetion of all the beverage objects */
      ids.forEach(id => {
          let resultObject = search(id, data);
          total = total + parseFloat(resultObject.priceinclvat);

      }); /// end of foreach
      total = total.toFixed(2);

      return total;
  } /* end of Update total in each table after drag and drop */


  function refreash() { /* Reload the dragged items in the tables after page refresh  */
      var tables = ['table1', 'table2', 'table3'];

      tables.map(function(table) {
          var table_items = localStorage.getItem(table);

          if (!table_items || table_items.length < 1) {
              table_items = [];
          } else {

              table_items = table_items.split(',');

              table_items.forEach(id => { /* loop through all the items in each table */

                  var beverages = [];
                  beverages = beverages.concat(BEVERAGES.beers, BEVERAGES.wines, BEVERAGES.spirits);

                  var item = search(id, beverages);

                  Updatestock(id);
                  $('#' + table).find('.panel-body').append('<li class="draggable-item" id="' + item.nr + '">' + item.name + '(' + item.priceinclvat + ' SEK)</li>');

                  var ids = getAllItems($('#' + table).find('.panel-body'));

                  $('#' + table).find('.amount').html(update_total(ids));



              }); // end of foreach          
          }
      });




  } /*End of reload the dragged items in the tables after page refresh  */



  search = (key, inputArray) => { /*  Search a item by specifc key. Such as nr for beers   */
      for (let i = 0; i < inputArray.length; i++) {
          if (inputArray[i].nr === key) {
              return inputArray[i];
          }
      }
  } /* end of  Search a item by specifc key. Such as nr for beers   */



  function getQtyByNr(nr) { /* Get the counts of remaining items in the stock   */
      var items = DATABASE.inventory;
      var obj = $.grep(items, function(item) { return item.nr === nr; })[0];
      return obj.quantity;
  } /*end of get the counts of remaining items in the stock   */



  function Updatestock(nr) { /* Update stock after each item is dragged */


      let stock_counts = getQtyByNr(nr);
      var counts = 0;
      var items = localStorage.getItem('latestActions') ? JSON.parse(localStorage.getItem('latestActions')) : null;
      if (items) {

          items.forEach(function(item) {

              if (nr == item[1]) {
                  counts++;
              }

          });

      }
      if (counts >= stock_counts) { /* checking if item is still available in stock */
          $('div.bar-menu #' + nr + ' .' + nr + '-qty').html(0);
          var status_text = '<span class="out-of-stock">Out of stock</span>';
          $('div.bar-menu #' + nr + ' .in-stock').replaceWith(status_text);


      } else { /* if all the items are sold out*/

          $('div.bar-menu #' + nr + ' .' + nr + '-qty').html(stock_counts - counts);
          var status_text = '<span class="in-stock">In stock</span>';
          $('div.bar-menu #' + nr + ' .out-of-stock').replaceWith(status_text);

      }

  } /*end of  update stock after each item is dragged */


  itemsInStock = (nr) => { /* Check availablity of an item in the stock comparing the number of sold and in stock */

      let stock_counts = getQtyByNr(nr);
      var items = localStorage.getItem('latestActions') ? JSON.parse(localStorage.getItem('latestActions')) : null;
      var counts = 0;
      if (items) {

          items.forEach(function(item) { /* counting the total sold items of each beverage*/

              if (nr == item[1]) {
                  counts++;
              }

          });
      }
      return stock_counts - counts;

  } /* end of function */


  function resetTable(selected_table) { /* this works for restting the tables after checkout */

      if (selected_table === 'table1' || selected_table === 'table2' || selected_table === 'table3') { /* if table1 or table 2 or table 3 is selected */
          var table_items = localStorage.getItem(selected_table);
          localStorage.removeItem(selected_table);
          $('#' + selected_table).find('.panel-body').html('');
          latestActions = localStorage.getItem('latestActions') ? JSON.parse(localStorage.getItem('latestActions')) : null;
          if (latestActions === null) {
              return;
          }
          latestActions = latestActions.filter(function(action) { /* filtering the paid items from the list of dragged and droped items */
              return action[0] !== selected_table;
          });

          localStorage.setItem('latestActions', JSON.stringify(latestActions));

          if (!table_items || table_items.length < 1) {
              table_items = [];
          } else {

              table_items = table_items.split(','); /* convert the comma separated string to array string */

              table_items.forEach(id => {
                  Updatestock(id);


              });
          }
          $('#' + selected_table).find('.panel-body').html('');

      } else { /* if all is selected */


          localStorage.removeItem('latestActions');




          var tables = ['table1', 'table2', 'table3']; /* to make the process dynamic and loop through all the tables */

          tables.map(function(table) {
              var table_items = localStorage.getItem(table);
              localStorage.removeItem(table);
              $('#' + table).find('.panel-body').html('');
              if (!table_items || table_items.length < 1) {
                  table_items = [];
              } else {

                  table_items = table_items.split(',');

                  table_items.forEach(id => {
                      Updatestock(id); /* updating the stock information of sold items */

                  });
              }


          });

          refreash();

      }


  } /* End of the function */