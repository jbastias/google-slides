# google-slides


- [google slides](https://developers.google.com/slides/)
- [batchUpdates requests](https://developers.google.com/slides/reference/rest/v1/presentations/request)
- [updatepageElementTransformRequest - move an object](https://developers.google.com/slides/reference/rest/v1/presentations/request#updatepageelementtransformrequest)

## Slidebean Elements

- bar-chart
- code
- cover
- footer
- heading
- image
- line-chart
- number
- pie-chart
- quote
- table
- text
- video

## Google Slide Elements
- shape
- image
- video
- line
- table
- wordArt
- sheetsChart

## Google Slide / Slidebean map

```
shape: shape && shapeType === 'TEXT_BOX'
               => text (Text)
       or
     : shape && shapeType !== 'TEXT_BOX'
               => image (Media)
- image:       => image (Media)
- video:       => image (Media)
- line:        => image (Media)
- table:       => table (Data)
- wordArt:     => image (Media)
- sheetsChart: => bar-chart (Media)
```