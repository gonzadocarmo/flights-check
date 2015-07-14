By = require('selenium-webdriver').By;

function search(driver) {

    var awards_promise = driver.findElements(By.css(".legend_w6"));

    return awards_promise.then(function(awards) {

        var DESIRED_AWARD_INDEX = 1;
		// 0 - Economy MilesSAAver
		// 1 - Economy AAnytime

        awards[DESIRED_AWARD_INDEX].getText().then(function(txt) {
            console.log("Award[" + DESIRED_AWARD_INDEX + "]: " + txt);
        });

        return awards[DESIRED_AWARD_INDEX].getAttribute('class').then(function(className) {

            if (className.indexOf("caAwardInactive") > -1) {
                console.log("ECONOMY AA SAVER NOT AVAILABLE");
				return [];
            } else {
                // open full calendar
                driver.findElement(By.id("calTabLink_0")).click();

                available_awards_promise = driver.findElements(By.css("#calContainer_0 li:not(.header) dl:not(.inactive)"));

                return available_awards_promise.then(function(elements) {
                    results = new Array();

                    for (i = 0; i < elements.length; i++) {

                        var textinside;
                        elements[i].getText().then(function(elTxt) {
                            textinside = elTxt.replace(/\n/g, "-");;
                        });

                        elements[i].getAttribute('class').then(function(className) {

                            if (className.indexOf('nodata') > -1) {
                                // console.log("class nodata... skipping...");
                            } else {
                                results.push(textinside);
                            }
                        });

                    }
                    return results;
                });
            }
        });
    });
}

module.exports.getResults = search;