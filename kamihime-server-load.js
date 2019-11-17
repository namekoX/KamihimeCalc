var arg;

$(document).ready(function(){
        $(window).on("beforeunload",function(e){
             window.opener.focus();
        });
});

window.onload = function () {
    opener.set_exe_yes(false);
    arg = opener.get_load_names();
    for (var i = 0; i < arg.length; i++) {
        var argsp= arg[i].split('@@');
        var row= '<tr>';
        row += '<td><input type=\"button\" onclick = \"load(' + i + ')\" value=\"ロード\" style=\"width:80px;\">'+ '</input></td>';
        row += '<td>'+ (i + 1) +'</td>';
        row += '<td>' + argsp[0] + '</td>';
        row += '<td>' + argsp[2] + '</td>';
        row += '</tr>';
        $('#main').append(row);
    }    
}

function load(id){
    if(!window.opener || window.opener.closed){
        window.close();
    } else {
        var argsp= arg[id].split('@@');
        opener.urlprm_load(argsp[1]);
        opener.set_savedata((id + 1) + '',argsp[0],argsp[2]);
        opener.set_exe_yes(true);
        window.close();
    }
}

function winclose(){
    window.close();
}
