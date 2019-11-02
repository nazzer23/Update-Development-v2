import {apiUrl, getPosts} from "./config.api.js";

$(document).ready(function () {
    var limit = 5;
    var start = 0;
    var action = 'inactive';

    function load_posts_data_from_db(limit, start) {
        $.ajax({
            url: apiUrl + getPosts,
            method: "POST",
            statusCode: {
                404: function () {
                    $('#load_posts_message').html('<div class="my-3 p-3 bg-white rounded box-shadow"><center><h6>Something went wrong. Please try again later.</h6><br><img src="https://http.cat/404" style="max-width: 400px;"></center></div>');
                    action = "inactive";
                },
                500: function () {
                    $('#load_posts_message').html('<div class="my-3 p-3 bg-white rounded box-shadow"><center><h6>Something went wrong. Please try again later.</h6><br><img src="https://http.cat/404" style="max-width: 400px;"></center></div>');
                    action = "inactive";
                }
            },
            data: {
                limit: limit,
                start: start,
                sessionString: localStorage.getItem("token"),
                userID: localStorage.getItem("userID")
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data == '') {
                    $('#load_posts_message').html('<div class="p-3 rounded box-shadow darkPost"><center><h6>End of timeline</h6></center></div>');
                    action = 'active';
                } else {
                    if (!isJson(data)) {
                        $('#load_posts_message').html('<div class="p-3 rounded box-shadow darkPost"><center><h6>There was an error.</h6></center></div>');
                        action = "active";
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            $.ajax({
                                url: "/gateway.php",
                                method: "POST",
                                context: this,
                                dataType: "html",
                                data: {
                                    mode: "constructPost",
                                    userID: localStorage.getItem("userID"),
                                    token: localStorage.getItem("token"),
                                    postID: data[i].PostID
                                },
                                success: (post) => {
                                    $('#load_posts').append($(post));
                                }
                            });
                        }

                        action = "inactive";
                    }
                }
            }
        });
    }

    if (action == 'inactive') {
        action = 'active';
        load_posts_data_from_db(limit, start);
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $("#load_posts").height() && action == 'inactive') {
            action = 'active';
            start = start + limit;
            setTimeout(function () {
                load_posts_data_from_db(limit, start);
            }, 1000);
        }
    });
});

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}