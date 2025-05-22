document.getElementById("uploadAvatar").addEventListener("change", function(event) {
    let reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("profilePic").src = e.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
});
