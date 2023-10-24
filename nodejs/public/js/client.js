$(document).ready(function () {
    $("#btnprofile").click(function () {
        location.href = 'profile-client.html'
    });
    $("#btncare").click(function () {
        location.href = 'caretaker-finder.html'
    });
    $("#btnlogout").click(function () {
        location.href = 'index.html'
    });

}); 



function showActiveUser() {
    // alert(localStorage.getItem("activeUser"));
    if (localStorage.getItem("activeUser") == null) {
        location.href = "index.html";
        return;
    }
    document.getElementById("spanActive").innerHTML = "Welcome" + localStorage.getItem("activeUser")
    document.getElementById("Form-email").value = localStorage.getItem("activeUser")
}
function doLogout() {
    localStorage.removeItem("activeUser");
}