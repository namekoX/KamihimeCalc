var pulshp;
var rank;
var wep_hp;
var gen_hp;
var master_hp;
var disphp;

window.onload = function () {
    var arg = opener.getcalcIn().split(',');
    ireru(arg);
    view_dispHP();
}

function ireru(arg){
    // 表示HP
    pulshp = suti(arg[0]);
    rank = suti(arg[1]);
    wep_hp = suti(arg[2]);
    gen_hp = suti(arg[3]);
    master_hp = suti(arg[4]);
    disphp = Math.round((600 + pulshp + opener.runkbonus('hp',rank) + wep_hp + gen_hp) * master_hp);
}

function view_dispHP(){
     var str ='';
     str += '表示HP = ((固定値600 + ランクボーナス(※1) + 武器HP合計 + 幻獣HP合計) × マスターボーナス）<br>';
     str += '　　　 = ((600 + ' + opener.runkbonus('hp',rank) + ' + ' + wep_hp + ' + ' + gen_hp +') × ' + master_hp + ')<br>';
     str += '　　　 = '+ disphp + '<br><br>';

     str += '※1<br>'
     str += 'ランクボーナス = ランク　×　8 (ランク100以降は×2)<br>'
     if(rank > 100){
     str += '               = (' + rank + '- 100) × 2 + 100 × 8<br>';
     }else{
     str += '               = ' + rank + ' × 8<br>';
     }
     str += '               = ' + opener.runkbonus('hp',rank);
     $('#disp_hp').html(str);
}

function suti(str){
    var i;
    if (str.indexOf('.') != -1){
        i = parseFloat(str);
    } else {
        i = parseInt(str);
    }
    return i;
}

function winclose(){
    window.close();
}
