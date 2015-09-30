

	var totalpts_caption = "Total points: ";
	var score_caption = "This week's points: ";
	var win_caption = "Matches won: ";

		window.onload = function(){ //init
						
				var username1 = localStorage.getItem("login");
				var username2;

				$.get("http://localhost:3000/profile.json?login=" + username1, function(data){
					username2 = data.match;
				}, "json");


			
				// var data;
				// var data2;
				// var data3;
				// // request.open("GET", "https://desolate-wave-5677.herokuapp.com/scores.json", true);
				// request.open("GET", "http://localhost:3000/profile.json?login=" + username1, true);
    //     		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //     		request.onreadystatechange = callback;
    //     		request.send();
			};

		function callback()
		{
			if (request.readyState == 4 && request.status == 200) {	        
				data = JSON.parse(request.responseText);

				document.getElementById('user1').innerHTML = data.login;
				document.getElementById('user2').innerHTML = data.match;
				console.log("hi");
				insertScores(data.login, data.match);
			}
			else if (request.readyState == 4 && request.status == 500) {
				console.log("Something went wrong!");					
			}
		}

		function insertScores(me, match) 
		{
			document.getElementById("score1").innerHTML = totalpts_caption + data.points + "<br>" + score_caption + data.points_w + "<br>" + win_caption + data.matches_won;

			request.open("GET", "http://localhost:3000/profile.json?login=" + match, true);
    		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    		request.onreadystatechange = callback2;
    		request.send();
		}

		function callback2()
		{
			if (request.readyState == 4 && request.status == 200) {
				data2 = JSON.parse(request.responseText);					
				document.getElementById("score2").innerHTML = totalpts_caption + data2.points + "<br>" + score_caption + data2.points_w + "<br>" + win_caption + data2.matches_won;

				var pic1 = document.getElementsByClassName("pic1");
				pic1[0].innerHTML = "<img src=" + data.image + " alt=" + data.login + " class='img-thumbnail'>";
				var pic2 = document.getElementsByClassName("pic2");
				pic2[0].innerHTML = "<img src=" + data2.image + " alt=" + data2.login + " class='img-thumbnail'>";

				var ratio1 = (data.points_w / (data.points_w + data2.points_w)) * 100;
				var ratio2 = (data2.points_w / (data.points_w + data2.points_w)) * 100;

				var success = document.getElementsByClassName("active progress-bar progress-bar-success progress-bar-striped");
				success[0].style.width = ratio1 + "%";
				var warning = document.getElementsByClassName("active progress-bar progress-bar-warning progress-bar-striped");
				warning[0].style.width = ratio2 + "%";

        		highscores();
			}
			else if (request.readyState == 4 && request.status == 500) {
				console.log("Something went wrong!");
			}
		}

		function highscores()
		{
			request.open("GET", "http://localhost:3000/highscores.json", true);
    		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    		request.onreadystatechange = callback3;
    		request.send();
		}

		function callback3()
		{
			var hs_html = "";
			if (request.readyState == 4 && request.status == 200) {
				data3 = JSON.parse(request.responseText);	

				for (var i = 0; i < data3.length; i++) {
					hs_html += "<tr> <td>" + data3[i].login + "</td>" + "<td>" + data3[i].points + "</td> </tr>";
				}
				document.getElementById("hs").innerHTML = hs_html;
			}
			else if (request.readyState == 4 && request.status == 500) {
				console.log("Something went wrong!");
			}
		}
