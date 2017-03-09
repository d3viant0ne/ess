$(function(){

    /*
      Time statement accordion
    */
    
    $('.time-calendar-week').on('click', function (e) {
      e.preventDefault();
      $('.time-calendar .collapse').collapse("hide");
    });
    
    /*
      Pay statement accordion
    */
    
    $('.pay-table > .pay-table-row').on('click', function (e) {
      e.preventDefault();
      $('.pay-table .collapse').collapse("hide");
    });
    
});