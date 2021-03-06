var webdriver = require('selenium-webdriver');

var emailService = require('./lib/emailService.js');

var searchPage = require('./pages/aa/searchPage.js');
var resultsPage = require('./pages/aa/resultsPage.js');


// VARIABLES DEFINITION
var ORIGIN = "EZE";
var DESTINATION = "DFW";
var DEPARTURE_DATE = "12-May";
var RETURN_DATE = "24-May";
// VARIABLES DEFINITION

driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();

searchPage.searchRT(ORIGIN, DESTINATION, DEPARTURE_DATE, RETURN_DATE).then(function() {
    // searchPage.searchOW(ORIGIN, DESTINATION, DEPARTURE_DATE).then(function(){

    resultsPage.getResultsRT().then(function(results) {
	// resultsPage.getResultsOW().then(function(results) {
	
		emailService.notify('aa', results, DEPARTURE_DATE, RETURN_DATE);
		// emailService.notify('aa', results, DEPARTURE_DATE);
		
		console.log("Success!");
    }, function(errorMsg) {
        console.log("Error occurred: " + errorMsg);
    })
	.then(function(){
		// driver.quit();
	});
});