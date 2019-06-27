$(".alert-danger").slideDown(300);
window.setTimeout(function () {
    $(".alert-danger").slideUp(300, function () {
        $(this).remove();
    });
}, 3000);


