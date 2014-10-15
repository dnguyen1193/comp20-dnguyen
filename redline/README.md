README
Lab 6: Where's the Train (MBTA Red Line)?

As specified by the lab, the HTML page along with its stylesheet has been edited to display a Google Map using the Google Maps JavaScript API. Using XMLHttpRequest, it tries to request and parse data from the MBTA Red Line real-time JSON data object and display where the Red Lines currently are using client-side JavaScript.

However, XMLHttpRequest cannot load the data from the MBTA Red Line real-time from the Red Line JSON API due to the Same Origin Policy. Using the XMLHttpRequest object requires that the origin the data is being requested at be the same as the origin of the data. This data comes from the MBTA. Running it on our computers', it is not possible to get the data from the JSON API, since our origin is not the MBTA website, but our own local computers. Thus, though it attempts to collect and parse the data, the XMLHttpRequest object is unable to. If we were running this from the MBTA developer's side, it would be possible to get the data and show their locations on the Google Map.


I worked on this project alone, referencing material from class as well as additional online resources including the Piazza questions asked by other students. Approximately 5 hours were spent working on this project.