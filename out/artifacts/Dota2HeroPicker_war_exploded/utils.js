/**
 * Created by nealmangaokar on 12/26/17.
 */

/**
 * Sorts an  array of objects based on "name" property.
 * @param arr
 */
function sortArrayByObjectProperty(arr)
{
    arr.sort(function(a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });
}

function replaceAll(str, oldText, newText)
{
    return str.replace(new RegExp(oldText, 'g'), newText);
}
