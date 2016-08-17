/*!
 * Copyright 2016 Hochschule der Medien (HdM) / Stuttgart Media University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function($) {

  /* globals AS_picsupport, console, jQuery */
  'use strict';

  /**
   * Desends the DOM tree, finds text nodes and wraps words in spans
   * @param {jQuery-DOM-element} $elem DOM node to descend into
   * @param {Object} opts Plugin options
   */
  function descend($elem, opts) {
    $elem.contents().each(function(idx, el) {
      var $e = $(el);
      // Check, if the element is a TextNode (which has nodeType 3)
      if ($e.context.nodeType === 3) {
        // Get the TextNodes text content
        var text = $e.text();
        // Split the contained text at its non-words
        var words = text.split(/([^a-zA-Z\x7f-\xff])/);

        // Wrap each word in a span tag
        var result = words.map(function(word) {
          if (/[a-zA-Z\x7f-\xff]+/.test(word)) {
            return '<span class="' + opts.class + '">' +
              word + '</span>';
          }
          return word;
        });

        // Join all span tags with space and replace the TextNode's content
        $e.replaceWith(result.join(""));
      } else {
        // If elem is no TextNode, descend further
        descend($e.not('.'+opts.class), opts);
      }
    });
  }

  /**
   * Append rating stars for given picto to a tooltip
   * @param {string} name Name of the picto
   * @param {Tooltip} tooltip Tooltip to append the stars to
   * @param {Object} opts Plugin options
   */
  function appendStars(name, tooltip, opts) {
    getRating(name, opts)
      .done(function(response, status){
        var content = tooltip.tooltipster('content');
        $(content).append(generateStars(name, response.rating, opts));
      })
      .fail(function(xhr, status, error){
        console.log(status);
        console.log(error);
      });
  }

  /**
   * Create container with rating stars
   * @param {string} name Name of the picto
   * @param {double} rating Rating of the picto
   * @param {Object} opts Plugin options
   * @return {jQuery-DOM-element} The container with the stars
   */
  function generateStars(name, rating, opts) {
    var $container = $('<div>')
        .addClass('picto-stars')
        .append();

    var functionGenerator = function(i) {
      return function() {
        $container.text('Thanks.');
        $.ajax({
          url: opts.getRatingUrl(name),
          method: 'POST',
          data: { rating: i },
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        });
      };
    };

    for (var i = 1; i <= 5; i++) {
      var $input = $('<span>')
          .addClass('picto-stars__star')
          .toggleClass('picto-stars__star--empty', i > rating);

      $input.click(functionGenerator(i));

      $container.append($input);
    }

    return $container;
  }

  /**
   * Get a picto's rating from the picsupport server
   * @param {string} name Name of the picto
   * @param {Object} opts Plugin options
   * @returns {Promise} Returns the promise of the rating
   */
  function getRating(name, opts) {
    return $.ajax({
      url: opts.getRatingUrl(name),
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    });
  }

  /**
   * In all selected elements, turn on picsupport
   */
  $.fn.pictofy = function(options) {

    var opts = $.extend({}, $.fn.pictofy.defaults, options);

    descend(this, opts);

    var $res = $.res(opts.resUrl);

    $('.' + opts.class).tooltipster({
      updateAnimation: null,
      trigger: 'click',
      theme: 'tooltipster-picto',
      onlyOne: true,
      interactive: true,
      content: opts.preContent,
      functionReady: function(origin) {

        if (origin.attr('data-picto-cached') == 'cached') {
          return true;
        }

        // Remove and spaces
        var word = origin[0].innerHTML.toLowerCase().trim();
        var lang = (typeof AS_picsupport === undefined) ? opts.lang :
            AS_picsupport.language || opts.lang;

        var $container = $('<div>')
            .addClass('picto-container');

        $res.queries().addQuery().addProp('http://openurc.org/ns/res#type', 
            'http://openurc.org/restypes#pictogram')
          .addPropWithDescs('http://purl.org/dc/elements/1.1/title', word)
            .addDesc('lang', lang)
            .complete()
          .complete()
          .send()
          .done(function(responses){
            if (responses.firstResponse().numberOfResources() > 0) {
              var src = responses.getVeryFirstGlobalAt();
              src = src.replace('http://', '//');
              var name = responses.firstResponse()
                  .firstResource()
                  .props
                  .find(function(prop){
                    return prop.name === 'http://openurc.org/ns/res#name';
                  })
                  .value;
              $container.append($('<img>').attr('src', src));
              origin.tooltipster('content', $container);
              appendStars(name, origin, opts);
            } else {
              origin.tooltipster('content', opts.failContent);
            }
            origin.attr('data-picto-cached', 'cached');
          })
          .fail(function(response){
            origin.tooltipster('content', opts.failContent);
            console.log(response.error);
            console.log(response.status);
          });
        return true;
      }
    });

    return this;

  };

  /**
   * Destroy all picsupport elements and bring page back to normal state
   */
  $.fn.pictofy.destroy = function(options) {
    var opts = $.extend({}, $.fn.pictofy.defaults, options);

    $('.' + opts.class)
      .tooltipster('destroy')
      .each(function(idx, el) {
        $(el).replaceWith($(el).html());
      });
  };

  $.fn.pictofy.defaults = {
    resUrl: 'https://res.openurc.org/',
    getRatingUrl: function(name) {
      return 'https://picsupport.gpii.eu/rating/' + encodeURIComponent(name);
    },
    lang: 'en',
    class: 'picto-tooltip',
    preContent: $('<div style="height:200px;width:200px;">&nbsp;</div>'),
    failContent: ':('
  };

})(jQuery);
