var no = '0';

window.onload = function () {
    opener.set_exe_yes(false);
    var arg = opener.get_save_name_server();
    if(!opener.isnullundef(arg)){
        $('#savename').val(arg);
    }
    arg = opener.get_save_biko();
    if(!opener.isnullundef(arg)){
        $('#biko').val(arg);
    }
    arg = opener.get_save_no();
    if(!opener.isnullundef(arg)){
        no = arg;
    }
}

function ok(){
    if(opener.isnullundef($('#savename').val())){
        window.alert('保存名を入力してください');
        return false;
    }

    opener.set_savedata(no,$('#savename').val(),$('#biko').val());
    opener.set_exe_yes(true);
    window.close();
}

function winclose(){
    window.close();
}
