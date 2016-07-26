# pictofy

This plugin enables pictogram support on your page.

## Getting started

Include at least jQuery 2 and the [res Plugin](https://github.com/AlexVonB/res)
before the pictofy library:

```html
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="jquery.res.js"></script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/css/tooltipster.min.css">
<link rel="stylesheet" href="css/pictofy.css">
<script src="jquery.pictofy.js"></script>
```

Additionally upload the two images in the img-folder. You might want to change
the image paths for the rating stars in `pictofy.css`.

To enable pictogram support:

```js
// Default options:
var options = {
  resUrl: 'https://res.openurc.org/',
  getRatingUrl: function(name) {
    return 'https://picsupport.gpii.eu/rating/' + encodeURIComponent(name);
  },
  lang: 'en',
  class: 'picto-tooltip',
  preContent: $('<div style="height:200px;width:200px;">&nbsp;</div>'),
  failContent: ':('
};

$('p, h1, h2, ul').not('[data-picto="ignore"]').pictofy(options);
```

## Licence

Copyright 2016 Hochschule der Medien (HdM) / Stuttgart Media University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

