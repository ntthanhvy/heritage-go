// global variable
const LANGUAGE_FROM_ISO_639_TO_ISO_639_ALPHA_3 = {
    "aa": "DJ", "af": "ZA", "ak": "GH", "sq": "AL", "am": "ET", "ar": "AA", "hy": "AM",
    "ay": "WH", "az": "AZ", "bm": "ML", "be": "BY", "bn": "BD", "bi": "VU", "bs": "BA",
    "bg": "BG", "my": "MM", "ca": "AD", "zh": "CN", "hr": "HR", "cs": "CZ", "da": "DK",
    "dv": "MV", "nl": "NL", "dz": "BT", "en": "GB", "et": "EE", "ee": "EW", "fj": "FJ",
    "fil": "PH", "fi": "FI", "fr": "FR", "ff": "FF", "gaa": "GH", "ka": "GE", "de": "DE",
    "el": "GR", "gn": "GX", "gu": "IN", "ht": "HT", "ha": "HA", "he": "IL", "hi": "IN",
    "ho": "PG", "hu": "HU", "is": "IS", "ig": "NG", "id": "ID", "ga": "IE", "it": "IT",
    "ja": "JP", "kr": "NE", "kk": "KZ", "km": "KH", "kmb": "AO", "rw": "RW", "kg": "CG",
    "ko": "KR", "kj": "AO", "ku": "IQ", "ky": "KG", "lo": "LA", "la": "VA", "lv": "LV",
    "ln": "CG", "lt": "LT", "lu": "CD", "lb": "LU", "mk": "MK", "mg": "MG", "ms": "MY",
    "mt": "MT", "mi": "NZ", "mh": "MH", "mn": "MN", "mos": "BF", "ne": "NP", "nd": "ZW",
    "nso": "ZA", "no": "NO", "nb": "NO", "nn": "NO", "ny": "MW", "pap": "AW", "ps": "AF",
    "fa": "IR", "pl": "PL", "pt": "PT", "pa": "IN", "qu": "WH", "ro": "RO", "rm": "CH",
    "rn": "BI", "ru": "RU", "sg": "CF", "sr": "RS", "srr": "SN", "sn": "ZW", "si": "LK",
    "sk": "SK", "sl": "SI", "so": "SO", "snk": "SN", "nr": "ZA", "st": "LS", "es": "ES",
    "sw": "SW", "ss": "SZ", "sv": "SE", "tl": "PH", "tg": "TJ", "ta": "LK", "te": "IN",
    "tet": "TL", "th": "TH", "ti": "ER", "tpi": "PG", "ts": "ZA", "tn": "BW", "tr": "TR",
    "tk": "TM", "uk": "UA", "umb": "AO", "ur": "PK", "uz": "UZ", "ve": "ZA", "vi": "VN",
    "cy": "GB", "wo": "SN", "xh": "ZA", "yo": "YO", "zu": "ZA"
}


/*
 Toggle password icon:
 When click on the lock icon the password toggle from dot to readable and backward
*/
$("#toggle-password").on("click", function () {
    $(this).toggleClass("fa-lock fa-unlock-alt");
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
                content.find(".avatar-img").prop("src", "https:" + photo.account.picture_url).attr("alt", photo.account.fullname);
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
                content.find('.main-img').prop("src", "https:" + photo.image_url + "?size=large");
                content.appendTo($(".container"));

                // translate the caption of the photo
                let photoId = '', caption = "", locale = "";
                let transIcon = content.find($(".translate-icon"));
                $(transIcon).click(function () {
                    console.log(1);
                    $(transIcon).removeClass("skake-icon");
                    let langChoice = $(".language-choice")
                    $(langChoice).click(function (item) {
                        console.log(2);
                        item.preventDefault();
                        let lang = item.target.text
                        if (lang === "English") {
                            locale = "eng";
                        } else if (lang === "Vietnamese") {
                            locale = 'vie'
                        }
                        $(transIcon).removeClass("translate-icon");
                        $(transIcon).addClass("translate-language");
                        $(transIcon).text(lang);
                        content.find($(".img-description")).css("display", "none");
                        content.find($(".input-language")).css("display", "block");

                        let newCaption = content.find($(".input-language"));
                        newCaption.submit(function (inp) {
                            inp.preventDefault();
                            console.log(3)
                            let photoId = photo.photo_id;
                            let caption = $(newCaption).find($("input")).val();
                            mHeritageGoService.suggestPhotoCaption(photoId, caption, locale).catch(error => { console.log(error) });

                            $(transIcon).addClass("translate-icon");
                            $(transIcon).removeClass("translate-language");
                            $(transIcon).text("");

                            content.find($(".img-description")).css("display", "block");
                            content.find($(".input-language")).css("display", "none");
                        })
                    })
                })

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
    $('.header-body').css({ 'opacity': '.75' });
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
