window.onload = function () {
    var line = '';
    setConst();
    for (var i = 1 ; i < 11 ;i++){
        var str = window.opener.$('#itiran' + i).val();
        if(!(str === undefined || str == null || str == '')){
             var arg = split_urlpram(str);
             line = '<tr>';
             line += '<td>' + arg.n + '</td>';
             line += '<td>' + arg.main_ele + '</td>';
             line += '<td>' + arg.result_asa + '</td>';
             line += '<td>' + arg.result_zsa + '</td>';
             line += '<td>' + arg.result_dff + '</td>';
             line += '<td>' + arg.result_vig + '</td>';
             line += '<td>' + arg.result_exs + '</td>';
             line += '<td>' + arg.result_elp + '</td>';
             line += '<td>' + arg.result_ase + '</td>';
             var sp = arg.g.split('_');
             var main_gen = Gens[sp[0]];
             var fre_gen = Gens[sp[1]];
             line += '<td>' + main_gen.name + '</td>';
             line += '<td>' + fre_gen.name + '</td>';
             if(arg.z){
                 line += '<td>' + arg.z + '%</td>';
             }else{
                 line += '<td>' + 100 + '%</td>';
             }
             line += '<td>' + arg.result_exp_hp + '</td>';
             line += '<td>' + arg.result_exp_dam + '</td>';
             line += '<td>' + arg.result_exp_vdam + '</td>';
             line += '</tr>';
             $('#itiran_main').append(line);
        }
    }
}

function split_urlpram(str){
    var arg = new Object;
    var pair=str.substring(1).split('&');
    for(var i=0;pair[i];i++) {
        var kv = pair[i].split('=');
        arg[kv[0]]=kv[1];
    }
    return arg;
}