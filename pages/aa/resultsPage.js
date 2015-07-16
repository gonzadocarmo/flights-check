By = require('selenium-webdriver').By;
Promise = require('promise');

function openCalendar(index) {
    var element = driver.findElement(By.id("calTabLink_" + index));
    element.getText().then(function(text) {
        console.log("button text: " + text);
        if (text.indexOf("Close") == -1) {
            console.log("clicking button to open...");
            element.click();
        }
    });
}

function checkResultsOW() {
    return getAllAwardsHeaders()
	 .then(getClassName)
	 .then(lookPossibleAvailableAwardsForOutbound)
	 .then(lookAvailableAwards);
}

function lookPossibleAvailableAwardsForOutbound(className){
    console.log("lookPossibleAvailableAwardsForOutbound");
    return lookPossibleAvailableAwards(true, className);
}

function lookPossibleAvailableAwardsForInbound(className){
	console.log("lookPossibleAvailableAwardsForInbound");
    return lookPossibleAvailableAwards(false, className);
}

function lookPossibleAvailableAwards(isOutbound, className){
    console.log("--------------------lookPossibleAvailableAwards--------------------");
    console.log("classsname: " + className);
    console.log("isOutbound: " + isOutbound);
    var LEG_INDEX = isOutbound ? 0 : 1;
	var LEG_TXT = isOutbound ? "outbound" : "inbound"
    if (className.indexOf("caAwardInactive") > -1) {
        return Promise.reject("Award NOT AVAILABLE for " + LEG_TXT + " flight");
    } else {
        console.log("openinig calendar...");
        openCalendar(LEG_INDEX);
        return driver.findElements(By.css("#calContainer_" + LEG_INDEX + " li:not(.header) dl:not(.inactive)"));
    }
}

function lookAvailableAwardsForOutbound(possibleAwards) {
    console.log("possibleAwards.length: " + possibleAwards.length);
    console.log("possibleAwards...." + possibleAwards);

    results = new Array();

    for (i = 0; i < possibleAwards.length; i++) {
	
		console.log("current elem: " + i);
		
		var currentElement = possibleAwards[i];
		
		var class_promise = currentElement.getAttribute('class');
		// var text_promise = currentElement.getText();
		
		// class_promise.then(function(classname){
			// console.log("nombre de clase: " + classname);
			// results.push(classname);
			// return classname;
			
			 // if (className.indexOf('nodata') > -1) {
                    // console.log("class nodata... skipping...");
                // } else {
                    // var textinside;
                    // text_promise.then(function(elTxt) {
                        // textinside = elTxt.replace(/\n/g, "-");
                        // console.log("text " + i + "- " + elTxt);
                        // results.push(textinside)
                    // });
		
				// }
				
				// });
				
				
				
		class_promise
		.then(evaluateClassName)
		.then(function(response){
			console.log("aading to results...");
			results.push(response)
		})
		
	}
	
        // new Promise(function(resolve, reject) {

            

            // return possibleAwards[i].getAttribute('class').then(function(className) {
                // console.log("classname: " + i);

                // if (className.indexOf('nodata') > -1) {
                    // reject("class nodata... skipping...");
                // } else {
                    // var textinside;
                    // possibleAwards[i].getText().then(function(elTxt) {
                        // textinside = elTxt.replace(/\n/g, "-");
                        // console.log("text " + i + "- " + elTxt);
                        // resolve(textinside)
                    // });
                // }
            // });

        // }).then(function(response) {
            // results.push(response);
        // }, function(error){
			// console.log(error + " ---------------------------skipping GON....");
		// });
    // }

    // return ["111","222","3333","444"];
	return results;

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

function evaluateClassName(classname){
	
		console.log("evaluateClassName - nombre de clase: " + classname);

		if (className.indexOf('nodata') > -1) {
			console.log("class nodata... skipping...");
			// Promise.reject("class nodata... skipping... - martin");
		}
		else {
			// Promise.resolve(classname);
		}
}

function lookAvailableAwardsInbound(possibleInboundAwards) {

    results_inbound = new Array();

    console.log("inboud elements " + possibleInboundAwards.length);

    for (i = 0; i < possibleInboundAwards.length; i++) {

        var textinside;
        possibleInboundAwards[i].getText().then(function(elTxt) {
            textinside = elTxt.replace(/\n/g, "-");;
        });

        possibleInboundAwards[i].getAttribute('class').then(function(className) {
            console.log("element: " + textinside);

            if (className.indexOf('nodata') > -1) {
                console.log("class nodata... skipping...");
            } else {
                results_inbound.push(textinside);
            }
        });

    }

    return Promise.resolve(results_inbound);
}

function getAllAwardsHeaders() {
    console.log("step1 - init...");
    return driver.findElements(By.css(".legend_w6"));
}

function getClassName(headerAwards) {
    console.log("getClassName ---> value: " + headerAwards);
    return headerAwards[0].getAttribute('class');
}

function checkResultsRT() {

    header_awards = new Array();
    var awards_available = new Array();

    return getAllAwardsHeaders()
        .then(function(awardsHeadersResults) {
            header_awards = awardsHeadersResults;
            console.log("aaaaaa");
            console.log(header_awards);
            return header_awards[0];
        })
        .then(getClassName)
        .then(lookPossibleAvailableAwardsOutbound)
        .then(lookAvailableAwardsOutbound)

    .then(function(outboundAwardsResults) {
	console.log("outboundAwardsResults -....... " + outboundAwardsResults.length);
	console.log(outboundAwardsResults);
        awards_available.push(outboundAwardsResults);
		return awards_available;
        // return Promise.resolve("aaaa");
        // return 777;
    });
    // .then(getClassName(header_awards))
    // .then(lookPossibleAvailableAwardsInbound)
    // .then(lookAvailableAwardsInbound)
    // .then(function(inboundAwardsResults){
    // console.log("current awardas: " + awards_available);
    // awards_available.push("|");
    // console.log("current awardas: " + awards_available);
    // awards_available.push(inboundAwardsResults);
    // console.log("current awardas: " + awards_available);
    // return Promise.resolve(awards_available);
    // });
}

module.exports.getResultsOW = checkResultsOW;
module.exports.getResultsRT = checkResultsRT;