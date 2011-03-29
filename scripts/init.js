// -*- coding: utf-8 -*-
// Copyright (C) 2011 Yasuhiro ABE <yasu@yasundial.org>
// Licensed under the Apache License, Version 2.0 (the "License")

function getHostname(href) {
    var anchor = document.createElement("a");
    anchor.href = href;
    return anchor.hostname;
}

