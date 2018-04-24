$(document).ready(function () {

    //----------------------<<svg for ie>>----------------------\\
    (function () {
        svg4everybody();
    }());
    
    //----------------------<<checkbox>>----------------------\\
    (function () {
        var flag = true;

        $('.courses-item').on('click', function (e) {
            e.preventDefault();

            var $this = $(this);

            if(flag){
                flag = false;

                if ($this.hasClass('checked')){
                    $this.removeClass('checked');
                } else{
                    $this.addClass('checked').children().delay(1000).slideUp(2000, function(){
                        $this.empty().animate({width: 0}, 1000, function(){
                                $(this).remove();
                            });
                        flag = true;

                        if($('.courses-item').length < 2) {
                            $('.section2__top').fadeOut(1000, function () {
                                $('.completed').fadeIn(1000);
                            });
                        }
                    });
                }
            }
        });
    }());
});