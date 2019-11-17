var maborosi ='0';
var selected_job = '0';
var main_ele = '0';
var c_version = '1.4';

//サーバ保存機能用
var save_name_server = '';
function get_save_name_server(){return save_name_server;}

var save_biko = '';
function get_save_biko(){return save_biko;}

var save_no = '';
function get_save_no(){return save_no;}

var load_names;
function get_load_names(){return load_names;}

var exe_yes = false;
function set_exe_yes(arg){exe_yes=arg;}

function set_savedata(no,name,biko){
    save_biko = biko;
    save_name_server = name;
    save_no = no;
}

window.onload = function () {
    var sibori = new Array(13);
    for(var i = 1; i < 14; ++i){
        if(document.getElementById('wep1_sibori' + i).checked){
            sibori[i-1] = 1;
        }else{
            sibori[i-1] = 0;
        }
    }
    
    setConst();
    
    setselect('job', Jobs, false, sibori);
    
    setselect('wep'+ 1 +'_name', Weapons, false, sibori);
    $("#wep1_name").val("1");
    wep_info(1);

    for (var i = 2; i < 11; ++i) {
           setselect('wep'+ i +'_name', Weapons, true, sibori);
    }
    
    for(var i = 1; i < 12; ++i){
        if(document.getElementById('gen1_sibori' + i).checked){
            sibori[i-1] = 1;
        }else{
            sibori[i-1] = 0;
        }
    }
    setselect('gen1_name', Gens, false, sibori);
    gen_info(1);
    setselect('gen2_name', Gens, false, sibori);
    gen_info(2);
    for (var i = 3; i < 8; ++i) {
           setselect('gen'+ i +'_name', Gens, true, sibori);
    }
    
    setCookieName();
    
    var urlParam = location.search.substring(1);
    if(urlParam){
        urlprm_load('?' + urlParam);
    }
    $(".chosen-select").chosen({
        width: "100%",
        no_results_text: "見つかりません。",
        search_contains:true
    });
}

function setselect(id, source, kuhaku, sibori){
    var select = document.getElementById(id);
    var options = select.options;
    var idx = select.selectedIndex;
    var selval = select.value;
    
    if(idx != -1){
        var selopt = options[idx];
    }
    //for (var i = select.options.length - 1; 0 <= i; --i) {
	    //if(!options[i].selected || options[i].value == 0) {
            //select.removeChild(options[i]);
	    //}
    //}
    
    jQuery("#" + id ).children().remove();
    
    if (kuhaku == true) {
	var option = document.createElement('option');
        option.setAttribute('value', 0);
        option.innerHTML = '未選択';
        select.appendChild(option);
    }
    if(idx != -1 && selval != 0){
        select.appendChild(selopt);
    }
    
    for (var i in source) {
        if(sibori_hante(id, source[i], sibori, selval)){
            var option = document.createElement('option');
            option.setAttribute('value', source[i].id);
            option.innerHTML = source[i].name;
            select.appendChild(option);
        }
    }
}

function cloneSelectBox(ci, pa) {
  var src = document.getElementById(ci);
  var copy = src.cloneNode(true);
  copy.value = src.value;
  var parent = document.getElementById(pa);
  parent.options = copy;
}

function sibori_hante(id, obj, sibori, selval){
    if(obj.kind != 'weapon' && obj.kind != 'gen'){return true;}
    if(obj.id == selval){return false;}
    if(sibori[0] == 0){
        if(obj.rea == "SSR"){return false;}
    }
    if(sibori[1] == 0){
        if(obj.rea == "SR"){return false;}
    }
    if(sibori[2] == 0){
        if(obj.rea == "R"){return false;}
    }
    if(sibori[3] == 0){
        if(obj.rea == "N"){return false;}
    }
    for(var i = 4; i < 10; ++i){
        if(sibori[i] == 0){
            if(obj.ele == (i-4) ){return false;}
        }
    }
    if(sibori[10] == 0){
        if(obj.ele == 8){return false;}
    }
    if(obj.kind != 'weapon'){
        return true;
    }
    if(sibori[11] == 1 && id == 'wep1_name'){
        if(!~obj.bukishu.indexOf('英')){return false;}
    }
    if(sibori[12] == 0 && id != 'wep1_name'){
        if(~obj.bukishu.indexOf('英')){return false;}
    }
    return true;
}

function wep_change(id) {
    var select = document.getElementById('wep' + id + '_name');
    var lv = document.getElementById('wep' + id + '_lv');
    var slv = document.getElementById('wep' + id + '_slv');
    var final = document.getElementById('wep' + id + '_final');
    var plus = document.getElementById('wep' + id + '_plus');
    var finaldiv = document.getElementById('wep_finaldiv' + id);

    var wep_id = select.value;
    if (wep_id == 0) {
        lv.disabled = "true";
        slv.disabled = "true";
        finaldiv.style.display = "none";
        final.checked = false;
        plus.disabled = "true";
        if(maborosichk()){
            for (var i = 1; i < 11; ++i) {
                wep_info(i);
            }
         }else{
             wep_info(id);
         }
        return;
    }else{
        lv.disabled = "";
        slv.disabled = "";
        plus.disabled = "";
    }
    
    var weapon = Weapons[WeaponsId[wep_id]];
    if (weapon.final == "True") {
        finaldiv.style.display = "";
    }else{
        finaldiv.style.display = "none";
        final.checked = false;
    }

    if(weapon.bukishu == '英2'){
        finaldiv.style.display = "";
        final.checked = true;
        lv.max = 150;
        lv.min = 125;
        slv.max = 30;
        slv.min = 1;       
    }
    else if (final.checked) {
        lv.max = 150;
        lv.min = 125;
        slv.max = 30;
        slv.min = 20;
    }else{
        lv.max = getMaxlv(weapon);
        slv.max = 20;
        lv.min = 1;
        slv.min = 1;
    }
    
    if(id == 1){
        main_ele = weapon.ele;
    }
    
    chk_max_min(lv);
    chk_max_min(slv);
    if(maborosichk()){
       for (var i = 1; i < 11; ++i) {
           wep_info(i);
       }
    }else{
        wep_info(id);
    }
}

function maborosichk(){
    for (var id = 1; id < 11; ++id) {
       if($('#wep' + id + '_name').val() > 2075 && $('#wep' + id + '_name').val() < 2085){
           if(maborosi == $('#wep' + id + '_name').val()){
              return false;
           }
           maborosi = $('#wep' + id + '_name').val()
           return true;
       }
    }
    if(maborosi != '0'){
        maborosi = 0;
        return true;
    }else{
        return false;
    }
}

function chk_max_min(elem) {
    if(parseInt(elem.value) > parseInt(elem.max)){
        elem.value = elem.max;
    }
    if(parseInt(elem.value) < parseInt(elem.min)){
        elem.value = elem.min;
    }
}

function wep_info(id) {
    var select = document.getElementById('wep' + id + '_name');
    var lv = document.getElementById('wep' + id + '_lv');
    var slv = document.getElementById('wep' + id + '_slv');
    var info = document.getElementById('wep' + id + '_info');
    var plus = document.getElementById('wep' + id + '_plus');
    var final = document.getElementById('wep' + id + '_final');
    var wep_id = select.value;
    if(lv.value == ""){lv.value=lv.min;}
    if(slv.value == ""){slv.value=slv.min;}
    if(plus.value == ""){plus.value=0;}
    chk_max_min(lv);
    chk_max_min(slv);
    if (wep_id == 0) {
        info.innerHTML = "";
    }else{
        var weapon = Weapons[WeaponsId[wep_id]];
        var at = getWepAt(weapon,  parseInt(lv.value) , parseInt(plus.value));
        var hp = getWepHp(weapon,  parseInt(lv.value) , parseInt(plus.value));
        var skill1 = getWepSkill(weapon,  1 , final.checked).name;
        var skill2 = getWepSkill(weapon,  2 , final.checked).name;
        if(skill2 != ''){skill2='/' + skill2;}
        info.innerHTML = "攻撃力：" + at + "　HP：" + hp + '　' + skill1 + skill2;
    }
    getAllWepSkill();
    clcjob();
}

function getMaxlv(obj){
    if (obj.kind == "weapon") {
        if (obj.rea == "SSR") {
            return 125;
        }else if (obj.rea == "SR") {
            return  85;
        }else if (obj.rea == "R") {
            return  60;
        }else{
            return  50;
        }
    }else if (obj.kind == "gen") {
        if (obj.rea == "SSR") {
            return 100;
        }else if (obj.rea == "SR") {
            return  90;
        }else if (obj.rea == "R") {
            return  60;
        }else{
            return  50;
        }
    }
}

function getWepAt(wp,lv,plus){
    var maxlv = parseInt(getMaxlv(wp));
    var max_at = parseInt(wp.max_at);
    var min_at = parseInt(wp.min_at);
    if(maxlv >= lv){
        max_at = max_at - (((maxlv - lv) / (maxlv -1)) * (max_at - min_at));
    }else{
        var fat = parseInt(wp.fat);
        max_at = fat - (((150 - lv) / 25) * (fat - max_at));
    }
    if(maborosihante(wp)){
        max_at *= 1.3;
        max_at += ((plus * 3) * 0.3);
    }
    return Math.floor(max_at) + (plus * 3);
}

function getWepHp(wp,lv,plus){
    var maxlv = parseInt(getMaxlv(wp));
    var max_hp = parseInt(wp.max_hp);
    var min_hp = parseInt(wp.min_hp);
    if(maxlv >= lv){
        max_hp = max_hp - (((maxlv - lv) / (maxlv -1)) * (max_hp - min_hp));
    }else{
        var fhp = parseInt(wp.fhp);
        max_hp = fhp - (((150 - lv) / 25) * (fhp - max_hp));
    }
    if(maborosihante(wp)){
        max_hp *= 1.45;
        max_hp += (plus * 0.45);
    }
    return Math.floor(max_hp) + (plus);
}

function maborosihante(wep){
    if(maborosi == '0'){return false;}
    else if(maborosi == '2076' && wep.typ == "sword"){return true;}
    else if(maborosi == '2077' && wep.typ == "special_sword"){return true;}
    else if(maborosi == '2078' && wep.typ == "spear"){return true;}
    else if(maborosi == '2079' && wep.typ == "ax"){return true;}
    else if(maborosi == '2080' && wep.typ == "hammer"){return true;}
    else if(maborosi == '2081' && wep.typ == "staff"){return true;}
    else if(maborosi == '2082' && wep.typ == "gun"){return true;}
    else if(maborosi == '2083' && wep.typ == "bow"){return true;}
    else if(maborosi == '2084' && wep.typ == "magic_item"){return true;}
    else{return false;}
}

function getWepSkill(wp,i,final){
    if(final){
        if(i == 1 && wp.fskill1 != ''){
            return Skills[wp.fskill1];
        }else if(i == 2 && wp.fskill2 != ''){
            return Skills[wp.fskill2];
        }else{
            return Skills[999];
        }
    }else{
        if(i == 1 && wp.skill1 != ''){
            return Skills[wp.skill1];
        }else if(i == 2 && wp.skill2 != ''){
            return Skills[wp.skill2];
        }else{
            return Skills[999];
        }
    }
}

function getAllWepSkill(){
    var asa = new Array(6);
    var zsa = new Array(6);
    var dff = new Array(6);
    var pra = new Array(6);
    var vig = new Array(6);
    var exs = new Array(6);
    var exd = new Array(6);
    var elp = new Array(6);
    var ase = new Array(6);
    var tes = new Array(6);
    var ted = new Array(6);
    var dp = new Array(6);
    var weptyp = 0;
    
    for(var i=0; i < asa.length; i++) {
        asa[i] = parseInt($('#jyujia').val()) + parseInt($('#abuff').val());
        zsa[i] = parseInt($('#azbuff').val());;
        dff[i] = parseInt($('#jyujihp').val());
        pra[i] = 0;
        vig[i] = 0;
        exs[i] = 0;
        exd[i] = 0;
        elp[i] = 0;
        ase[i] = 0;
        ted[i] = 0;
        tes[i] = 0;
        dp[i] = 0;
    }
    
    for(var id = 1; id < 11; ++id){
        var select = document.getElementById('wep' + id + '_name');
        var slv = parseInt(document.getElementById('wep' + id + '_slv').value);
        var final = document.getElementById('wep' + id + '_final');
        var wep_id = select.value;
        if (wep_id != 0) {
            var weapon = Weapons[WeaponsId[wep_id]];
            if(maborosi == '2076' && weapon.typ == "sword"){
                weptyp += 1;
            }
            else if(maborosi == '2077' && weapon.typ == "special_sword"){
                weptyp += 1;
                if(weptyp == 6){
                    for(var i=0; i < asa.length; i++) {
                        asa[i] += 16;
                    }
                }
            }
            else if(maborosi == '2078' && weapon.typ == "spear"){
                weptyp += 1;
                if(weptyp == 6){
                    for(var i=0; i < asa.length; i++) {
                        asa[i] += 16;
                        dff[i] += 16;
                    }
                }
            }
            else if(maborosi == '2079' && weapon.typ == "ax"){
                weptyp += 1;
                if(weptyp == 6){
                    for(var i=0; i < asa.length; i++) {
                        exs[i] += 40;
                        exd[i] += 60;
                        elp[i] += 30;
                    }
                }
            }
            else if(maborosi == '2080' && weapon.typ == "hammer"){
                weptyp += 1;
                if(weptyp == 6){
                    for(var i=0; i < asa.length; i++) {
                        asa[i] += 30;
                    }
                }
            }
            else if(maborosi == '2081' && weapon.typ == "staff"){
                weptyp += 1;
                if(weptyp == 6){
                    for(var i=0; i < asa.length; i++) {
                        ase[i] += 30;
                        dff[i] += 16;
                    }
                }
            }
            else if(maborosi == '2082' && weapon.typ == "gun"){
                weptyp += 1;
                if(weptyp == 6){
                    for(var i=0; i < asa.length; i++) {
                        dff[i] += 30;
                    }
                }
            }
            else if(maborosi == '2083' && weapon.typ == "bow"){
                weptyp += 1;
                if(weptyp == 6){
                    for(var i=0; i < asa.length; i++) {
                        asa[i] += 16;
                    }
                }
            }
            else if(maborosi == '2084' && weapon.typ == "magic_item"){
                weptyp += 1;
                if(weptyp == 6){
                    for(var i=0; i < asa.length; i++) {
                        vig[i] += Math.max(shosu(Math.pow(clcSkill(slv+1,16, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,16, 0.2),0.5) ,2),0);
                        dff[i] += 16;
                    }
                }
            }
            for(idx = 1; idx < 3; ++idx){
                var skill = getWepSkill(weapon,  idx , final.checked);
                if(skill.name != ""){
                    var arr = skill.typ.split('/');
                    if( ~arr[0].indexOf('英')){
                        if ( ~weapon.name.indexOf('炎')) {
                            skill.ele = 0;
                        }
                        else if ( ~weapon.name.indexOf('氷')) {
                            skill.ele = 1;
                        }
                        else if ( ~weapon.name.indexOf('風')) {
                            skill.ele = 2;
                        }
                        else if ( ~weapon.name.indexOf('雷')) {
                            skill.ele = 3;
                        }
                        else if ( ~weapon.name.indexOf('光')) {
                            skill.ele = 5;
                        }
                        else if ( ~weapon.name.indexOf('闇')) {
                            skill.ele = 4;
                        }
                    }
                    var stridx = skill.ele;
                    var endidx = skill.ele;
                    if( ~skill.name.indexOf('レインボー')　|| ~skill.name.indexOf('プリズム')){
                        stridx = 0;
                        endidx = 5;                   
                    }
                    for(var eleidx = stridx; eleidx <= endidx; ++eleidx){
                        if(arr[0] == 'ST'){
                            if(arr[1] == '大'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                                dff[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                            }else if(arr[1] == '中'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                                dff[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                            }else{
                                asa[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                                dff[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                            }
                        }
                        else if(arr[0] == 'DP' ){
                            if(arr[1] == '大'){
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5) + shosu(20 * (1- $('#zhp').val()/100),2);
                            }else if(arr[1] == '中'){
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5) + shosu(12 * (1- $('#zhp').val()/100),2);
                            }else{
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.35, 0.35) + shosu(12 * (1- $('#zhp').val()/100),2);
                            }
                            dp[parseInt(eleidx)] += 10;
                        }
                        else if(arr[0] == 'TK' ){
                                ted[eleidx] += clcSkill(slv, 2.4, 0.4);
                                tes[eleidx] += 5;
                        }
                        else if(arr[0] == 'MG'){
                                ted[eleidx] += clcSkill(slv, 2.4, 0.4);
                                tes[eleidx] += 5;
                                if(arr[1] == '特'){
                                    dff[parseInt(eleidx)] += clcSkill(slv, 9.7, 0.7);
                                }else if(arr[1] == '大'){
                                    dff[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                                }else if(arr[1] == '中'){
                                    dff[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                                }else{
                                    dff[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                                }
                        }
                         else if(arr[0] == 'RV'){
                            if(arr[1] == '大'){
                                dff[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                                vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,16, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,16, 0.2),0.5) ,2),0);
                            }else if(arr[1] == '中'){
                                dff[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                                vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,12, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,12, 0.2),0.5) ,2),0);
                            }else{
                                dff[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                                vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,8, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,8, 0.2),0.5) ,2),0);
                            }
                        }
                         else if(arr[0] == 'AN'){
                            if(arr[1] == '大'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                                elp[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }else if(arr[1] == '中'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                                elp[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }else{
                                asa[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                                elp[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }
                        }
                        else if(arr[0] == 'LG'){
                            if(arr[1] == '大'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }else if(arr[1] == '中'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 8, 1);
                            }else{
                                asa[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 5, 1);
                            }
                        }
                        else if(arr[0] == 'GR'){
                            if(arr[1] == '大'){
                                dff[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }else if(arr[1] == '中'){
                                dff[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 8, 1);
                            }else{
                                dff[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 5, 1);
                            }
                        }
                        else if(arr[0] == 'RG'){
                            if(arr[1] == '大'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }else if(arr[1] == '中'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 8, 1);
                            }else{
                                asa[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                                ase[parseInt(eleidx)] += clcSkill(slv, 5, 1);
                            }
                        }
                        else if(arr[0] == 'SW'){
                            if(arr[1] == '大'){
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5) + shosu(20 * (1- $('#zhp').val()/100),2);
                                dff[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                            }else if(arr[1] == '中'){
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5) + shosu(12 * (1- $('#zhp').val()/100),2);
                                dff[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                            }else{
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.35, 0.35) + shosu(12 * (1- $('#zhp').val()/100),2);
                                dff[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                            }
                        }
                        else if(arr[0] == 'SP'){
                            if(arr[1] == '大'){
                                ase[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                                 vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,16, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,16, 0.2),0.5) ,2),0);
                            }else if(arr[1] == '中'){
                                ase[parseInt(eleidx)] += clcSkill(slv, 8, 1);
                                vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,12, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,12, 0.2),0.5) ,2),0);
                            }else{
                                ase[parseInt(eleidx)] += clcSkill(slv, 5, 1);
				                vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,8, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,8, 0.2),0.5) ,2),0);
                            }
                        }
                        else if(arr[0] == 'TR'){
                            if(arr[1] == '大'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                                exs[parseInt(eleidx)] += clcSkill(slv, 21, 1);
                                exd[parseInt(eleidx)] += clcSkill(slv, 41, 1);
                            }else if(arr[1] == '中'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                                exs[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                                exd[parseInt(eleidx)] += clcSkill(slv, 26, 1);
                            }else{
                                asa[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                                exs[parseInt(eleidx)] += clcSkill(slv, 1, 1);
                                exd[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }
                        }
                        else if(arr[0] == 'A' || arr[0] == 'TW'){
                            if(arr[1] == '特'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 9.7, 0.7);
                            }else if(arr[1] == '大'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                           }else if(arr[1] == '中'){
                                asa[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                           }else{
                                asa[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                            }
                        }
                        else if(arr[0] == '英A'){
                            if (id == 1 && ~skill.dis.indexOf($('[id=job] option:selected').text())){
                                zsa[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }
                        }
                        else if(arr[0] == 'D' || arr[0] == 'T' || arr[0] == 'TG' || arr[0] == 'BG'){
                            if(arr[1] == '特'){
                                dff[parseInt(eleidx)] += clcSkill(slv, 9.7, 0.7);
                            }else if(arr[1] == '大'){
                                dff[parseInt(eleidx)] += clcSkill(slv, 6.5, 0.5);
                            }else if(arr[1] == '中'){
                                dff[parseInt(eleidx)] += clcSkill(slv, 3.5, 0.5);
                            }else{
                                dff[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5);
                            }
                        }
                        else if(arr[0] == '英D'){
                            if (id == 1 && ~skill.dis.indexOf($('[id=job] option:selected').text())){
                                 dff[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }
                        }
                        else if(arr[0] == 'P'){
                            if(arr[1] == '大'){
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5) + shosu(20 * (1- $('#zhp').val()/100),2);
                            }else if(arr[1] == '中'){
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.5, 0.5) + shosu(12 * (1- $('#zhp').val()/100),2);
                            }else{
                                pra[parseInt(eleidx)] += clcSkill(slv, 0.35, 0.35) + shosu(12 * (1- $('#zhp').val()/100),2);
                            }
                        }
                        else if(arr[0] == 'V'){
                                if(arr[1] == '大'){
                                    vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,16, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,16, 0.2),0.5) ,2),0);
                                }else if(arr[1] == '中'){
                                    vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,12, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,12, 0.2),0.5) ,2),0);
                                }else{
                                    vig[parseInt(eleidx)] += Math.max(shosu(Math.pow(clcSkill(slv+1,8, 0.2),($('#zhp').val()/100))-Math.pow(clcSkill(slv+1,8, 0.2),0.5) ,2),0);
                                }
                        }
                        else if(arr[0] == 'X'){
                            if(arr[1] == '大'){
                                exs[parseInt(eleidx)] += clcSkill(slv, 21, 1);
                                exd[parseInt(eleidx)] += clcSkill(slv, 41, 1);
                            }else if(arr[1] == '中'){
                                exs[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                                exd[parseInt(eleidx)] += clcSkill(slv, 26, 1);
                            }else{
                                exs[parseInt(eleidx)] += clcSkill(slv, 1, 1);
                                exd[parseInt(eleidx)] += clcSkill(slv, 11, 1);                     
                            }
                        }
                        else if(arr[0] == 'E'){
                            if(arr[1] == '大'){
                                elp[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }else if(arr[1] == '中'){
                                elp[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }else{
                                elp[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }
                        }
                        else if(arr[0] == 'H'){
                            if(arr[1] == '大'){
                                ase[parseInt(eleidx)] += clcSkill(slv, 11, 1);
                            }else if(arr[1] == '中'){
                                ase[parseInt(eleidx)] += clcSkill(slv, 8, 1);
                            }else{
                                ase[parseInt(eleidx)] += clcSkill(slv, 5, 1);
                            }
                        }
                    }
                }
            }
        }
    }
    for(var i=0; i < asa.length; i++) {
        $('#' + 'wep_asa' + (i + 1)).val(asa[i] + pra[i]);
        $('#' + 'wep_zsa' + (i + 1)).val(zsa[i]);
        $('#' + 'wep_dff' + (i + 1)).val(dff[i]);
        $('#' + 'wep_vig' + (i + 1)).val(vig[i]);
        $('#' + 'wep_exs' + (i + 1)).val(Math.min(exs[i],100));
        $('#' + 'wep_exd' + (i + 1)).val(Math.min(exs[i],500));
        $('#' + 'wep_elp' + (i + 1)).val(elp[i]);
        $('#' + 'wep_tks' + (i + 1)).val(tes[i]);
        $('#' + 'wep_tkd' + (i + 1)).val(ted[i]);
        $('#' + 'wep_ase' + (i + 1)).val(Math.min(ase[i],200));
        $('#' + 'wep_dp' + (i + 1)).val(dp[i]);
    }   
}

function clcSkill(slv, kiso, plus){
    return shosu(kiso + ((slv-1) * plus),2);
}

function shosu(val , n){
    return Math.round( val * Math.pow( 10, n ) ) / Math.pow( 10, n ) ;
}

function getAllWepAt(){
    var at = 0;
    for(var id = 1; id < 11; ++id){
        var select = document.getElementById('wep' + id + '_name');
        var lv = document.getElementById('wep' + id + '_lv');
        var slv = document.getElementById('wep' + id + '_slv');
        var info = document.getElementById('wep' + id + '_info');
        var plus = document.getElementById('wep' + id + '_plus');
        var final = document.getElementById('wep' + id + '_final');
        var wep_id = select.value;
        if (wep_id != 0) {
            var weapon = Weapons[WeaponsId[wep_id]];
            if(isTokuiWep(weapon)){
                at = at + (getWepAt(weapon,  parseInt(lv.value) , parseInt(plus.value)) * 1.2);
            }else{
                at = at + getWepAt(weapon,  parseInt(lv.value) , parseInt(plus.value));
            }
        }
    }
    return Math.round(at);
}

function getAllWepHp(){
    var hp = 0;
    for(var id = 1; id < 11; ++id){
        var select = document.getElementById('wep' + id + '_name');
        var lv = document.getElementById('wep' + id + '_lv');
        var slv = document.getElementById('wep' + id + '_slv');
        var info = document.getElementById('wep' + id + '_info');
        var plus = document.getElementById('wep' + id + '_plus');
        var final = document.getElementById('wep' + id + '_final');
        var wep_id = select.value;
        if (wep_id != 0) {
            var weapon = Weapons[WeaponsId[wep_id]];
            if(isTokuiWep(weapon)){
                hp = hp + (getWepHp(weapon,  parseInt(lv.value) , parseInt(plus.value)) * 1.2);
            }else{
                hp = hp + getWepHp(weapon,  parseInt(lv.value) , parseInt(plus.value));
            }
        }
    }
    return Math.round(hp);
}

function wep_sibori_change(){
    var sibori = new Array(13);
    for(var i = 1; i < 14; ++i){
        if(document.getElementById('wep1_sibori' + i).checked){
            sibori[i-1] = 1;
        }else{
            sibori[i-1] = 0;
        }
    }
    for (var i = 1; i < 11; ++i) {
           setselect('wep'+ i +'_name', Weapons, true, sibori);
    }
    $(".chosen-select").prop('disabled', true).trigger('chosen:updated');
    $(".chosen-select").prop('disabled', false).trigger('chosen:updated');
}

function wep_lvmax(){
    for(var id = 1; id < 11; ++id){
        if($('#' + 'wep' + id + '_name').val()!= 0) {
            $('#' + 'wep' + id + '_lv').val(150);
            $('#' + 'wep' + id + '_slv').val(30);
            chk_max_min(document.getElementById('wep' + id + '_lv'));
            chk_max_min(document.getElementById('wep' + id + '_slv'));
            wep_info(id);
        }
    }
}

function wep_plusmax(){
    for(var id = 1; id < 11; ++id){
        if($('#' + 'wep' + id + '_name').val()!= 0) {
            $('#' + 'wep' + id + '_plus').val(99);
            wep_info(id);
        }
    }
}

function wep_clear(){
    for(var id = 1; id < 11; ++id){
        if(id != 1){
            $('#' + 'wep' + id + '_name').val(0);
            $('#' + 'wep' + id + '_lv').prop("disabled",true);
            $('#' + 'wep' + id + '_slv').prop("disabled",true);
            $('#' + 'wep' + id + '_plus').prop("disabled",true);
        }
        $('#' + 'wep' + id + '_lv').val(1);
        $('#' + 'wep' + id + '_slv').val(1);
        $('#' + 'wep' + id + '_info').html('');
        $('#' + 'wep' + id + '_plus').val(0);
        $('#' + 'wep' + id + '_final').prop("checked",false);
        $('#' + 'wep' + id + '_final').prop("disabled",true);
    }
    clcjob();
}

function gen_change(id) {
    var select = document.getElementById('gen' + id + '_name');
    var lv = document.getElementById('gen' + id + '_lv');
    var plus = document.getElementById('gen' + id + '_plus');
    var gen_id = select.value;
    if (gen_id == 0) {
        lv.disabled = "true";
        if (id != 2){plus.disabled = "true"};
        gen_info(id);
        return;
    }else{
        lv.disabled = "";
        if (id != 2){plus.disabled = ""};
    }
    
    var gen = Gens[gen_id];
    lv.max = getMaxlv(gen);
    lv.min = 1;
    chk_max_min(lv);
    gen_info(id);
}

function gen_info(id) {
    var select = document.getElementById('gen' + id + '_name');
    var lv = document.getElementById('gen' + id + '_lv');
    var info = document.getElementById('gen' + id + '_info');
    if(lv.value == ""){lv.value=1;}
    chk_max_min(lv);
    var gen_id = select.value;
    if (gen_id == 0) {
        info.innerHTML = "";
    }else{
        var gen = Gens[gen_id];
        var skill = getGenSkill(gen, parseInt(lv.value));
        if(id == 2){
            info.innerHTML = skill;
        }else if(id==1){
            var plus = document.getElementById('gen' + id + '_plus');
            if(plus.value == ""){plus.value=0;}
            var at = getWepAt(gen,  parseInt(lv.value) , parseInt(plus.value));
            var hp = getWepHp(gen,  parseInt(lv.value) , parseInt(plus.value));
            info.innerHTML = "攻撃力：" + at + "　HP：" + hp + '　' + skill;
        }else{
            var plus = document.getElementById('gen' + id + '_plus');
            var at = getWepAt(gen,  parseInt(lv.value) , parseInt(plus.value));
            var hp = getWepHp(gen,  parseInt(lv.value) , parseInt(plus.value));
            info.innerHTML = "攻撃力：" + at + "　HP：" + hp;        
        }
    }
    clcjob();
}

function getGenSkill(obj,lv){
    if(obj == null){return ""}
    if(obj.rea == "SSR"){
        if(lv < 41){
            return obj.eff0;
        }else if (lv < 66) {
            return  obj.eff1;
        }else if (lv < 71) {
            return  obj.eff2;
        }else if (lv < 86) {
            return  obj.eff3;
        }else{
            return  obj.eff4;
        }
    }else if (obj.rea == "SR") {
        if(lv < 31){
            return obj.eff0;
        }else if (lv < 56) {
            return  obj.eff1;
        }else if (lv < 61) {
            return  obj.eff2;
        }else if (lv < 76) {
            return  obj.eff3;
        }else{
            return  obj.eff4;
        }
    }else if (obj.rea == "R") {
        if(lv < 21){
            return obj.eff0;
        }else if (lv < 31) {
            return  obj.eff1;
        }else if (lv < 41) {
            return  obj.eff2;
        }else if (lv < 51) {
            return  obj.eff3;
        }else{
            return  obj.eff4;
        }
    }else{
        if(lv < 11){
            return obj.eff0;
        }else if (lv < 21) {
            return  obj.eff1;
        }else if (lv < 31) {
            return  obj.eff2;
        }else if (lv < 41) {
            return  obj.eff3;
        }else{
            return  obj.eff4;
        }
    }
}

function gen_sibori_change(){
    var sibori = new Array(11);
    for(var i = 1; i < 12; ++i){
        if(document.getElementById('gen1_sibori' + i).checked){
            sibori[i-1] = 1;
        }else{
            sibori[i-1] = 0;
        }
    }
    setselect('gen1_name', Gens, false, sibori);
    gen_info(1);
    setselect('gen2_name', Gens, false, sibori);
    gen_info(2);
    for (var i = 3; i < 8; ++i) {
           setselect('gen'+ i +'_name', Gens, true, sibori);
    }
    $(".chosen-select").prop('disabled', true).trigger('chosen:updated');
    $(".chosen-select").prop('disabled', false).trigger('chosen:updated');
}

function gen_lvmax(){
    for(var id = 1; id < 8; ++id){
        if($('#' + 'gen' + id + '_name').val()!= 0) {
            var gen =  Gens[$('#' + 'gen' + id + '_name').val()];
            $('#' + 'gen' + id + '_lv').val(getMaxlv(gen));
            gen_info(id);
        }
    }
}

function gen_plusmax(){
    for(var id = 1; id < 8; ++id){
        if($('#' + 'gen' + id + '_name').val()!= 0) {
            $('#' + 'gen' + id + '_plus').val(99);
            gen_info(id);
        }
    }
}

function gen_clear(){
    for(var id = 1; id < 8; ++id){
        if(id > 2){
          $('#' + 'gen' + id + '_name').val(0);
        }
        $('#' + 'gen' + id + '_lv').val(1);
        $('#' + 'gen' + id + '_info').html('');
        if(id != 2){
          $('#' + 'gen' + id + '_plus').val(0);
        }
    }
    gen_info(1);
    gen_info(2);
}

function ExtractNum(str){
    var num = new String( str ).match(/\d/g);
    if(num==null){return '';}
    num = num.join("");
    if (parseInt(num) > 160){
        num = num.substring(1)
    }
    return num;
}

function gen_eff(str, arr, sub, ele){
    var zoku = 0;
    
    var up = subgensui(ele,sub,ExtractNum(str));
    if(up != null && up != ''){
        if ( ~str.indexOf('火') || ~str.indexOf('全属性') || ~str.indexOf('特殊')) {
            zoku = 0;
            if ( ~str.indexOf('属性攻撃')) {
                arr[zoku] += parseInt(up);
            }else if( ~str.indexOf('HPが減るほど特殊攻撃') && ~str.indexOf('火')){
                arr[zoku + 18] += (10 + (parseInt(up) - 10) * ((100 - parseInt($('#zhp').val())) / 100));
            }else if( ~str.indexOf('HPが多いほど攻撃UP') && ~str.indexOf('火')){
                arr[zoku + 18] += Math.max(shosu(Math.pow(47,($('#zhp').val()/100))-Math.pow(47,0.5) ,0),0);
            }else if( ~str.indexOf('特殊攻撃')){
                arr[zoku + 18] += parseInt(up);
            }else if( ~str.indexOf('攻撃')){
                arr[zoku + 6] += parseInt(up);
            }
            if( ~str.indexOf('HP') && str.indexOf('HPが減るほど特殊攻撃') == -1  && str.indexOf('HPが多いほど') == -1){
                arr[zoku + 12] += parseInt(up);
            }
        }
        if ( ~str.indexOf('水') || ~str.indexOf('全属性') || ~str.indexOf('特殊')) {
            zoku = 1;
            if ( ~str.indexOf('属性攻撃')) {
                arr[zoku] += parseInt(up);
            }else if( ~str.indexOf('HPが減るほど特殊攻撃') && ~str.indexOf('水')){
                arr[zoku + 18] += (10 + (parseInt(up) - 10) * ((100 - parseInt($('#zhp').val())) / 100));
            }else if( ~str.indexOf('HPが多いほど攻撃UP') && ~str.indexOf('水')){
                arr[zoku + 18] += Math.max(shosu(Math.pow(47,($('#zhp').val()/100))-Math.pow(47,0.5) ,0),0);
            }else if( ~str.indexOf('特殊攻撃')){
                arr[zoku + 18] += parseInt(up);
            }else if( ~str.indexOf('攻撃')){
                arr[zoku + 6] += parseInt(up);
            }
            if( ~str.indexOf('HP') && str.indexOf('HPが減るほど特殊攻撃') == -1  && str.indexOf('HPが多いほど') == -1){
                arr[zoku + 12] += parseInt(up);
            }
        }
        if ( ~str.indexOf('風') || ~str.indexOf('全属性') || ~str.indexOf('特殊')) {
            zoku = 2;
            if ( ~str.indexOf('属性攻撃')) {
                arr[zoku] += parseInt(up);
            }else if( ~str.indexOf('HPが減るほど特殊攻撃') && ~str.indexOf('風')){
                arr[zoku + 18] += (10 + (parseInt(up) - 10) * ((100 - parseInt($('#zhp').val())) / 100));
            }else if( ~str.indexOf('HPが多いほど攻撃UP') && ~str.indexOf('風')){
                arr[zoku + 18] += Math.max(shosu(Math.pow(47,($('#zhp').val()/100))-Math.pow(47,0.5) ,0),0);
            }else if( ~str.indexOf('特殊攻撃')){
                arr[zoku + 18] += parseInt(up);
            }else if( ~str.indexOf('攻撃')){
                arr[zoku + 6] += parseInt(up);
            }
            if( ~str.indexOf('HP') && str.indexOf('HPが減るほど特殊攻撃') == -1  && str.indexOf('HPが多いほど') == -1){
                arr[zoku + 12] += parseInt(up);
            }           
        }
        if ( ~str.indexOf('雷') || ~str.indexOf('全属性') || ~str.indexOf('特殊')) {
            zoku = 3;
            if ( ~str.indexOf('属性攻撃')) {
                arr[zoku] += parseInt(up);
            }else if( ~str.indexOf('HPが減るほど特殊攻撃') && ~str.indexOf('雷')){
                arr[zoku + 18] += (10 + (parseInt(up) - 10) * ((100 - parseInt($('#zhp').val())) / 100));
            }else if( ~str.indexOf('HPが多いほど攻撃UP') && ~str.indexOf('雷')){
                arr[zoku + 18] += Math.max(shosu(Math.pow(47,($('#zhp').val()/100))-Math.pow(47,0.5) ,0),0);
            }else if( ~str.indexOf('特殊攻撃')){
                arr[zoku + 18] += parseInt(up);
            }else if( ~str.indexOf('攻撃')){
                arr[zoku + 6] += parseInt(up);
            }
            if( ~str.indexOf('HP') && str.indexOf('HPが減るほど特殊攻撃') == -1 && str.indexOf('HPが多いほど') == -1){
                arr[zoku + 12] += parseInt(up);
            }              
        }
        if ( ~str.indexOf('光') || ~str.indexOf('全属性') || ~str.indexOf('特殊')) {
            zoku = 5;
            if ( ~str.indexOf('属性攻撃')) {
                arr[zoku] += parseInt(up);
            }else if( ~str.indexOf('HPが減るほど特殊攻撃') && ~str.indexOf('光')){
                arr[zoku + 18] += (10 + (parseInt(up) - 10) * ((100 - parseInt($('#zhp').val())) / 100));
            }else if( ~str.indexOf('HPが多いほど攻撃UP') && ~str.indexOf('光')){
                arr[zoku + 18] += Math.max(shosu(Math.pow(47,($('#zhp').val()/100))-Math.pow(47,0.5) ,0),0);
            }else if( ~str.indexOf('特殊攻撃')){
                arr[zoku + 18] += parseInt(up);
            }else if( ~str.indexOf('攻撃')){
                arr[zoku + 6] += parseInt(up);
            }
            if( ~str.indexOf('HP') && str.indexOf('HPが減るほど特殊攻撃') == -1 && str.indexOf('HPが多いほど') == -1){
                arr[zoku + 12] += parseInt(up);
            }              
        }
        if ( ~str.indexOf('闇') || ~str.indexOf('全属性') || ~str.indexOf('特殊')) {
            zoku = 4;
            if ( ~str.indexOf('属性攻撃')) {
                arr[zoku] += parseInt(up);
            }else if( ~str.indexOf('HPが減るほど特殊攻撃') && ~str.indexOf('闇')){
                arr[zoku + 18] += (10 + (parseInt(up) - 10) * ((100 - parseInt($('#zhp').val())) / 100));
            }else if( ~str.indexOf('HPが多いほど攻撃UP') && ~str.indexOf('闇')){
                arr[zoku + 18] += Math.max(shosu(Math.pow(47,($('#zhp').val()/100))-Math.pow(47,0.5) ,0),0);
            }else if( ~str.indexOf('特殊攻撃')){
                arr[zoku + 18] += parseInt(up);
            }else if( ~str.indexOf('攻撃')){
                arr[zoku + 6] += parseInt(up);
            }
            if( ~str.indexOf('HP') && str.indexOf('HPが減るほど特殊攻撃') == -1  && str.indexOf('HPが多いほど') == -1){
                arr[zoku + 12] += parseInt(up);
            }              
        }
        if ( ~str.indexOf('装備中の「ルミナ」')){
	    zoku = 5;
            arr[zoku + 24] += parseInt(up);
	}
        if ( ~str.indexOf('装備中の「シュバルツ」')){
	    zoku = 4;
            arr[zoku + 24] += parseInt(up);
	}
        if ( ~str.indexOf('装備中の「タービランス」')){
	    zoku = 2;
            arr[zoku + 24] += parseInt(up);
	}
        if ( ~str.indexOf('装備中の「インパルス」')){
	    zoku = 3;
            arr[zoku + 24] += parseInt(up);
	}
        if ( ~str.indexOf('装備中の「インフェルノ」')){
	    zoku = 0;
            arr[zoku + 24] += parseInt(up);
	}
        if ( ~str.indexOf('装備中の「コキュートス」')){
	    zoku = 1;
            arr[zoku + 24] += parseInt(up);
	}
    }
    return arr;
}

function subgensui(zoku,sub,up){
    var itti = 0;
    if (sub == null || sub == ''){
        return up;
    }else{
        for(var i = 3; i < 8 ; i++){
            if($('#gen' + i + '_name').val() != 0){
                if (Gens[$('#gen' + i + '_name').val()].ele == zoku){
                   itti = itti + 1;
                }
            }
        }
        return parseInt(sub) + (parseInt(up) - parseInt(sub)) *(itti / 5);
    }
}

function getAllGenAt(){
    var at = 0;
    for(var id = 1; id < 8; ++id){
        var select = document.getElementById('gen' + id + '_name');
        var lv = document.getElementById('gen' + id + '_lv');
        var plus = document.getElementById('gen' + id + '_plus');
        var gen_id = select.value;
        if (gen_id != 0 && id != 2) {
            var gen = Gens[gen_id];
            if(isTokuiGen(gen)){
                at = at + (getWepAt(gen,  parseInt(lv.value) , parseInt(plus.value)) * 1.1);
            }else{
                at = at + getWepAt(gen,  parseInt(lv.value) , parseInt(plus.value));
            }
        }
    }
    return Math.round(at);
}

function getAllGenHp(){
    var hp = 0;
    for(var id = 1; id < 8; ++id){
        var select = document.getElementById('gen' + id + '_name');
        var lv = document.getElementById('gen' + id + '_lv');
        var plus = document.getElementById('gen' + id + '_plus');
        var gen_id = select.value;
        if (gen_id != 0 && id != 2) {
            var gen = Gens[gen_id];
            if(isTokuiGen(gen)){
                hp = hp + (getWepHp(gen,  parseInt(lv.value) , parseInt(plus.value)) * 1.1);
            }else{
                hp = hp + getWepHp(gen,  parseInt(lv.value) , parseInt(plus.value));
            }
        }
    }
    return Math.round(hp);
}

function setDispEiki(job){
    // 攻撃力アップ大
    if(job.atkdai=='0'){
        $('#tr_eiki_atkdai').css('display','none');
	$('#eiki_atkdai').val(0);
    } else {
        $('#tr_eiki_atkdai').css('display','');   
    }
    // 攻撃力アップ中
    if(job.atkchu=='0'){
        $('#tr_eiki_atkchu').css('display','none');
	$('#eiki_atkchu').val(0);
    } else {
        $('#tr_eiki_atkchu').css('display','');   
    }
    // 攻撃力アップ小
    if(job.atksho=='0'){
        $('#tr_eiki_atksho').css('display','none');
	$('#eiki_atksho').val(0);
    } else {
        $('#tr_eiki_atksho').css('display','');   
    }
    // HPUP1
    if(job.hpup=='0'){
        $('#tr_eiki_hpup').css('display','none');
	$('#eiki_hpup').val(0);
    } else {
        $('#tr_eiki_hpup').css('display','');   
    }
    // HPUP2
    if(job.hpup!='2'){
        $('#tr_eiki_hpup2').css('display','none');
	$('#eiki_hpup2').val(0);
    } else {
        $('#tr_eiki_hpup2').css('display','');   
    }
    // バースト性能
    if(job.burstup=='0'){
        $('#tr_eiki_burstup').css('display','none');
	$('#eiki_burstup').val(0);
    } else {
        $('#tr_eiki_burstup').css('display','');   
    }
    // バースト性能
    if(job.burstup!='2'){
        $('#tr_eiki_burstup2').css('display','none');
	$('#eiki_burstup2').val(0);
    } else {
        $('#tr_eiki_burstup2').css('display','');   
    }
}

function clceikiatk(){
    rtn = 0;
    if (parseInt($('#eiki_atkdai').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_atkdai').val()) * 2 + 4;
    }
    if (parseInt($('#eiki_atkchu').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_atkchu').val()) * 2 + 2;
    }
    if (parseInt($('#eiki_atksho').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_atksho').val()) * 2;
    }
    return rtn;
}

function clceikihp(){
    rtn = 0;
    if (parseInt($('#eiki_hpup').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_hpup').val()) * 2 + 2;
    }
    if (parseInt($('#eiki_hpup2').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_hpup2').val()) * 2 + 2;
    }
    return rtn;
}

function clcburstup(){
    rtn = 0;
    if (parseInt($('#eiki_burstup').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_burstup').val()) * 5;
    }
    if (parseInt($('#eiki_burstup2').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_burstup2').val()) * 5;
    }
    return rtn;
}

function clcburstupd(){
    rtn = 0;
    if (parseInt($('#eiki_burstup').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_burstup').val()) * 20;
    }
    if (parseInt($('#eiki_burstup2').val()) != 0) {
        rtn = rtn + parseInt($('#eiki_burstup2').val()) * 20;
    }
    return rtn;
}

function clcjob(){
   var rank = document.getElementById('rank').value;
    var job = document.getElementById('job').value;
    var master_at = 1 + ($('#masterat').val() / 100);
    var master_hp = 1 + ($('#masterhp').val() /100);
    selected_job = Jobs[JobsId[job]];
 
    //英気解放の表示
    setDispEiki(selected_job);
   
    var wep_at = getAllWepAt();
    var wep_hp = getAllWepHp();
    getAllWepSkill();
    
    var gen_at = getAllGenAt();
    var gen_hp = getAllGenHp();
    var shugo_ten =0;
     //0-5 属性アップ  6-11 キャラアップ  12-17 HPアップ  18-23 特殊攻撃　24-29武器アップ
    var arr = new Array(30);
    for(var i=0; i < arr.length; i++) {
        arr[i] = 0;
    }
    
    var main_gen = Gens[$('#gen1_name').val()];
    if(main_gen != null){
        var main_lv = parseInt($('#gen1_lv').val());
        var skills = getGenSkill(main_gen, main_lv).split('/');
        for (var i = 0; i < skills.length ; i++) {
            arr = gen_eff(skills[0].slice(0, 1) + skills[i],arr,main_gen.sub,main_gen.ele);
        }
    }
    var sub_gen = Gens[$('#gen2_name').val()];
    if(sub_gen != null){
        var sub_lv = parseInt($('#gen2_lv').val());
        var skills = getGenSkill(sub_gen, sub_lv).split('/');
        for (var i = 0; i < skills.length ; i++) {
            arr = gen_eff(skills[0].slice(0, 1) + skills[i],arr,sub_gen.sub,sub_gen.ele);
        }
    }
    
    var disp_hp = Math.round((600 + parseInt(selected_job.pulshp) + runkbonus('hp',rank) + wep_hp + gen_hp) * master_hp);
    var disp_at = Math.round((1000 + parseInt(selected_job.pulsat) + runkbonus('at',rank) + wep_at + gen_at) * master_at);
    document.getElementById('uni1_hp').value = disp_hp;
    document.getElementById('uni1_at').value = disp_at;
    
    //武器効果アップ幻獣    
    shugo_ten = 1+ (parseInt(arr[parseInt(main_ele) + 24]) / 100)

    //通常攻撃
    if(main_ele == '99'){
        $('#exp_dam').val(disp_at);
    }else{
        //キャラアップ & アサルト & 英気解放
        disp_at = disp_at * (1 + ((parseInt($('#wep_asa' + (parseInt(main_ele) + 1)).val()) * shugo_ten) + parseInt(arr[parseInt(main_ele) + 6]) + clceikiatk()) / 100);
        //属性アップ
        disp_at = disp_at * (1 + (parseInt($('#wep_zsa' + (parseInt(main_ele) + 1)).val()) + parseInt(arr[parseInt(main_ele)]) + jyakuten()) / 100);
        //特殊アップ
        disp_at = disp_at * (1 + parseInt(arr[parseInt(main_ele) + 18]) / 100 + (parseInt($('#wep_vig' + (parseInt(main_ele) + 1)).val() * shugo_ten)) / 100);
        //ユニオン守護神
        if ($('input[name=shugo]:checked').val() === '1'){
            disp_at = disp_at * (1 + 6 / 100);
        }
        //敵防御
        disp_at = disp_at / (parseInt($('#edff').val()) * (1 - parseInt($('#edebuf').val()) / 100));
        //テクニカ
        var tek = 1 + parseInt($('#wep_tks' + (parseInt(main_ele) + 1)).val() * shugo_ten) / 100;
        var tekd = 1 + parseInt($('#wep_tkd' + (parseInt(main_ele) + 1)).val() * shugo_ten) / 100;
        if(isNaN(tek)){tek=1;}
        if(isNaN(tekd)){tekd=1;}
        $('#exp_dam').val(Math.round(gensui(disp_at*tekd,350000*tek)));
    }
    
    //HP
    if(main_ele == '99'){
        $('#exp_hp').val(disp_hp);
    }else{
        disp_hp = disp_hp * (1 + ((parseInt($('#wep_dff' + (parseInt(main_ele) + 1)).val()) * shugo_ten) + parseInt(arr[parseInt(main_ele) + 12]) + clceikihp()) / 100);
        // デスペレート
        var dp = 1 + parseInt($('#wep_dp' + (parseInt(main_ele) + 1)).val());
        if(isNaN(dp)){dp=0;}
        $('#exp_hp').val(Math.round(disp_hp * (1 - (dp/100))) );
    }

    //バースト
    var disp_vdam = disp_at;
    if(main_ele == '99'){
        $('#exp_vdam').val(Math.round(gensui(disp_vdam,1000000)));
    }else{
        var exsmax = 1000000 * (1 + Math.min((parseInt($('#wep_exs' + (parseInt(main_ele) + 1)).val() * shugo_ten) + clcburstup()),100) / 100)
        var weapon = Weapons[WeaponsId[$('#wep1_name').val()]];
        var final = $('#wep1_final').prop("checked");
        var hoka = 0;
        if(selected_job.name = '信玄'){
            hoka = 30;
        }
        
        var disp_vdam = clcvarst(weapon.rea, final, parseInt($('#wep1_lv').val()), parseInt(disp_vdam), Math.min(hoka + (parseInt($('#wep_exd' + (parseInt(main_ele) + 1)).val() * shugo_ten)) + clcburstupd(),500));
        $('#exp_vdam').val(Math.round(gensui(disp_vdam,exsmax)));
    }
    //アセンション他
    if (shugo_ten != 1){
         $('#tr_exp_ase')[0].style.display = '';
         $('#tr_exp_exd')[0].style.display = '';
         //$('#tr_exp_exs')[0].style.display = '';
         $('#tr_exp_elp')[0].style.display = '';
         $('#exp_ase').val(Math.round(Math.min(parseInt($('#wep_ase' + (parseInt(main_ele) + 1)).val()) * shugo_ten),200));
         //$('#exp_exs').val(parseInt($('#wep_exs' + (parseInt(main_ele) + 1)).val()) * shugo_ten);
         $('#exp_exd').val(Math.round(Math.min((parseInt($('#wep_exs' + (parseInt(main_ele) + 1)).val() * shugo_ten) + clcburstup()),100)));
         $('#exp_elp').val(Math.round(parseInt($('#wep_elp' + (parseInt(main_ele) + 1)).val()) * shugo_ten));
    } else {
         $('#tr_exp_ase')[0].style.display = 'none';
         $('#tr_exp_exd')[0].style.display = 'none';
         $('#tr_exp_exs')[0].style.display = 'none';
         $('#tr_exp_elp')[0].style.display = 'none';
    }
}

function clcvarst(rea,kakusei,lv,dam,exe){
    if(rea == 'SSR'){
        if(kakusei){
            return dam * (5 + exe / 100) + 3000;
        }else if(lv > 100){
            return dam * (4.5 + exe / 100) + 2500;
        }else{
            return dam * (4 + exe / 100) + 2500;
        }
    }else if(rea == 'SR'){
        if(lv > 70){
            return dam * (3.5 + exe / 100) + 2000;
        }else{
            return dam * (3 + exe / 100) + 2000;
        }
    }else if(rea == 'R'){
        if(lv > 50){
            return dam * (2.5 + exe / 100) + 1500;
        }else{
            return dam * (2 + exe / 100) + 1500;
        }
    }else{
        if(lv > 40){
            return dam * (2 + exe / 100) + 1000;
        }else{
            return dam * (1.5 + exe / 100) + 1000;
        }
    }
}

function runkbonus(typ , rank){
    if(typ=='at'){
        if(rank > 100){
            return (rank - 100) * 20 + 4000;
        }else{
            return rank * 40;
        }
    }else{
         if(rank > 100){
            return (rank - 100) * 2 + 800;
        }else{
            return rank * 8;
        }   
    }
}

function isTokuiWep(Weapon){
    var weps = selected_job.wep.split('/');
    for (var i = 0; i < 2 ; i++) {
       if(Weapon.typ == weps[i]){
            return true;
       }
    }
    return false;
}

function isTokuiGen(gen){
    if(main_ele == gen.ele){
        return true;
    }else{
        return false;
    }
}

function jyakuten(){
    var ret = 0;
    if($('input[name=jyaku]:checked').val() === '2') {
        ret = ret - 25;
    } else {
        if(main_ele == '4' || main_ele == '5'){
            ret = ret + 3;
        }
        if($('input[name=jyaku]:checked').val() === '1'){
            ret = ret + 45;
        }
    }
    return ret;
}

function gensui(dam,max){
    if(dam <= max){
        return dam;
    }else{
        var gendam = dam - max;
        return max + (gendam / 10);
    }
}

function save_click(id){
    var save_name;
    if(parseInt(id) < 11){
        if(window.confirm('現在の入力値データを保存します')){
            Cookies.set(id, urlprm_save(id),{ expires: 3650, path: '/'});
            window.alert('データを保存しました');
	    }
	    else{
		    window.alert('キャンセルしました');
        }
    //サーバー保存
    } else {
        komadomodal('kamihime-server-save.html','_blank',800, 250, 0 , 10,server_save_OK,serverNg);
    }
}

function serverNg(){
    window.alert('キャンセルしました');
}

function server_save_OK(){
    var url = 'https://bzgameblog.net/sakusei/kamihime/clacinsert.php'
    url += '?urlprm=' + replaceAll(urlprm_save(11),'&','%26');
    url += '&name=' + encodeURI(save_name_server);
    url += '&biko=' + encodeURI(save_biko);
    save_no = exephp(url)[0];
    url_hakko_srv();
    window.alert('データを保存しました');    
}

function exephp(url){
    var ret;
    $.ajaxSetup({ async: false });
    $.get(
        url,
        null,
        function(data, status) {
            var array = data.split('||');
            ret = array;
        }
    );
    $.ajaxSetup({ async: true });
    return ret; 
}

function load_click(id){
    if(parseInt(id) < 11){
        var str = Cookies.get(id);
        if(str === undefined || str == null || str == ''){
         window.alert('データがありません');
    
        }else if(window.confirm('現在の入力値を破棄してデータを読み込みます')){
            urlprm_load(str);
	        window.alert('データを読込ました');
	    }else{
		    window.alert('キャンセルしました');
        }
    //サーバー保存
    } else {
        load_names = exephp('https://bzgameblog.net/sakusei/kamihime/calcgetnames.php');
        komadomodal('kamihime-server-load.html','_blank',850, 600, 0 , 10,server_load_OK,serverNg);
    }
}

function server_load_OK(){
    url_hakko_srv();
    window.alert('データを読込ました');    
}


function delete_click(id){
    if(window.confirm('保存データを削除します')){
        Cookies.remove(id);
	    window.alert('データを削除しました');
	    setCookieName();
	}
	else{
		window.alert('キャンセルしました');
	}
}

function urlprm_save(id){
    var rtn ='?w=';
    //武器
    for (var i = 1; i < 11 ; i++) {
       if(i != 1){
           rtn = rtn + '_';
       }
       rtn = rtn + $('#wep'+ i +'_name').val();
    }
    //武器レベル
    rtn = rtn + '&wl='
    for (var i = 1; i < 11 ; i++) {
       if(i != 1){
           rtn = rtn + '_';
       }
       rtn = rtn + $('#wep'+ i +'_lv').val();
    }
    //武器スキルレベル
    rtn = rtn + '&wsl='
    for (var i = 1; i < 11 ; i++) {
       if(i != 1){
           rtn = rtn + '_';
       }
       rtn = rtn + $('#wep'+ i +'_slv').val();
    }
    //武器＋
    rtn = rtn + '&wbn='
    for (var i = 1; i < 11 ; i++) {
       if(i != 1){
           rtn = rtn + '_';
       }
       rtn = rtn + $('#wep'+ i +'_plus').val();
    }
    //武器最終限界突破
    rtn = rtn + '&wfi='
    for (var i = 1; i < 11 ; i++) {
       if(i != 1){
           rtn = rtn + '_';
       }
       if ($('#wep'+ i +'_final').prop("checked")){
           rtn = rtn + '1';
       }else{
           rtn = rtn + '0';
       }
    }
    //幻獣
    rtn = rtn + '&g='
    for (var i = 1; i < 8 ; i++) {
       if(i != 1){
           rtn = rtn + '_';
       }
       rtn = rtn + $('#gen'+ i +'_name').val();
    }
    //幻獣レベル
    rtn = rtn + '&gl='
    for (var i = 1; i < 8 ; i++) {
       if(i != 1){
           rtn = rtn + '_';
       }
       rtn = rtn + $('#gen'+ i +'_lv').val();
    }
    //幻獣＋
    rtn = rtn + '&gbn='
    for (var i = 1; i < 8 ; i++) {
       if(i != 1){
           rtn = rtn + '_';
       }
       if(i == 2){
           rtn = rtn + '0';
       }else{
           rtn = rtn + $('#gen'+ i +'_plus').val();
       }
    }
    //ランク
    if ($('#rank').val() != 1){
        rtn = rtn + '&r=' + $('#rank').val();
    }
    //英霊
    if ($('#job').val() != 1){
        rtn = rtn + '&j=' + $('#job').val();
    }
    //残HP
    if ($('#zhp').val() != 100){
        rtn = rtn + '&z=' + $('#zhp').val();
    }
    if (id!=0){
        //セーブファイル名
        rtn = rtn + '&n=' + $('#savename_' + id).val();
        //バージョン
        rtn = rtn + '&version=' + c_version;
        //アサルト
        rtn = rtn + '&result_asa=' +shosu($('#wep_asa' + (parseInt(main_ele) + 1)).val(),2);
        //属性攻撃
        rtn = rtn + '&result_zsa=' +shosu($('#wep_zsa' + (parseInt(main_ele) + 1)).val(),2);
        //ディフェンダー
        rtn = rtn + '&result_dff=' +shosu($('#wep_dff' + (parseInt(main_ele) + 1)).val(),2);
        //ヴィゴラス
        rtn = rtn + '&result_vig=' +shosu($('#wep_vig' + (parseInt(main_ele) + 1)).val(),2);
        //エクシード
        rtn = rtn + '&result_exs=' +shosu($('#wep_exs' + (parseInt(main_ele) + 1)).val(),2);
        //エラポレイト
        rtn = rtn + '&result_elp=' +shosu($('#wep_elp' + (parseInt(main_ele) + 1)).val(),2);
        //アセンション
        rtn = rtn + '&result_ase=' +shosu($('#wep_ase' + (parseInt(main_ele) + 1)).val(),2);
        //予測ダメージ
        rtn = rtn + '&result_exp_dam=' + $('#exp_dam').val();
        //予測HP
        rtn = rtn + '&result_exp_hp=' + $('#exp_hp').val();
        //予測バーストダメージ
        rtn = rtn + '&result_exp_vdam=' + $('#exp_vdam').val();
        //属性
        if(id != 11){
            rtn = rtn + '&main_ele=' + getele(parseInt(main_ele));
        }
        //テクニカ
        rtn = rtn + '&result_tes=' +shosu($('#wep_tes' + (parseInt(main_ele) + 1)).val(),2);
    }
    //英気解放
    //攻撃力アップ大
    if ($('#eiki_atkdai').val() != 0){
        rtn = rtn + '&ea=' + $('#eiki_atkdai').val();
    }
    //攻撃力アップ中
    if ($('#eiki_atkchu').val() != 0){
        rtn = rtn + '&ec=' + $('#eiki_atkchu').val();
    }
    //攻撃力アップ小
    if ($('#eiki_atksho').val() != 0){
        rtn = rtn + '&es=' + $('#eiki_atksho').val();
    }
    //HPUP
    if ($('#eiki_hpup').val() != 0){
        rtn = rtn + '&eh1=' + $('#eiki_hpup').val();
    }
    //HPUP2
    if ($('#eiki_hpup2').val() != 0){
        rtn = rtn + '&eh2=' + $('#eiki_hpup2').val();
    }
    //バーストアップ
    if ($('#eiki_burstup').val() != 0){
        rtn = rtn + '&eb=' + $('#eiki_burstup').val();
    }
    //バーストアップ
    if ($('#eiki_burstup2').val() != 0){
        rtn = rtn + '&eb2=' + $('#eiki_burstup2').val();
    }
    if (id!=0){
        //絞り込み
        for (var i = 1; i < 14 ; i++) {
            if ($('#wep1_sibori' + i).prop("checked")){
                rtn = rtn + '&sib' + i + '=1';
            } else {
                rtn = rtn + '&sib' + i + '=0';
            }
        }
        //絞り込み(幻獣)
        for (var i = 1; i < 12 ; i++) {
            if ($('#gen1_sibori' + i).prop("checked")){
                rtn = rtn + '&sibg' + i + '=1';
            } else {
                rtn = rtn + '&sibg' + i + '=0';
            }
        }
    }
    return rtn;
}

function getele(ele){
    if(ele == 0){return "火";}
    else if(ele == 1){return "水";}
    else if(ele == 2){return "風";}
    else if(ele == 3){return "雷";}
    else if(ele == 4){return "闇";}
    else if(ele == 5){return "光";}
    else{return "他";}
}

function urlprm_load(str){
    if(str.substr(0,5)=='?srv='){
        str = get_srvprm(str);
    }

    var arg = split_urlpram(str);

    //武器
    if(arg.w){
        var sp = arg.w.split('_');
        for (var i = 1; i < sp.length + 1 ; i++) {
            if($('#wep'+ i +'_name option').is_option({value:sp[i-1]}) == 0){
                $('#wep'+ i +'_name').append($('<option>').html(Weapons[WeaponsId[sp[i-1]]].name).val(sp[i-1]));
            }
            $('#wep'+ i +'_name').val(sp[i-1]);
        }
    }
    //武器最終限界突破
    if(arg.wfi){
        var sp = arg.wfi.split('_');
        for (var i = 1; i < sp.length + 1 ; i++) {
            if(sp[i-1] == '1'){
                $('#wep'+ i +'_final').prop('checked',true)
            }else{
                $('#wep'+ i +'_final').prop('checked',false)
            }
        }
    }
    for (var i = 1; i < arg.w.split('_').length + 1 ; i++) {
        wep_change(i)
    }
    //武器レベル
    if(arg.wl){
        var sp = arg.wl.split('_');
        for (var i = 1; i < sp.length + 1 ; i++) {
            $('#wep'+ i +'_lv').val(sp[i-1]);
        }
    }
    //武器スキルレベル
    if(arg.wsl){
        var sp = arg.wsl.split('_');
        for (var i = 1; i < sp.length + 1 ; i++) {
            $('#wep'+ i +'_slv').val(sp[i-1]);
        }
    }
    //武器ボーナス
    if(arg.wbn){
        var sp = arg.wbn.split('_');
        for (var i = 1; i < sp.length + 1 ; i++) {
            $('#wep'+ i +'_plus').val(sp[i-1]);
        }
    }
    for (var i = 1; i < arg.w.split('_').length + 1 ; i++) {
        wep_change(i)
    }

    //幻獣
    if(arg.g){
        var sp = arg.g.split('_');
        for (var i = 1; i < sp.length + 1 ; i++) {
            if($('#gen'+ i +'_name option').is_option({value:sp[i-1]}) == 0){
                $('#gen'+ i +'_name').append($('<option>').html(Gens[sp[i-1]].name).val(sp[i-1]));
            }
            $('#gen'+ i +'_name').val(sp[i-1]);
        }
    }
    
    //幻獣レベル
    if(arg.gl){
        var sp = arg.gl.split('_');
        for (var i = 1; i < sp.length + 1 ; i++) {
            $('#gen'+ i +'_lv').val(sp[i-1]);
        }
    }
    
    //幻獣ボーナス
    if(arg.gbn){
        var sp = arg.gbn.split('_');
        for (var i = 1; i < sp.length + 1 ; i++) {
            if(i != 2){
                $('#gen'+ i +'_plus').val(sp[i-1]);
            }
        }
    }

    for (var i = 1; i < arg.g.split('_').length + 1 ; i++) {
        gen_change(i)
    }

    //ランク
    if(arg.r){
        $('#rank').val(arg.r);
    }else{
        $('#rank').val('1');
    }
    //英霊
    if(arg.j){
        $('#job').val(arg.j);
    }else{
        $('#job').val('1');
    }
    //残HP
    if(arg.z){
        $('#zhp').val(arg.z);
    }else{
        $('#zhp').val('100');
    }

    //英気解放
    //攻撃力アップ大
    if(arg.ea){
        $('#eiki_atkdai').val(arg.ea);
    }else{
        $('#eiki_atkdai').val(0);
    }
    //攻撃力アップ中
    if(arg.ec){
        $('#eiki_atkchu').val(arg.ec);
    }else{
        $('#eiki_atkchu').val(0);
    }
    //攻撃力アップ小
    if(arg.es){
        $('#eiki_atksho').val(arg.es);
    }else{
        $('#eiki_atksho').val(0);
    }
    //HPUP
    if(arg.eh1){
        $('#eiki_hpup').val(arg.eh1);
    }else{
        $('#eiki_hpup').val(0);
    }
    //HPUP2
    if(arg.eh2){
        $('#eiki_hpup2').val(arg.eh2);
    }else{
        $('#eiki_hpup2').val(0);
    }
    //バーストアップ
    if(arg.eb){
        $('#eiki_burstup').val(arg.eb);
    }else{
        $('#eiki_burstup').val(0);
    }
    //バーストアップ2
    if(arg.eb2){
        $('#eiki_burstup2').val(arg.eb2);
    }else{
        $('#eiki_burstup2').val(0);
    }
    //絞り込み
    if(arg.sib1){
        chgcheck($('#wep1_sibori1'),arg.sib1);
    }
    if(arg.sib2){
        chgcheck($('#wep1_sibori2'),arg.sib2);
    }
    if(arg.sib3){
        chgcheck($('#wep1_sibori3'),arg.sib3);
    }
    if(arg.sib4){
        chgcheck($('#wep1_sibori4'),arg.sib4);
    }
    if(arg.sib5){
        chgcheck($('#wep1_sibori5'),arg.sib5);
    }
    if(arg.sib6){
        chgcheck($('#wep1_sibori6'),arg.sib6);
    }
    if(arg.sib7){
        chgcheck($('#wep1_sibori7'),arg.sib7);
    }
    if(arg.sib8){
        chgcheck($('#wep1_sibori8'),arg.sib8);
    }
    if(arg.sib9){
        chgcheck($('#wep1_sibori9'),arg.sib9);
    }
    if(arg.sib10){
        chgcheck($('#wep1_sibori10'),arg.sib10);
    }
    if(arg.sib11){
        chgcheck($('#wep1_sibori11'),arg.sib11);
    }
    if(arg.sib12){
        chgcheck($('#wep1_sibori12'),arg.sib12);
    }
    if(arg.sib13){
        chgcheck($('#wep1_sibori13'),arg.sib13);
    }
    //絞り込み
    if(arg.sibg1){
        chgcheck($('#gen1_sibori1'),arg.sibg1);
    }
    if(arg.sibg2){
        chgcheck($('#gen1_sibori2'),arg.sibg2);
    }
    if(arg.sibg3){
        chgcheck($('#gen1_sibori3'),arg.sibg3);
    }
    if(arg.sibg4){
        chgcheck($('#gen1_sibori4'),arg.sibg4);
    }
    if(arg.sibg5){
        chgcheck($('#gen1_sibori5'),arg.sibg5);
    }
    if(arg.sibg6){
        chgcheck($('#gen1_sibori6'),arg.sibg6);
    }
    if(arg.sibg7){
        chgcheck($('#gen1_sibori7'),arg.sibg7);
    }
    if(arg.sibg8){
        chgcheck($('#gen1_sibori8'),arg.sibg8);
    }
    if(arg.sibg9){
        chgcheck($('#gen1_sibori9'),arg.sibg9);
    }
    if(arg.sibg10){
        chgcheck($('#gen1_sibori10'),arg.sibg10);
    }
    if(arg.sibg11){
        chgcheck($('#gen1_sibori11'),arg.sibg11);
    }
    wep_sibori_change();
    gen_sibori_change();
    clcjob();
}

function chgcheck(chk,val){
    if(val=='1'){
        chk.prop('checked',true);
    }else{
        chk.prop('checked',false);
    }
}

function get_srvprm(str){
    var arg = split_urlpram(str);
    var url = 'https://bzgameblog.net/sakusei/kamihime/clacgetbyno.php'
    url += '?saveno=' + arg.srv;
    ret = exephp(url)[0].split('@@');
    save_name_server = ret[1];
    save_biko = ret[2];
    return ret[0];
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

function setCookieName(){
    var str ='';
    var arg = new Object;
    
    for(var id = 1 ; id < 11 ; id++){
       str = Cookies.get(id);
       if(str === undefined || str == null || str == ''){
           $('#savename_'+ id).val('');
       }else{
           arg = split_urlpram(str);
           $('#savename_'+ id).val(arg.n);
       }
    }
}

function url_hakko(){
    var str = 'http://' + location.host + location.pathname + urlprm_save(0);
    $('#url_result').val(str);
}

function url_hakko_srv(){
    var str = 'http://' + location.host + location.pathname + '?srv=' + save_no;
    $('#url_result_11').val(str);
}

function load_all(){
    var j = 1;
    var origin = '';
    for(var i = 1; i < 11;i++){
        var str = Cookies.get(i);
        $('#itiran' + i).val('');
        if(str === undefined || str == null || str == '' || str.length < 2){
            //データなし    
	}else{
            var arg = split_urlpram(str);
            if(!arg.version || arg.version != c_version){
                if(origin == ''){origin = urlprm_save(0);}
                urlprm_load(str);
                Cookies.set(i, urlprm_save(i),{ expires: 3650, path: '/'});
                var str = Cookies.get(i);
            }
            $('#itiran' + j).val(str);
            j = j + 1;
	}
    }
    if(origin !=''){
        urlprm_load(origin);
    }
    //if(j == 1){
        //window.alert('データが見つかりませんでした');
    //}else{
        komado('kamihime-itiran.html','_blank',screen.width - 100, 400,0,0);
    //}
    return false;
}

function komado(url,windowName,winWidth,winHeight,xin,yin){
    var x = (screen.width - winWidth) / 2;
    var y = (screen.height - winHeight) / 2;
    if(xin != 0){x = xin;} 
    if(yin != 0){y = yin;}
    var options = 'width = ' + winWidth + ',height = ' + winHeight + ',menubar = 0,toolbar = 0 ,location = 0 ,status = 0,resizable = 0,scrollbars = 1,left=' + x + ',top= ' + y + ';'
    open(url, windowName, options);
}

function komadomodal(url,windowName,winWidth,winHeight,xin,yin,okfunc,ngfunc){
    var x = (screen.width - winWidth) / 2;
    var y = (screen.height - winHeight) / 2;
    if(xin != 0){x = xin;} 
    if(yin != 0){y = yin;}
    var options = 'width = ' + winWidth + ',height = ' + winHeight + ',menubar = 0,toolbar = 0 ,location = 0 ,status = 0,resizable = 0,scrollbars = 1,left=' + x + ',top= ' + y + ';'
    var openWindow = open(url, windowName, options);
    var interval = setInterval(function(){
        if(!openWindow || openWindow.closed){
            clearInterval(interval);
            if(exe_yes==true){
                okfunc();
            } else {
                ngfunc();
            }
        } else {
            if(!openWindow.document.hasFocus()){
                //openWindow.focus();
            }
        }
    },1000);
}


function wepserch(){
	komado('kamihime-suggest.html','_blank',1000, 750, 0 , 10);
}

function isnullundef(str){
    if(str == '' || str == undefined || str == null){
        return true;
    } else {
        return false;
    }
}

function replaceAll(str, beforeStr, afterStr){
  var reg = new RegExp(beforeStr, "g");
  return str.replace(reg, afterStr);
}

 