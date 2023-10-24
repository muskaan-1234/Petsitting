$(document).ready(function () {
    $("#btndetails").click(function () {
        location.href = 'profile-caretaker.html'
    });
    $("#btnlog").click(function () {
        location.href = 'index.html'
    });
}); 

function showActiveUser1() {
    // alert(localStorage.getItem("activeUser"));
    if (localStorage.getItem("activeUser") == null) {
        location.href = "index.html";
        return;
    }
    document.getElementById("spanActive1").innerHTML = "Welcome" + localStorage.getItem("activeUser")
    document.getElementById("Form-email").value = localStorage.getItem("activeUser")
}
function doLog() {
    localStorage.removeItem("activeUser");
}