

/*
 Toggle password icon:
 When click on the lock icon the password toggle from dot to readable and backward
*/
$("#toggle-password").on("click", function () {
    $(this).toggleClass("fa-lock fa-unlock-alt");
    console.log(1);
    var input = $($(this).attr("toggle"));
    if (input.attr("type") === "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});


/* 
    Render photograph:
    Get the photos from Heritage-GO service and present it to the web page
    along with its description
*/
$(function () {
    getPhoto(0);
});

let x = 0;
$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        x += 2;
        getPhoto(x);
    }
})

const getPhoto = (photoNum) => {
    let defaultContent = $("#picture");
    mHeritageGoService.getPhotos({ offset: photoNum, limit: 2 }).then(photos => {
        photos.forEach(photo => {
            let content = defaultContent.clone();
            photoInfo = mHeritageGoService.getPhoto(photo).then(photo => {
                console.log(photo);
                content.find(".avatar-img").prop("src", "http:" + photo.account.picture_url).attr("alt", photo.account.fullname);
                content.find(".img-description").html(photo.title[0].content);
                content.find(".img-location").html(photo.area_name.trim());
                if (photo.capture_time) {
                    content.find(".img-time").html(
                        photo.capture_time.trim()
                    );
                } else {
                    content.find(".img-time").html(
                        "undefine"
                    );
                };
                content.find('.main-img').prop("src", "http:" + photo.image_url + "?size=large");
                content.appendTo($(".container"));
            }).catch(error => { console.log(error) });
        });
    }).catch(error => { console.log(error) });
};


/* 
    Blur content:
    When scroll the main content of the web page behind the header
    The content is blured out, and the header become more transparent
*/

$(window).scroll(() => {
    $('.header-body').css({'opacity': '.75'});
})

$(document).scroll(function () {
    var scroll = $(this).scrollTop();
    $('header').find($('.container')).css({
        '-webkit-transform': 'translateY(-' + scroll + 'px)',
        'transform': 'translateY(-' + scroll + 'px)'
    });
});

$(function () {
    $('.container').clone().prependTo($('header')).addClass('blured');
    $(".blured").css({
        '-webkit-filter': 'blur(.5em)',
        'filter': 'blur(.5em)',
        'background': '#fff',
    });
});


/*
    Change the photo's caption's language
    By using Heritage-GO observatory API 
*/

let photoId = "dd06abcc-f812-11e7-9de2-0007cb040bcc",
caption = "Khach san Majestic - Sai Gon",
locale = "vie";

$(function() {
    mHeritageGoService.suggestPhotoCaption(photoId, caption, locale).catch(error => {console.log(error)});
});