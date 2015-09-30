Things in Progress/Accomplished Since Last Status Report:
- A bootstrap framework has been pushed to the github repository for everyone
  to use.
- With assignment 3 and lab 8 out, we've started discussing better ways of
  storing data. Rather than use SQL, we will be using Nodejs with Mongodb
  to store data backend. Things that we've discussed storing is information
  relevant to a user.
  Currently, the following fields can be stored in the MongoDB at
  https://desolate-wave-5677.herokuapp.com/
	- Login
	- Password
	- Name
	- E-mail
	- Number of Points
        - Profile picture
- We've also discussed using local storage to store gym check-in times and
  check-out times. Only calculate the points and add that to the database.
- For the check-in page, use a Google map API that has markers for different
  gym locations people can check into.

Things to get done by the next status report:
- Compile links for meditation page (zen videos), get filter working
- Start setting up database
- Look into using local storage to calculate time a user was at a gym

Goals moving forward/Challenges we're anticipating:
- How do we actually setup a Mongo database? 
  (was given to us for last assignment)
- Password encryption, possibly? Security issues?
- How do we check to make sure they've actually watched the entire video
  and accurately give them points?
