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




        

});