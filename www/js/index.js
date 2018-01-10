var socket = io.connect("http://192.168.43.100:3001");
	
	socket.on('connect', function()
			
			{
				console.log('onconnect');
				alert("is connected");
				socket.on('event', function(data){console.log('onevent')}); 
				socket.on('disconnect', function(){console.log('ondisconnect')});
				socket.on("message_from_server",function(data){
					alert(data);
				})

			});
