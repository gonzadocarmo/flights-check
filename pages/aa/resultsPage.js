By = require('selenium-webdriver').By;
Promise = require('promise');

function openCalendar(index) {
    var element = driver.findElement(By.id("calTabLink_" + index));
    element.getText().then(function(text) {
        if (text.indexOf("Close") == -1) {
            // console.log("clicking button to open...");
            element.click();
        }
    });
}

function checkResultsOW() {
    return getAllAwardsHeaders()
        .then(getFirstHeaderAwardCssForOutbound)
        .then(lookPossibleAvailableAwardsForOutbound)
        .then(lookAvailableAwardsForOutbound);
}

function lookPossibleAvailableAwardsForOutbound(className) {
    // console.log("lookPossibleAvailableAwardsForOutbound");
    return lookPossibleAvailableAwards(true, className);
}

function lookPossibleAvailableAwardsForInbound(className) {
    // console.log("lookPossibleAvailableAwardsForInbound");
    return lookPossibleAvailableAwards(false, className);
}

function lookPossibleAvailableAwards(isOutbound, className) {
    // console.log("--------------------lookPossibleAvailableAwards--------------------");
    // console.log("classsname: " + className);
    // console.log("isOutbound: " + isOutbound);
    var LEG_INDEX = isOutbound ? 0 : 1;
    var LEG_TXT = isOutbound ? "outbound" : "inbound"
    if (className.indexOf("caAwardInactive") > -1) {
        return Promise.reject("Award NOT AVAILABLE for " + LEG_TXT + " flight");
    } else {
        // console.log("openinig calendar...");
        openCalendar(LEG_INDEX);
        return driver.findElements(By.css("#calContainer_" + LEG_INDEX + " li:not(.header) dl:not(.inactive)"));
    }
}

function lookAvailableAwardsForOutbound(possibleAwards) {
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

function lookAvailableAwardsForInbound(possibleInboundAwards) {
    results_inbound = new Array();

    for (i = 0; i < possibleInboundAwards.length; i++) {
        var textinside;
        possibleInboundAwards[i].getText().then(function(elTxt) {
            textinside = elTxt.replace(/\n/g, "-");;
        });

        possibleInboundAwards[i].getAttribute('class').then(function(className) {
            if (className.indexOf('nodata') > -1) {
                // console.log("class nodata... skipping...");
            } else {
                results_inbound.push(textinside);
            }
        });

    }
    return Promise.resolve(results_inbound);
}

function getAllAwardsHeaders() {
    return driver.findElements(By.css(".legend_w6"));
}

function getFirstHeaderAwardCssForOutbound(headerAwards) {
    return getFirstHeaderAwardCss(headerAwards[0]);
}

function getFirstHeaderAwardCssForInbound(headerAwards) {
    return getFirstHeaderAwardCss(headerAwards[6]);
}

function getFirstHeaderAwardCss(headerAward) {
    return headerAward.getAttribute('class');
}

function checkResultsRT() {

    header_awards = new Array();
    var awards_available = new Array();

    return getAllAwardsHeaders()
        .then(function(awardsHeadersResults) {
            header_awards = awardsHeadersResults;
            return awardsHeadersResults;
        })
        .then(getFirstHeaderAwardCssForOutbound)
        .then(lookPossibleAvailableAwardsForOutbound)
        .then(lookAvailableAwardsForOutbound)
        .then(function(outboundAwardsResults) {
            // console.log(outboundAwardsResults);
            // console.log("outbound results recorded!");
            awards_available.push(outboundAwardsResults);
            return header_awards;
        })
        .then(getFirstHeaderAwardCssForInbound)
        .then(lookPossibleAvailableAwardsForInbound)
        .then(lookAvailableAwardsForInbound)
        .then(function(inboundAwardsResults) {
            awards_available.push("|");
            awards_available.push(inboundAwardsResults);
            return awards_available;
        });
}

module.exports.getResultsOW = checkResultsOW;
module.exports.getResultsRT = checkResultsRT;