window.onload = getQuote();

function getQuote() {
  url = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?"
  $.getJSON(url, function(data){
    $('#author').html("-" + data.quoteAuthor);
    $('#quote').html('"' + data.quoteText + '"');
    $('#tweet').attr('href', 'https://twitter.com/intent/tweet?text="' + data.quoteText + '" -' + data.quoteAuthor);

    if(data.quoteAuthor == ""){
      $('#author').html("-Anonymous");
    }

});
}
