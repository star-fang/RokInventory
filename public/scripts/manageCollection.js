$(document).ready(function () {
  var i = 0;
  $("#add_row").click(function () {
    $('#addr' + i).html("<td>" + (i + 1) + "</td><td><input name='name" + i + "' type='text' placeholder='Name' class='form-control input-md'  /> </td><td><input  name='mail" + i + "' type='text' placeholder='Mail'  class='form-control input-md'></td><td><input  name='mobile" + i + "' type='text' placeholder='Mobile'  class='form-control input-md'></td>");

    $('#tab_logic').append('<tr id="addr' + (i + 1) + '"></tr>');
    i++;
  });
  $("#delete_row").click(function () {
    if (i > 1) {
      $("#addr" + (i - 1)).html('');
      i--;
    }
  });
  $('#Get_row_data').click(function () {
    $('[id^=addr]').each(function () {
      var id = $(this).attr('id');
      $('#' + id + ' td input').each(function () {
        console.log($(this).val());
      });
    });

  });
});