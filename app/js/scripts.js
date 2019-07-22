$(document).ready(function() {
    // Плавный скролл страницы по клику на элементы меню

    $('.navbar-nav .nav-link').click(function(event) {
        event.preventDefault();

        $('html').animate({scrollTop: $($(this).attr('href')).offset().top}, 1500);
    });

    // ------------------------------------------------------------------------------

    // Взаимодействие с кнопкой поиска в меню

    $('.header-section .search-icon').click(function() {
        $('.form-control').toggleClass('active');
    });

    // ------------------------------------------------------------------------------
});