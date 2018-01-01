/**
 * Created by nealmangaokar on 12/25/17.
 */
/**
 * Used to make an all-hero list information request to servlet.
 */
var masterArray, newArray, failedCount = 0;
function getHeroList()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            sortArrayByObjectProperty(obj);
            /*
             Adding 5 dropdown selectors to the page
             */
            for (var i = 1; i <= 5; i++)
            {
                /*
                    Create dropdown and add options to it.
                 */
                var selectElement = document.createElement("select");
                selectElement.classList.add("form-control");
                selectElement.appendChild(new Option("No hero", -1, false, false));
                for (var j = 0; j < obj.length; j++) {
                    var heroID = obj[j].id;
                    var heroName = obj[j].name.substring(14).replace(new RegExp("_", 'g'), " ");
                    var option = new Option(heroName, heroID, false, false);
                    selectElement.appendChild(option);
                }
                selectElement.id = "heroList" + i;
                /*
                    Add dropwdown select element to page.
                 */
                //var listContainer = document.createElement("div");
                //listContainer.classList.add("col-sm-1");
                //listContainer.id = "heroList" + i + "Container";
                var listContainer = document.getElementById("heroList" + i + "Container");
                listContainer.appendChild(selectElement);
                //document.getElementById("mainBootstrapContainer").appendChild(listContainer);

            }
        }
    };
    xhttp.open("GET", "/goBackEnd?actionCode=getHeroList", true);
    xhttp.send();
}

/**
 * Used to make a hero-specific information AJAX request to servlet.
 */
function getHeroStats(heroNumber) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var heroStats = JSON.parse(this.responseText);
            }
            catch(e)
            {
                failedCount++;
                if (failedCount == 5)
                {
                    alert("Oops! Something went wrong with OpenDota! Our service is reliant on their API's successful functioning.");
                    return;
                }
                getHeroStats(heroNumber);
                return;
            }
            failedCount = 0;
            document.getElementById("loadingLine" + heroStats[0].hero_id).innerHTML = "Successfully loaded stats for " + document.getElementById("loadingLine" + heroStats[0].hero_id).getAttribute("heroName") + " " + "<i class='fa fa-check' aria-hidden='true'></i>";
            document.getElementById("loadingLine" + heroStats[0].hero_id).classList.add("text-success");
            heroStats.shift();
            evaluateWinrateAvg(heroStats);
            var stats = "";
            for (var i = 0; i < masterArray.length; i++)
            {
                stats += masterArray[i].hero_id + " " + masterArray[i].games_played + " " + masterArray[i].wins + "<br/>";
            }
            document.getElementById("heroStats").innerHTML = stats;
        }
    };

    xhttp.open("GET", "/goBackEnd?actionCode=getHeroStats&heroID="+document.getElementById("heroList" + heroNumber).value, true);
    xhttp.send();
}

/**
 * Onclick event handler for the submit button. Makes the AJAX request function call and adds
 * progress lines.
 */
function sendHeroStatRequests()
{
    masterArray = undefined;
    /*
        If same hero chosen multiple times, we say no bueno.
     */
    /*
        Remove loading lines container elements if not empty.
     */
    var loadingLinesContainer = document.getElementById("loadingLinesContainer");
    if (document.getElementById("loadingLinesContainer").childNodes.length != 0)
    {
        while (loadingLinesContainer.firstChild) {
            loadingLinesContainer.removeChild(loadingLinesContainer.firstChild);
        }
    }

    /*
        Process the 5(?) hero choices.
     */
    for (var i = 1; i <= 5; i++)
    {
        /*
            Make AJAX request.
         */
        var currentSelect = document.getElementById("heroList" + i);
        if (currentSelect[currentSelect.selectedIndex].value == -1)
        {
            continue;
        }
        getHeroStats(i);
        /*
            Make "loading" progress lines.
         */
        var newLoadingText = document.createElement("p");
        newLoadingText.setAttribute("heroId", currentSelect.value);
        newLoadingText.setAttribute("heroName", currentSelect[currentSelect.selectedIndex].text);
        newLoadingText.innerHTML = "Loading stats for " + currentSelect[currentSelect.selectedIndex].text;
        newLoadingText.id = "loadingLine" + document.getElementById("heroList" + i).value;
        loadingLinesContainer.appendChild(newLoadingText);
        //loadingLinesContainer.appendChild(document.createElement("br"));
    }

}

/**
 * Factors in returned stats into the final result.
 * @param heroStats Array of hero stats objects.
 */
function evaluateWinrateAvg(heroStats) {
    /*
        If user has checked the filter checkbox, take out heroes who have less than 10 games played.
     */
    if (document.getElementById("filterInsufficientData").checked)
    {
        for (var i = heroStats.length - 1; i >= 0; i--)
        {
            if (heroStats[i].games_played < 10)
            {
                heroStats.splice(i, 1);
            }
        }
    }


    if (masterArray === undefined)
    {
        masterArray = heroStats;
    }
    else
    {

        newArray = heroStats;
        var newArrayHeroIDs = newArray.slice(0);
        for (var j = newArray.length - 1; j >= 0; j--)
        {
            newArrayHeroIDs[j] = newArray[j].hero_id;
        }
        for (var k = masterArray.length - 1; k >= 0; k--)
        {
            var indexOfCurrentIdInNewArray = newArrayHeroIDs.indexOf(masterArray[k].hero_id);
            if (indexOfCurrentIdInNewArray < 0)
            {
                masterArray.splice(k, 1);
            }
            else
            {
                masterArray[k].games_played += newArray[indexOfCurrentIdInNewArray].games_played;
                masterArray[k].wins += newArray[indexOfCurrentIdInNewArray].wins;
            }
        }
    }
}


