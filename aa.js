var webdriver = require('selenium-webdriver');

var searchPage = require('./pages/aa/searchPage.js');
var resultsPage = require('./pages/aa/resultsPage.js');


// VARIABLES DEFINITION
var ORIGIN = "EZE";
var DESTINATION = "DFW";
var DEPARTURE_DATE = "10-Aug";
var RETURN_DATE = "20-Aug";
// VARIABLES DEFINITION

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

	searchPage.searchOW(driver, ORIGIN, DESTINATION, DEPARTURE_DATE).then(function(){
	
		resultsPage.getResults(driver).then(function(results){
			// console.log(results);
			if(results.length > 0){
				console.log("Sending email...");
				//EMAIL NOTIFICATION
			}
			console.log ("finished!");
			driver.quit();
		});
	});