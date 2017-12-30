/**
 * Created by nealmangaokar on 12/25/17.
 */
/**
 * Used to make an all-hero list information request to servlet.
 */
var masterArray, newArray;
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
                    Create dropdown.
                 */
                var selectElement = document.createElement("select");
                selectElement.classList.add("form-control");
                selectElement.appendChild(new Option("No hero selected", -1, false, false));
                for (var j = 0; j < obj.length; j++) {
                    var heroID = obj[j].id;
                    var heroName = obj[j].name.substring(14).replace(new RegExp("_", 'g'), " ");
                    var option = new Option(heroName, heroID, false, false);
                    selectElement.appendChild(option);
                }
                selectElement.id = "heroList" + i;
                /*
                    Add to page.
                 */
                var listContainer = document.createElement("div");
                listContainer.classList.add("col-sm-1");
                listContainer.id = "heroList" + i + "Container";
                listContainer.appendChild(selectElement);
                document.getElementById("mainBootstrapContainer").appendChild(listContainer);

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
            var heroStats = JSON.parse(this.responseText);
            //document.getElementById("loadingLine" + heroStats[0].hero_id).style.color = "green";
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
        Remove loading lines container and add a new one, appending it to the bootstrap container.
     */
    if (document.getElementById("loadingLinesContainer") != null)
    {
        var loadingLinesContainer = document.getElementById("loadingLinesContainer");
        document.getElementById("mainBootstrapContainer").removeChild(loadingLinesContainer);
    }
    loadingLinesContainer = document.createElement("div");
    loadingLinesContainer.id = "loadingLinesContainer";
    document.getElementById("mainBootstrapContainer").appendChild(loadingLinesContainer);

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
        newLoadingText.innerHTML = "Loading stats for " + currentSelect[currentSelect.selectedIndex].text;
        newLoadingText.id = "loadingLine" + document.getElementById("heroList" + i).value;
        loadingLinesContainer.appendChild(newLoadingText);
        loadingLinesContainer.appendChild(document.createElement("br"));
    }

}

function evaluateWinrateAvg(heroStats) {

    for (var i = heroStats.length - 1; i >= 0; i--)
    {
        if (heroStats[i].games_played < 10)
        {
            heroStats.splice(i, 1);
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
        for (var i = newArray.length - 1; i >= 0; i--)
        {
            newArrayHeroIDs[i] = newArray[i].hero_id;
        }
        for (var i = masterArray.length - 1; i >= 0; i--)
        {
            var indexOfCurrentIdInNewArray = newArrayHeroIDs.indexOf(masterArray[i].hero_id);
            if (indexOfCurrentIdInNewArray < 0)
            {
                masterArray.splice(i, 1);
            }
            else
            {
                masterArray[i].games_played += newArray[indexOfCurrentIdInNewArray].games_played;
                masterArray[i].wins += newArray[indexOfCurrentIdInNewArray].wins;
            }
        }
    }
}


