$(function(){
  setInterval(app.fetch,3000);
  app.init();
 //Submitting a message to the server
  app.submit.on('click', function(){
    var currentMessage = $('.inputMsg').val();
    if(currentMessage){
      app.handleSubmit(currentMessage);
    }
  })

// Creating a new room
  app.createRoom.on('click',function(){
    var newRoom = prompt("Please enter a room name:", "") || app.roomname;
    app.addRoom(newRoom);
  });

// Change username
  app.changeUsername.on('click',function(){
    var newUser = 'username=' + prompt('What is your name?', "") || 'anonymous';
    document.URL = document.URL.slice(0, document.URL.indexOf("="))+ newUser;
    window.location.search = newUser;
  })
  app.chats.on('click', '.username', function(event){
    var friendName = event.target.outerText;
    if(friendName === app.currentUserName){
      return;
    }
    app.friends.push(friendName);
    app.fetch();
  });

});

var app = {
  server:'https://api.parse.com/1/classes/chatterbox',
  rooms: {},
  currentUserName: document.URL.slice(document.URL.indexOf("=")+1),
  roomname: 'Lobby',
  friends: []
};
app.init = function(){
  app.changeUsername = $('.changeUsername');
  app.createRoom = $('.createRoom');
  app.submit = $('.submit');
  app.chats = $('#chats');
  app.addRoom(app.roomname);
};

app.send = function(message){
 $.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
    //
  },
  error: function (data) {
    console.error('chatterbox: Failed to send message');
  }
  });
};

app.fetch = function(){
  app.clearMessages();
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: "order=-createdAt",
    dataType: 'json',
    success: function(data){
      //console.log(data.results);
      data.results.forEach(app.addMessage);
    },
    error: function (data) {
      console.error('chatterbox: Failed to fetch message');
    }
  });
};

app.clearMessages = function(){
  $('#chats').html('');
};

app.addMessage = function(message){

 var $username = $('<span class="username">').text(message.username);
 var $text = $('<span class="message">').text(message.text);
 $text.addClass('friend');
 //var usernameString = "<span class = 'username'>" + message.username + "</span>";
 // va//r messageString = "<span class = 'message'>" + message.text + "</span>";
 // $('#chats').append('<div></div>');
 $('#chats').append($username);
 $('#chats').append(': ');
 $('#chats').append($text);
 $('#chats').append('<p>');
 app.populateRooms(message.roomname);
 // $('#chats :last').text(usernameString + ":" + messageString);
 //$('.user').on('click', app.addFriend(message.username));
};

app.addRoom = function(roomName){
  if(!app.rooms[roomName]){
    $('#roomSelect').append('<option>'+ roomName + '</option>');
    app.populateRooms(roomName);
  }
};

app.handleSubmit = function(string){
  var message = {};
  message.username = document.URL.slice(document.URL.indexOf("=")+1);
  message.text = string;
  message.roomname = "nnn";
  app.send(message);
};

// when room is changed, pass in parameter to app.fetch

app.populateRooms = function(roomname){
  app.rooms[roomname] = roomname;
}





