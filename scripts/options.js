/** -*- coding: utf-8; mode: css -*-
   *
   * Copyright (C) 2011-2012 Yasuhiro ABE <yasu@yasundial.org>
   *
   */

function localdata_removeall() {
  localStorage.clear();
  location.reload(true);
}

function localdata_showtable() {
  var e = document.getElementById("localdata_table");
  for(var i=0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    var v = localStorage.getItem(k);

    var tr = document.createElement("tr");
    // add background attribute each even line
    if(i % 2 == 0) {
      tr.setAttribute("style", "background:#e5ecf9");
    }
    var td1 = document.createElement("td");
    var text1 = document.createTextNode(k);
    td1.appendChild(text1);

    var td2 = document.createElement("td");
    var text2 = document.createTextNode(v);
    td2.appendChild(text2);

    tr.appendChild(td1);
    tr.appendChild(td2);
    e.appendChild(tr);
  }
}

function restore_options() {
  var opts_1 = localStorage.getItem("opts_enabled_default");
  if(opts_1 == undefined || opts_1 == "undefined") {
    localStorage["opts_enabled_default"] = true;
  }
  var opts_2 = localStorage.getItem("opts_external_link_only_default");
  if(opts_2 == undefined || opts_2 == "undefined") {
    localStorage["opts_external_link_only_default"] = false;
  }
  var opts_3 = localStorage.getItem("opts_contextmenu_enabled_default");
  if(opts_3 == undefined || opts_3 == "undefined") {
    localStorage["opts_contextmenu_enabled_default"] = true;
  }

  var input_enabled = document.getElementsByName("enabled");
  for(var i in input_enabled) {
    var c = input_enabled[i];
    if(c.value == (""+localStorage["opts_enabled_default"])) {
      c.checked = true;
    }
  }

  var input_exclude_same_hostname = document.getElementsByName("exclude_same_hostname");
  for(var i in input_exclude_same_hostname) {
    var c = input_exclude_same_hostname[i];
    if(c.value == (""+localStorage["opts_external_link_only_default"])) {
      c.checked = true;
    }
  }

  var input_contextmenu_enabled = document.getElementsByName("contextmenu_enabled");
  for(var i in input_contextmenu_enabled) {
    var c = input_contextmenu_enabled[i];
    if(c.value == (""+localStorage["opts_contextmenu_enabled_default"])) {
      c.checked = true;
    }
  }
}

function save_options() {

  var input_enabled = document.getElementsByName("enabled");
  for(var i in input_enabled) {
    var c = input_enabled[i];
    if(c.checked == true) {
      localStorage["opts_enabled_default"] = JSON.parse(c.value);
    }
  }

  var input_exclude_same_hostname = document.getElementsByName("exclude_same_hostname");
  for(var i in input_exclude_same_hostname) {
    var c = input_exclude_same_hostname[i];
    if(c.checked == true) {
      localStorage["opts_external_link_only_default"] = JSON.parse(c.value);
    }
  }

  var input_contextmenu_enabled = document.getElementsByName("contextmenu_enabled");
  for(var i in input_contextmenu_enabled) {
    var c = input_contextmenu_enabled[i];
    if(c.checked == true) {
      localStorage["opts_contextmenu_enabled_default"] = JSON.parse(c.value);
    }
  }
}

function set_text() {
  var list = new Array("top_title", "opts_title","opts_title_enabled","opts_title_exclude","opts_button_reset","opts_button_save","localdata_table_title", "localdata_button_removeall", "localdata_table_label_keys", "localdata_table_label_values", "opts_header_title", "opts_header_true", "opts_header_false", "opts_note","localdata_note","opts_contextmenu_enabled", "opts_header_title2", "opts_header_true2", "opts_header_false2");
  for(var i=0; i < list.length; i++) {
    var e = document.getElementById(list[i]);
    var t = document.createTextNode(chrome.i18n.getMessage(list[i]));
    e.appendChild(t);
  }
}

