/* Author: Matt Sanford

*/

(function(){
  /* Tipsy */
  $('.tip').tipsy({live: true, gravity: 's', opacity: 1, fade: true });
  
  /* Footnote flash */
  $('a.footnote').live('click', function() {
    var $target = $('a[name="' + $(this).attr('href').substring(1) + '"]').parent().find('.note');    
    $target.addClass('active');
    window.setTimeout(function() { $target.removeClass('active'); }, 750);
  });
})();