

// toggle password icon
$("#toggle-password").on("click", function() {
    $(this).toggleClass("fa-lock fa-unlock-alt");
    console.log(1);
    var input = $($(this).attr("toggle"));
    if (input.attr("type") === "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

// render photograph
let defaultContent = $("#picture");

$(function() {   
    mHeritageGoService.getPhotos().then(photos => {
        mHeritageGoService.getPhoto(photos[1]).then(photo => {console.log(photo)});
        photos.forEach(photo => {
            let content = defaultContent.clone();
            photoInfo = mHeritageGoService.getPhoto(photo).then(photo => {
                console.log(photo);
                content.find(".avatar-img").prop("src", "https:" + photo.account.picture_url).attr("alt", photo.account.fullname);
                content.find(".img-description").html(photo.title[0].content);
                content.find(".img-location").html(photo.area_name);
                if (photo.capture_time) {
                    content.find(".img-time").html(
                        photo.capture_time
                    );
                } else {
                    content.find(".img-time").html(
                        "undefine"
                    );
                };
                content.find(".main-img").prop("src", "https:" + photo.image_url);
            }).catch(error => {console.log(error)});
            content.appendTo($(".container"));
        });
    }).catch(error => { console.log(error)});
});
