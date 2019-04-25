---
title: UNM Campus Histories
layout: single-col
date: 2019-03-25
subtitle: Pick a place...any place.
---

<script src="https://code.jquery.com/jquery-3.2.1.min.js"
  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
  crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>

<script src="{{site.baseurl}}/js/sheetrock.min.js"></script>
<script src="{{site.baseurl}}/js/directory.js"></script>

<!--Sheetrock expects to be outputting HTML for each row, so here's a place to put it.-->
<div id="sheetrock">page loading...</div>

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-12">
      <div class="cards"></div>
    </div>
  </div>
</div>


<script>
  $( function() {
    console.log($('#sheetrock').html());
    getPages(function(pages) {
        console.log("running callback from getPages.");
        $.each(pages, createCard);
        console.log("done looping through pages.");
      }
    );
  });
</script>
