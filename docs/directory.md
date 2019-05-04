---
title: UNM Campus Histories
layout: single-col
date: 2019-03-25
subtitle: Pick a place...any place.
---

<script src="{{site.baseurl}}/js/sheetrock.min.js"></script>
<script src="{{site.baseurl}}/js/directory.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js" integrity="sha256-7/yoZS3548fXSRXqc/xYzjsmuW3sFKzuvOCHd06Pmps=" crossorigin="anonymous"></script>

<!--Sheetrock expects to be outputting HTML for each row, so here's a place to put it.-->
<div id="sheetrock">page loading...</div>

<div class="container-fluid">
  <div id="cards" class="row"></div>
</div>


<script>
  $( function() {
    getPages(function(pages) {
        console.log("running callback from getPages.");
        $.each(pages, createCard);
      }
    );
  });
</script>
