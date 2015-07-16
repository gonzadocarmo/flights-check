By = require('selenium-webdriver').By;

function searchOneWay(ORIGIN, DESTINATION, DEPARTURE_DATE){
    return search('OW', ORIGIN, DESTINATION, DEPARTURE_DATE);
}

function searchRoundTrip(ORIGIN, DESTINATION, DEPARTURE_DATE, RETURN_DATE) {
    return search('RT', ORIGIN, DESTINATION, DEPARTURE_DATE, RETURN_DATE);
}

function search(flightType, ORIGIN, DESTINATION, DEPARTURE_DATE, RETURN_DATE) {

    var URL = 'http://www.aa.com/reservation/awardFlightSearchAccess.do';
    var IS_ROUND_TRIP = flightType == "RT";

    return driver.get(URL).then(function() {

        trip_type_id = IS_ROUND_TRIP ? "awardFlightSearchForm.tripType.roundTrip" : "awardFlightSearchForm.tripType.oneWay";
        var trip_type = driver.findElement(By.id(trip_type_id));
        trip_type.click();

        var origin_apt = driver.findElement(By.id("awardFlightSearchForm.originAirport"));
        origin_apt.sendKeys(ORIGIN);

        var destination_apt = driver.findElement(By.id("awardFlightSearchForm.destinationAirport"));
        destination_apt.sendKeys(DESTINATION);

        //awardFlightSearchForm.datesFlexible.true
        // var dates_type = driver.findElement(By.id("awardFlightSearchForm.datesFlexible.true"));
        // dates_type.click();

        var origin_month = driver.findElement(By.id("awardFlightSearchForm.flightParams.flightDateParams.travelMonth"));
        origin_month.click();
        origin_month.sendKeys(DEPARTURE_DATE.substring(3));

        var origin_day = driver.findElement(By.id("awardFlightSearchForm.flightParams.flightDateParams.travelDay"));
        origin_day.click();
        origin_day.sendKeys(parseInt(DEPARTURE_DATE.substring(0,2)));

        if (IS_ROUND_TRIP) {
            var destination_month = driver.findElement(By.id("awardFlightSearchForm.returnDate.travelMonth"));
            destination_month.click();
            destination_month.sendKeys(RETURN_DATE.substring(3));

            var destination_day = driver.findElement(By.id("awardFlightSearchForm.returnDate.travelDay"));
            destination_day.click();
            destination_day.sendKeys(parseInt(RETURN_DATE.substring(0,2)));
        }


        // var pax_adult = driver.findElement(By.id("awardFlightSearchForm.adultPassengerCount"));
        // pax_adult.click();
        // pax_adult.sendKeys("2");

        // var cabin_type = driver.findElement(By.id("awardFlightSearchForm.awardCabinClassOptions"));
        // cabin_type.sendKeys("Economy");
        /*  cabin
        E - Economy
        B - Business
        P - First */

        // var award_type = driver.findElement(By.id("awardFlightSearchForm.awardTypes"));
        // award_type.sendKeys("MileSAAver");
        /* award type
        M - miles saver
        A - anytime */

        return driver.findElement(By.id("awardFlightSearchForm.button.go")).click();
    });
}


module.exports.searchOW = searchOneWay;
module.exports.searchRT = searchRoundTrip;