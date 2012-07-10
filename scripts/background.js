// -*- coding: utf-8 ; mode: js2 -*-
// Copyright (C) 2011 Yasuhiro ABE, yasu@yasundial.org.
// Licensed under the Apache License, Version 2.0.
//

var debug = false;

var opts_enabled_default;
var opts_external_link_only_default;
var opts_contextmenu_enabled_default;
var opts_1 = localStorage.getItem("opts_enabled_default");
if(opts_1 == undefined || opts_1 == "undefined") {
  opts_enabled_default = true;
} else {
  opts_enabled_default = JSON.parse(opts_1);
}
var opts_2 = localStorage.getItem("opts_external_link_only_default");
if(opts_2 == undefined || opts_2 == "undefined") {
  opts_external_link_only_default = false;
} else {
  opts_external_link_only_default = JSON.parse(opts_2);
}
var opts_3 = localStorage.getItem("opts_contextmenu_enabled_default");
if(opts_3 == undefined || opts_3 == "undefined") {
  opts_contextmenu_enabled_default = true;
} else {
  opts_contextmenu_enabled_default = JSON.parse(opts_3);
}
if(debug) {
  console.log("typeof(opts_enabled_default) = " + typeof(opts_enabled_default));
  console.log("typeof(opts_external_link_only_default) = " + typeof(opts_external_link_only_default));
  console.log("typeof(opts_contextmenu_enabled) = " + typeof(opts_contextmenu_enabled_default));
}
localStorage["opts_enabled_default"] = JSON.stringify(opts_enabled_default);
localStorage["opts_external_link_only_default"] = JSON.stringify(opts_external_link_only_default);
localStorage["opts_contextmenu_enabled_default"] = JSON.stringify(opts_contextmenu_enabled_default);

function updateOptions() {
  opts_enabled_default = JSON.parse(localStorage["opts_enabled_default"]);
  opts_external_link_only_default = JSON.parse(localStorage["opts_external_link_only_default"]);
  opts_contextmenu_enabled_default = JSON.parse(localStorage["opts_contextmenu_enabled_default"]);
}

function execInjection(tabid, host, params) {
  if(debug) {
    console.log("execInjection(tabid=" + tabid + ", host=" + host +",params)");
    console.log("params.enabled: " + params.enabled);
    console.log("params.external_link_only: " + params.external_link_only);
    console.log("params.contextmenu_enabled: " + params.contextmenu_enabled);
  }
  var s = {code:""};
  if(host == undefined || params == undefined) {
    s.code = 'var al = document.getElementsByTagName("a");for(var i=0; i < al.length; i++){ al[i].setAttribute("target","_blank");}';
  } else {
    s.code += 'var al = document.getElementsByTagName("a");'
    s.code += 'for(var i=0; i < al.length; i++){';
    // 2012/02/27 - It is possible that a href_str might be the ssh: protocl by Jack.
    //              So that, checking the protocol pattern.
    //              If necessary, allow/deny protocol pattern list will be created.
    //              But currently, it will be decided by the static text, "http."
    s.code += '  var proto = al[i].protocol;';
    s.code += '  if(proto.search("^http") == -1) {';
    s.code += '    continue;';
    s.code += '  }';
    s.code += '';
    s.code += '  var a = document.createElement("a");';
    s.code += '  a.href = "' + host + '";';
    s.code += '  if(' + params.external_link_only + ') {';
    s.code += '    if(a.hostname != al[i].hostname) {';
    s.code += '      al[i].setAttribute("target","_blank");';
    s.code += '    } else {';
    s.code += '      al[i].setAttribute("target","");';
    s.code += '    }';
    s.code += '  } else {';
    s.code += '    al[i].setAttribute("target","_blank");';
    s.code += '  }';
    s.code += '}';
    if(debug) { console.log("execInjection: s.code = " + s.code); }
  }
  chrome.tabs.executeScript(tabid, s);
}
function execRemoveTarget(tabid) {
  chrome.tabs.executeScript(tabid, {file: "scripts/remove_targets.js"});
}

// note: Until loading the page, the menu1 has been always marked checked.
function enable_contextmenu() {

  if (opts_contextmenu_enabled_default) {
    if (menu1 == undefined) {
      menu1 = chrome.contextMenus.create({"title": chrome.i18n.getMessage("menu_enabled"), "type": "checkbox", "onclick":menu1OnClick, "checked": opts_enabled_default});
    }
    if (menu2 == undefined) {
      menu2 = chrome.contextMenus.create({"title": chrome.i18n.getMessage("menu_exclude"), "type": "checkbox", "onclick":menu2OnClick, "checked": opts_external_link_only_default});
    }
  } else {
    chrome.contextMenus.removeAll();
    menu1 = undefined;
    menu2 = undefined;
  }
}
var menu1 = undefined;
var menu2 = undefined;

function menu1OnClick(info,tab) {
    if(tab != undefined && tab.pinned == true) {
	var params = JSON.parse(localStorage.getItem(tab.id));
	if(params != undefined) {
	    params.enabled = ! params.enabled;
	    if(menu1 != undefined) {
		chrome.contextMenus.update(menu1,{"checked": params.enabled});
	    }

	    if(params.enabled == true) {
		execInjection(tab.id, tab.url, params);
	    } else {
		execRemoveTarget(tab.id);
	    }
	    localStorage[tab.id] = JSON.stringify(params);
	}
    }
}
function menu2OnClick(info,tab) {
    if(tab != undefined && tab.pinned == true) {
	var params = JSON.parse(localStorage.getItem(tab.id));
	if(params != undefined) {
	    params.external_link_only = ! params.external_link_only;
	    if(menu2 != undefined) {
		chrome.contextMenus.update(menu1,{"checked": params.external_link_only});
	    }
            execInjection(tab.id, tab.url, params);
	    localStorage[tab.id] = JSON.stringify(params);
	}
    }
}

function initParams(tabid) {
  params = {
    enabled: opts_enabled_default,
    external_link_only: opts_external_link_only_default,
    contextmenu_enabled: opts_contextmenu_enabled_default
  };
  localStorage[tabid] = JSON.stringify(params);
}
function updateMenu1(tabid, params) {
  if(debug) { console.log("updateMenu1(tabid=" + tabid + ",params)"); }
  if(menu1 != undefined) {
    if(params != undefined) {
      if(debug) { console.log("updateMenu1: params != undefined"); }
      chrome.contextMenus.update(menu1,{"checked": params.enabled});
    } else {
      if(debug) { console.log("updateMenu1: params == undefined"); }
      chrome.contextMenus.update(menu1,{"checked": ! opts_enabled_default});
    }
  }
}
function updateMenu2(tabid, params) {
  if(debug) { console.log("updateMenu2(tabid=" + tabid + ",params)"); }
  if(menu2 != undefined) {
    if(params != undefined) {
      if(debug) { console.log("updateMenu2: params != undefined"); }
      chrome.contextMenus.update(menu2,{"checked": params.external_link_only});
    } else {
      if(debug) { console.log("updateMenu2: params == undefined"); }
      chrome.contextMenus.update(menu2,{"checked": opts_external_link_only_default});
    }
  }
}

chrome.tabs.onUpdated.addListener(function(id,info,tab) {
  if(debug) { console.log("onUpdated(id=" + id + ",info,tab.id=" + tab.id + ")"); }
  var params = JSON.parse(localStorage.getItem(tab.id));
  if(tab.pinned) {
    if (params == undefined) {
      initParams(tab.id);
      params = JSON.parse(localStorage.getItem(tab.id));
    }
    if (params.enabled == true) {
      execInjection(tab.id, tab.url, params);
    }
  } else {
    if(params != undefined) {
      localStorage.removeItem(tab.id);
      execRemoveTarget(tab.id);
    }
  }
  enable_contextmenu();
  updateMenu1(tab.id, params);
  updateMenu2(tab.id, params);
});

// when started the main window, the onSelectionChanged is never called.
// so, for the first time invocation, you need to define this method as well as onSelectionChanged().
// it might be a bug of chrome or my misunderstand about the usage of APIs.
chrome.tabs.onCreated.addListener(function(tab) {
  if(debug) { console.log("onCreated(" + tab.id + ")"); }
  var params = JSON.parse(localStorage.getItem(tab.id));
  if(tab.pinned) {
    if(params == undefined) {
      initParams(tab.id);
      params = JSON.parse(localStorage.getItem(tab.id));
    }
    if(params.enabled == true) {
      execInjection(tab.id, tab.url, params);
    }
  }
  updateMenu1(tab.id, params);
  updateMenu2(tab.id, params);
});

// never create the new item when the params == null
// but, it is possible that it will be called at first without calling the onCreated or onUpdated method.
chrome.tabs.onSelectionChanged.addListener(function(id,info) {
  if(debug) { console.log("onSelectionChanged(id=" + id + ",info)"); }
  var params = JSON.parse(localStorage.getItem(id));

  updateMenu1(id, params);
  updateMenu2(id, params);
  updateOptions();
});

chrome.tabs.onRemoved.addListener(function(id,info) {
  if(debug) { console.log("onRemoved(id=" + id + ",info)"); }
  var params = JSON.parse(localStorage.getItem(id));
  if(params != undefined) {
    localStorage.removeItem(id);
  }
});

chrome.tabs.onAttached.addListener(function(id,info) {
  if(debug) { console.log("onAttached(id=" + id + ",info)"); }
});
chrome.tabs.onDetached.addListener(function(id,info) {
  if(debug) { console.log("onDetached(id=" + id + ",info)"); }
});

chrome.windows.onFocusChanged.addListener(function(windid) {
  if(debug) { console.log("windows.onFocusChanged(windowId=" + windid + ")"); }
});

chrome.windows.onRemoved.addListener(function(windid) {
  if(debug) { console.log("windows.onRemoved(windowId=" + windid + ")");   }

  localStorage["opts_enabled_default"] = JSON.stringify(opts_enabled_default);
  localStorage["opts_external_link_only_default"] = JSON.stringify(opts_external_link_only_default);
  localStorage["opts_contextmenu_enabled_default"] = JSON.stringify(opts_contextmenu_enabled_default);
});
