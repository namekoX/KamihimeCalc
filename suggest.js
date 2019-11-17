/*
--------------------------------------------------------
suggest.js - Input Suggest
Version 2.3.1 (Update 2013/02/11)

Copyright (c) 2006-2013 onozaty (http://www.enjoyxstudy.com)

Released under an MIT-style license.

For details, see the web site:
 http://www.enjoyxstudy.com/javascript/suggest/

--------------------------------------------------------
*/

if (!Suggest) {
  var Suggest = {};
}
/*-- KeyCodes -----------------------------------------*/
Suggest.Key = {
  TAB:     9,
  RETURN: 13,
  ESC:    27,
  UP:     38,
  DOWN:   40
};

/*-- Utils --------------------------------------------*/
Suggest.copyProperties = function(dest, src) {
  for (var property in src) {
    dest[property] = src[property];
  }
  return dest;
};

/*-- Suggest.Local ------------------------------------*/
Suggest.Local = function() {
  this.initialize.apply(this, arguments);
};
Suggest.Local.prototype = {
  initialize: function(input, suggestArea, candidateList) {

    this.input = this._getElement(input);
    this.suggestArea = this._getElement(suggestArea);
    this.candidateList = candidateList;
    this.oldText = this.getInputText();

    if (arguments[3]) this.setOptions(arguments[3]);

    // reg event
    this._addEvent(this.input, 'focus', this._bind(this.checkLoop));
    //this._addEvent(this.input, 'blur', this._bind(this.inputBlur));
    //this._addEvent(this.suggestArea, 'blur', this._bind(this.inputBlur));

    this._addEvent(this.input, 'keydown', this._bindEvent(this.keyEvent));

    // init
    this.clearSuggestArea();
  },

  // options
  interval: 500,
  dispMax: 20,
  listTagName: 'div',
  prefix: false,
  ignoreCase: true,
  highlight: false,
  dispAllKey: false,
  classMouseOver: 'over',
  classSelect: 'select',
  hookBeforeSearch: function(){},

  setOptions: function(options) {
    Suggest.copyProperties(this, options);
  },

  checkLoop: function() {
    var text = this.getInputText();
    if (text != this.oldText) {
      this.oldText = text;
      this.search();
    }
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = setTimeout(this._bind(this.checkLoop), this.interval);
  },

  search: function() {

    // init
    this.clearSuggestArea();

    var text = this.getInputText();

    if (text == '' || text == null) return;

    this.hookBeforeSearch(text);
    var resultList = this._search(text);
    if (resultList.length != 0) this.createSuggestArea(resultList);
  },

  _search: function(text) {

    var resultList = [];
    var temp; 
    this.suggestIndexList = [];

    for (var i = 0, length = this.candidateList.length; i < length; i++) {
      if ((temp = this.isMatch(this.candidateList[i], text)) != null) {
        resultList.push(temp);
        this.suggestIndexList.push(i);

        if (this.dispMax != 0 && resultList.length >= this.dispMax) break;
      }
    }
    return resultList;
  },

  isMatch: function(value, pattern) {

    if (value == null) return null;

    var pos = (this.ignoreCase) ?
      value.toLowerCase().indexOf(pattern.toLowerCase())
      : value.indexOf(pattern);

    if ((pos == -1) || (this.prefix && pos != 0)) return null;

    if (this.highlight) {
      return (this._escapeHTML(value.substr(0, pos)) + '<strong><font color="red">' 
             + this._escapeHTML(value.substr(pos, pattern.length)) 
               + '</strong></font>' + this._escapeHTML(value.substr(pos + pattern.length)));
    } else {
      return this._escapeHTML(value);
    }
  },

  clearSuggestArea: function() {
    this.suggestArea.innerHTML = '';
    this.suggestArea.style.display = 'none';
    this.suggestList = null;
    this.suggestIndexList = null;
    this.activePosition = null;
  },

  createSuggestArea: function(resultList) {

    this.suggestList = [];
    this.inputValueBackup = this.input.value;
    var tobj = $('<table style=\"table-layout:fixed;width:820px\"></table>');
    //tobj.css('border','none');
    tobj.appendTo(this.suggestArea);
    for (var i = 0, length = resultList.length; i < length; i++) {
      var sp = resultList[i].split('@');
      var rowobj = $('<tr></tr>');
      //rowobj.css('border','none');
      rowobj.appendTo(tobj);
      var cellobj = $('<td width=\"250px\">' + sp[0] + '<br>' + sp[1] + '</td>');
      cellobj.css('border','none');
      cellobj.appendTo(rowobj);
      cellobj = $('<td><input type=\"button\" value = \"ƒƒCƒ“\" onclick = \"sel(' + i + ',1)\"></input></td>');
      cellobj.css('border','none');
      cellobj.appendTo(rowobj);
      
      for(var j = 1 ; j < 10; j ++){
          cellobj = $('<td><input type=\"button\" value = \"ƒTƒu' + j + ' \" onclick = \"sel(' + i + ',' + (j + 1) +')\"></input></td>');
          cellobj.css('border','none');
          cellobj.appendTo(rowobj);
      }
      
      $('<div id =\"val' + i + '\" style=\"display:none\">' + sp[2] + '</div>').appendTo(this.suggestArea);

    }

    this.suggestArea.style.display = '';
    this.suggestArea.scrollTop = 0;
  },

  getInputText: function() {
    return this.input.value;
  },

  setInputText: function(text) {
    this.input.value = text;
  },

  // key event
  keyEvent: function(event) {

    if (!this.timerId) {
      this.timerId = setTimeout(this._bind(this.checkLoop), this.interval);
    }

    if (this.dispAllKey && event.ctrlKey 
        && this.getInputText() == ''
        && !this.suggestList
        && event.keyCode == Suggest.Key.DOWN) {
      // dispAll
      this._stopEvent(event);
      this.keyEventDispAll();
    } else if (event.keyCode == Suggest.Key.UP ||
               event.keyCode == Suggest.Key.DOWN) {
      // key move
      if (this.suggestList && this.suggestList.length != 0) {
        this._stopEvent(event);
        this.keyEventMove(event.keyCode);
      }
    } else if (event.keyCode == Suggest.Key.RETURN) {
      // fix
      if (this.suggestList && this.suggestList.length != 0) {
        this._stopEvent(event);
        this.keyEventReturn();
      }
    } else if (event.keyCode == Suggest.Key.ESC) {
      // cancel
      if (this.suggestList && this.suggestList.length != 0) {
        this._stopEvent(event);
        this.keyEventEsc();
      }
    } else {
      this.keyEventOther(event);
    }
  },

  keyEventDispAll: function() {

    // init
    this.clearSuggestArea();

    this.oldText = this.getInputText();

    this.suggestIndexList = [];
    for (var i = 0, length = this.candidateList.length; i < length; i++) {
      this.suggestIndexList.push(i);
    }

    this.createSuggestArea(this.candidateList);
  },

  keyEventMove: function(keyCode) {

    this.changeUnactive();

    if (keyCode == Suggest.Key.UP) {
      // up
      if (this.activePosition == null) {
        this.activePosition = this.suggestList.length -1;
      }else{
        this.activePosition--;
        if (this.activePosition < 0) {
          this.activePosition = null;
          this.input.value = this.inputValueBackup;
          this.suggestArea.scrollTop = 0;
          return;
        }
      }
    }else{
      // down
      if (this.activePosition == null) {
        this.activePosition = 0;
      }else{
        this.activePosition++;
      }

      if (this.activePosition >= this.suggestList.length) {
        this.activePosition = null;
        this.input.value = this.inputValueBackup;
        this.suggestArea.scrollTop = 0;
        return;
      }
    }

    this.changeActive(this.activePosition);
  },

  keyEventReturn: function() {

    this.clearSuggestArea();
    this.moveEnd();
  },

  keyEventEsc: function() {

    this.clearSuggestArea();
    this.input.value = this.inputValueBackup;
    this.oldText = this.getInputText();

    if (window.opera) setTimeout(this._bind(this.moveEnd), 5);
  },

  keyEventOther: function(event) {},

  changeActive: function(index) {

    this.setStyleActive(this.suggestList[index]);

    this.setInputText(this.candidateList[this.suggestIndexList[index]]);

    this.oldText = this.getInputText();
    this.input.focus();
  },

  changeUnactive: function() {

    if (this.suggestList != null 
        && this.suggestList.length > 0
        && this.activePosition != null) {
      this.setStyleUnactive(this.suggestList[this.activePosition]);
    }
  },

  listClick: function(event, index) {

    this.changeUnactive();
    this.activePosition = index;
    this.changeActive(index);

    this.clearSuggestArea();
    this.moveEnd();
  },

  listMouseOver: function(event, index) {
    this.setStyleMouseOver(this._getEventElement(event));
  },

  listMouseOut: function(event, index) {

    if (!this.suggestList) return;

    var element = this._getEventElement(event);

    if (index == this.activePosition) {
      this.setStyleActive(element);
    }else{
      this.setStyleUnactive(element);
    }
  },

  setStyleActive: function(element) {
    element.className = this.classSelect;

    // auto scroll
    var offset = element.offsetTop;
    var offsetWithHeight = offset + element.clientHeight;

    if (this.suggestArea.scrollTop > offset) {
      this.suggestArea.scrollTop = offset
    } else if (this.suggestArea.scrollTop + this.suggestArea.clientHeight < offsetWithHeight) {
      this.suggestArea.scrollTop = offsetWithHeight - this.suggestArea.clientHeight;
    }
  },

  setStyleUnactive: function(element) {
    element.className = '';
  },

  setStyleMouseOver: function(element) {
    element.className = this.classMouseOver;
  },

  moveEnd: function() {

    if (this.input.createTextRange) {
      this.input.focus(); // Opera
      var range = this.input.createTextRange();
      range.move('character', this.input.value.length);
      range.select();
    } else if (this.input.setSelectionRange) {
      this.input.setSelectionRange(this.input.value.length, this.input.value.length);
    }
  },

  // Utils
  _getElement: function(element) {
    return (typeof element == 'string') ? document.getElementById(element) : element;
  },
  _addEvent: (window.addEventListener ?
    function(element, type, func) {
      element.addEventListener(type, func, false);
    } :
    function(element, type, func) {
      element.attachEvent('on' + type, func);
    }),
  _stopEvent: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  },
  _getEventElement: function(event) {
    return event.target || event.srcElement;
  },
  _bind: function(func) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){ func.apply(self, args); };
  },
  _bindEvent: function(func) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function(event){ event = event || window.event; func.apply(self, [event].concat(args)); };
  },
  _escapeHTML: function(value) {
    return value.replace(/\&/g, '&amp;').replace( /</g, '&lt;').replace(/>/g, '&gt;')
             .replace(/\"/g, '&quot;').replace(/\'/g, '&#39;');
  }
};

