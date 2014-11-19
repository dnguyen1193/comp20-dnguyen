Assignment 3: Where in the World
README.md

I created a web application that has the following features:
- POST /sendLocation API that submits a check-in using
cross origin resource sharing, allowing the check-in to come from any domain. It required login, lat, and lng datafields to submit the check-in information
to a "locations" database and returns the last 100 student check-ins sorted
by descending timestamp, as well as an empty character array.

- GET /locations.json API that will query a login name in the database and return all the records it finds for that login in descending timestamp order. Cross origin resource sharing is also enabled for this API

- / the home root that creates an HTML file will a list of all the records found in the database, displaying it as students who have been seen at (lng, lat) at a certain timestamp. No additional CSS or Javascript was used to format the page.

- GET /redline.json API that returns a live copy of the JSON string from the developer MBTA website. Cross-origin resource sharing is enabled for this to work.

The extra credit (reverse geolocation) was not implemented.

I worked with Nga Pham on parts 1 and 2 of this assignment (the POST and GET //locaions.json) briefly, and also discussed the assignment with Gabby Cella and Anzu Hakone.

Approximately 14 hours were spent working on this project.