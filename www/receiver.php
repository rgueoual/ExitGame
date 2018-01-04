<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf8">
	<title>Téléphone</title>
	<script type="text/javascript" src="http://192.168.1.30:88/tests/json/node_modules/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="http://192.168.1.30:88/tests/json/node_modules/socket.io-client/dist/socket.io.js"></script>
	<script type="text/javascript">
		var socket = io.connect("http://192.168.1.30:3001");
		socket.on('connect', function()
			
			{
				console.log('onconnect')
				socket.on('event', function(data){console.log('onevent')}); 
				socket.on('disconnect', function(){console.log('ondisconnect')});
				socket.on("message_from_server",function(data){  //Plus tard on mettre "message_from_server_IDNFC"
					$('table').append("<tr><td>"+data.first_name+"</td><td>"+data.last_name+"</td><td>"+data.email+"</td><td>"+data.message+"</td></tr>");

				})

			}); 
		
	</script>
</head>
<body>
	<table class='table'>
		<tr>
			<th>First Name</th>
			
			<th>Last Name</th>
			
			<th>Email</th>
			
			<th>Message</th>
		</tr>
	</table>

	</div>
</body>
</html>

