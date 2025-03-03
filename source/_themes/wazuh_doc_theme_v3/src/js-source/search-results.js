/* -----------------------------------------------------------------------------
  Search results page
----------------------------------------------------------------------------- */

const excludedSearchFolders = ['release-notes'];
const pagefindUrl = location.protocol === "file:" ? "" : location.href.split("search.html")[0] + "_pagefind/pagefind.js";

if ( $('.search') ) {
  /* List of folders that will be excluded from search */

  const urlParams = new URLSearchParams(window.location.search);
  const resultsContainer = "#search-results";

  if ( pagefindUrl.length ) {    
    fetch(pagefindUrl, {
      method: 'HEAD'
    })
    .then((response) => {
      if ( response.status !== 200 || response.redirected === true ) {
        /* Fallback to Sphinx search */
        loadSphinxSearch();
      } else {      
        window.pagefind = import(pagefindUrl);
        let resultsFound = 0;
        let excludedResultsCount = 0;
        
        pagefind.then(
          function(data) {
            const search = data.search;
            const queryTerm = urlParams.get('q');
            if ( typeof(queryTerm) !== 'string' ) {
              return;
            } 
            let highlightstring = '?highlight=' + queryTerm;
            pagefindSearch(queryTerm);
            
            function pagefindSearch(query) {
              if ( query.length === 0 ) {
                updateUI([], resultsContainer, query);
                return;
              }
              search(query)
              .then((res) => res.results)
              .then((allresults) => updateUI(allresults, resultsContainer, query));
            }
            
            function updateUI(results, element, query) {
              resultsFound = results.length;
              
              const elementObj = $(resultsContainer);
              const pageTitle = document.createElement('h1');
              $(pageTitle).text('Search results for: ');
              $('<span class="query-term">' + queryTerm  + '</span>').appendTo(pageTitle);
              elementObj.append(pageTitle);
              const status = $('<p class="search-summary" style="display: none;">&nbsp;</p>').appendTo(elementObj);
              const resultList = $('<ul class="search"/>').appendTo(elementObj);
              
              status.fadeIn(500);
              let dataPromises = [];
              const origin = location.href.split("search.html")[0];
              const folder = origin.split(location.host)[1];
              
              for ( let i = 0; i < resultsFound; i++ ) {
                dataPromises.push(results[i].data()
                .then((singleResult) => {
                  
                  let listItem = $('<li style="display:none"></li>');
                  let requestUrl = "";
                  let linkUrl = "";
                  let titleLink, breadcrumb, context;
                  
                  /* Display result [i] */
                  path = (folder == "" || folder == "/") ? singleResult.url.substring(1) : singleResult.url.split(folder)[1];
                  linkUrl = path;
                  if ( DOCUMENTATION_OPTIONS.URL_ROOT !== "./" ) {
                    linkUrl = DOCUMENTATION_OPTIONS.URL_ROOT + path;
                  }
                  
                  // Title
                  titleLink = $('<a/>').attr('href', linkUrl + highlightstring)
                  .text(singleResult.meta.title).addClass('result-link');
                  
                  // Breadcrumb
                  breadcrumb = createResultBreadcrumb(titleLink);
                  
                  // Context
                  let excerptRange = results[i].excerpt_range;
                  let higlightedWords = results[i].words;
                  let escapedContent = _.escape(singleResult.content).split(" ");

                  for (var wordIndex = 0; wordIndex < higlightedWords.length; wordIndex++) {
                    escapedContent[higlightedWords[wordIndex]] = "<mark>" + escapedContent[higlightedWords[wordIndex]] + "</mark>";
                  }

                  let excerpt = (excerptRange[0] > 0) ? "..." : "";
                  excerpt = excerpt + escapedContent.slice(results[i].excerpt_range[0], results[i].excerpt_range[0]+results[i].excerpt_range[1]).join(" ");
                  excerpt = excerpt + ((excerptRange[0]+excerptRange[1]-1 < escapedContent.length) ? "..." : "");
                  
                  context = $('<div/>').addClass('context').html(excerpt);
                  
                  listItem.append(titleLink);
                  listItem.append(breadcrumb);
                  listItem.append(context);
                  
                  
                  $.each(excludedSearchFolders, function(index, value) {
                    if ( path.includes(value+"/") ) {
                      excludedResultsCount++;
                      listItem.addClass('excluded-search-result'); /* Marks initially excluded result */
                      listItem.addClass('hidden-result'); /* Hides the excluded result */
                      return false; /* breaks the $.each loop */
                    }
                  });
                  
                  resultList.append(listItem);
                  if ( !listItem.hasClass('hidden-result') ) {
                    listItem.fadeIn(100);
                  }
                  
                }));
              }
              
              Promise.allSettled(dataPromises).then(([result]) => {
                updateSearchStatus(status, resultsFound, excludedResultsCount)
              });
            }
          }
        );
        
      }
    });
  } else {
    loadSphinxSearch();
  }

  function loadSphinxSearch() {
    getScript(DOCUMENTATION_OPTIONS.URL_ROOT + "_static/js/min/sphinx-search-ui.min.js");
    getScript(DOCUMENTATION_OPTIONS.URL_ROOT + "searchindex.js");
  }

  function getScript(scriptFile) {
    loadScript = document.createElement('SCRIPT');
    
    loadScript.setAttribute("charset", "utf-8");
    loadScript.setAttribute("type", "text/javascript");
    
    loadScript.setAttribute("src", scriptFile);
    document.getElementsByTagName("head")[0].appendChild(loadScript);
  }
}

/* Shows excluded results */
$(document).delegate('#search-results #toggle-results.include', 'click', function() {
  const toggleButton = $(this);
  const excludedResults = $('ul.search li.excluded-search-result');
  
  toggleButton.text(toggleButton.text().replace('Include', 'Exclude'));
  toggleButton.removeClass('include').addClass('exclude');
  $('#search-results #n-results').text($('ul.search li').length);
  
  excludedResults.each(function(e) {
    currentResult = $(this);
    currentResult.hide(0, function() {
      $(this).removeClass('hidden-result');
    });
    currentResult.show('fast');
  });
});

/* Hides excluded results */
$(document).delegate('#search-results #toggle-results.exclude', 'click', function() {
  const toggleButton = $(this);
  const excludedResults = $('ul.search li.excluded-search-result');
  
  toggleButton.text(toggleButton.text().replace('Exclude', 'Include'));
  toggleButton.removeClass('exclude').addClass('include');
  $('#search-results #n-results').text($('ul.search li').length - excludedResults.length);
  
  excludedResults.each(function(e) {
    currentResult = $(this);
    currentResult.hide('normal', function() {
      $(this).addClass('hidden-result');
    });
  });
});

/**
* Generate the breadcrumbs for a particular search result based in the globa
* TOC content.
* @param  {Object} resultLinkNode      JQuery object containing the link from a search result.
* @return {Object}                     JQuery object containing the resulting breadcrumbs node.
*/
function createResultBreadcrumb(resultLinkNode) {
  /* Collect the information */
  const breadcrumbList = [];
  
  let resultLinkURL = resultLinkNode.attr('href').split('?')[0];
  
  let currentTocNode = $('#global-toc').find('[href="' + resultLinkURL + '"]');
  if ( currentTocNode.length === 0 && resultLinkURL.substring(resultLinkURL.length-1) === '/' ) {
    resultLinkURL = resultLinkURL + 'index.html';
    currentTocNode = $('#global-toc').find('[href="' + resultLinkURL + '"]');
  }
  currentTocNode.parents('li').each(function() {
    tocNodeLink = $(this).find('>a');
    breadcrumbList.push({
      url: tocNodeLink.attr('href'),
      text: tocNodeLink.contents()[0].nodeValue,
    });
  });
  
  const breadcrumbSeparator = $(document.createElement('span'));
  breadcrumbSeparator.addClass('breadcrumb-separator').attr('aria-hidden', 'true');
  
  /* Generate the breadcrumb nodes */
  const breadcrumb = $(document.createElement('nav'));
  breadcrumb.addClass('breadcrumbs');
  for (let i = 0; i< breadcrumbList.length; i++) {
    const a = $(document.createElement('a'));
    a.attr('href', breadcrumbList[i].url).text(breadcrumbList[i].text).addClass('breadcrumb-link');
    breadcrumb.prepend(a);
    breadcrumb.prepend(breadcrumbSeparator.clone(true));
  }
  
  const a = $(document.createElement('a'));
  const homeIcon = $('#home-icon svg');
  a.attr('href', DOCUMENTATION_OPTIONS.URL_ROOT).append(homeIcon.clone(true)).addClass('breadcrumb-link');
  breadcrumb.prepend(a);
  return breadcrumb;
}

function updateSearchStatus(statusElement, totalResults, excludedResults) {
  if ( totalResults == 0 ){
    statusElement.text('No results.');
    $('<p>Please make sure that all words are spelled correctly.</p>').appendTo(statusElement);
    return;
  }
  let resultText = '';
  if (excludedResults > 0) {
    resultText = 'Found <span id="n-results">' + (totalResults - excludedResults) + '</span> page(s) matching the search query. <a id="toggle-results" class="include" href="#">Include Release Notes results</a>';
  } else {
    resultText = 'Found <span id="n-results">' + totalResults + '</span> page(s) matching the search query.';
  }
  statusElement.html(resultText);
}
