import 'bootstrap';
import 'jquery';


$(function () {
    $('.products__toggles button').click(function () {
        let get_id = this.id;

        $('.products__toggles__active').removeClass('products__toggles__active');
        $(this).addClass('products__toggles__active');

        let get_current = $('.products__posts .' + get_id);

        $('.post').not(get_current).hide(500);

        get_current.show(500);
    });

    $('#showall').click(function () {
            $('.post').show(500);
        });
});




