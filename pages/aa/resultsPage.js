By = require('selenium-webdriver').By;
Promise = require('promise');

function openCalendar(index) {
    driver.findElement(By.id("calTabLink_" + index)).click();
}

function getAllAwardsHeaders(){
	return driver.findElements(By.css(".legend_w6"));
}

function getClassName(awardsHeaders){
// 0 - Economy SAAver
	return awardsHeaders[0].getAttribute('class');
}

function checkResultsOW() {
    return getAllAwardsHeaders()
        .then(getClassName)
        .then(lookPossibleAvailableAwardsForOutbound)
        .then(lookAvailableAwards);
}

function lookPossibleAvailableAwardsForOutbound(className){
	return lookPossibleAvailableAwards(true, className);
}

function lookPossibleAvailableAwardsForInbound(className){
	return lookPossibleAvailableAwards(false, className);
}

function lookPossibleAvailableAwards(isOutbound, className) {
	var LEG_INDEX = isOutbound ? 0 : 1;
	var LEG_TXT = isOutbound ? "outbound" : "inbound";
    if (className.indexOf("caAwardInactive") > -1) {
        return Promise.reject("Award NOT AVAILABLE for " + LEG_TXT + " flight");
    } else {
        openCalendar(LEG_INDEX);
        return driver.findElements(By.css("#calContainer_" + LEG_INDEX + " li:not(.header) dl:not(.inactive)"));
    }
}

function lookAvailableAwards(possibleAwards) {
    results = new Array();

    for (i = 0; i < possibleAwards.length; i++) {
        var textinside;
        possibleAwards[i].getText().then(function(elTxt) {
            textinside = elTxt.replace(/\n/g, "-");;
        });

        possibleAwards[i].getAttribute('class').then(function(className) {

            if (className.indexOf('nodata') > -1) {
                // console.log("class nodata... skipping...");
            } else {
                results.push(textinside);
            }
        });
    }
    return Promise.resolve(results);
}

function checkResultsRT() {

    var awards_promise = driver.findElements(By.css(".legend_w6"));

    return awards_promise.then(function(awards) {

        var DESIRED_AWARD_INDEX = 0;
        // 0 - Economy MilesSAAver
        // 1 - Economy AAnytime

        awards[DESIRED_AWARD_INDEX].getText().then(function(txt) {
            console.log("Award[" + DESIRED_AWARD_INDEX + "]: " + txt);
        });

        return awards[DESIRED_AWARD_INDEX].getAttribute('class').then(function(className) {

            if (className.indexOf("caAwardInactive") > -1) {
                return Promise.reject("Award NOT AVAILABLE for outbound flight");
            } else {
                // open full calendar
                openCalendar(0);

                available_awards_promise = driver.findElements(By.css("#calContainer_0 li:not(.header) dl:not(.inactive)"));

                return available_awards_promise.then(function(elements) {
                    results_outbound = new Array();

                    for (i = 0; i < elements.length; i++) {

                        var textinside;
                        elements[i].getText().then(function(elTxt) {
                            textinside = elTxt.replace(/\n/g, "-");;
                        });

                        elements[i].getAttribute('class').then(function(className) {

                            if (className.indexOf('nodata') > -1) {
                                // console.log("class nodata... skipping...");
                            } else {
                                results_outbound.push(textinside);
                            }
                        });

                    }
                    console.log("OUTBOUND: " + results_outbound.toString());



                    //inbound results
                    return awards[DESIRED_AWARD_INDEX + 6].getAttribute('class').then(function(className) {
                        if (className.indexOf("caAwardInactive") > -1) {
                            return Promise.reject("Award NOT AVAILABLE for inbound flight");
                        } else {


                            openCalendar(1);

                            available_awards_promise = driver.findElements(By.css("#calContainer_1 li:not(.header) dl:not(.inactive)"));

                            return available_awards_promise.then(function(elements) {
                                results_inbound = new Array();

                                console.log("inboud elements " + elements.length);

                                for (i = 0; i < elements.length; i++) {

                                    var textinside;
                                    elements[i].getText().then(function(elTxt) {
                                        textinside = elTxt.replace(/\n/g, "-");;
                                    });

                                    elements[i].getAttribute('class').then(function(className) {
                                        console.log("element: " + textinside);

                                        if (className.indexOf('nodata') > -1) {
                                            console.log("class nodata... skipping...");
                                        } else {
                                            results_inbound.push(textinside);
                                        }
                                    });

                                }
                                console.log("inbound... " + results_inbound.toString());
                                console.log("OUTBOUND adentro: " + results_outbound.toString());
                                results_outbound.push("|")
                                console.log("TOTAL 1 adentro: " + results_outbound.toString());
                                results_outbound.push(results_inbound);
                                console.log("TOTAL 2 adentro: " + results_outbound.toString());
                                return results_outbound;

                            });
                        }

                    });
                });
            }
        });
    });
}

module.exports.getResultsOW = checkResultsOW;
module.exports.getResultsRT = checkResultsRT;