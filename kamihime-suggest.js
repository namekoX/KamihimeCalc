window.onload = function () {
    setConstSuggest();
    new Suggest.Local('intext','result',WepSuggest,{dispMax: 10, highlight: true});
    for(var i = 1; i < 11; i++){
        var wep_id = opener.document.getElementById('wep' + i + '_name').value;
        if (wep_id != 0) {
            var weapon = Weapons[WeaponsId[wep_id]];
            $('#genzai' + i).html(weapon.name);
        }
    }
}

function winclose(){
   window.close();
}

function sel(i,j){
   window.opener.$(".chosen-select").prop('disabled', true).trigger('chosen:updated');
   var wep_id = $('#val' + i).html();
   var weapon = Weapons[WeaponsId[wep_id]];
   $('#genzai' + j).html(weapon.name);
   if(window.opener.$('#wep'+ i +'_name option').is_option({value:wep_id}) == 0){
      var select = window.opener.document.getElementById('wep'+ j +'_name');
      var option = window.opener.document.createElement('option');
      option.setAttribute('value', wep_id);
      option.innerHTML = Weapons[WeaponsId[wep_id]].name;
      select.appendChild(option);
   }
   window.opener.$('#wep' + j + '_name').val(wep_id);
   opener.wep_change(j);
   window.opener.$(".chosen-select").prop('disabled', false).trigger('chosen:updated');
}