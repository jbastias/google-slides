# google-slides


## setup 

Read this page: [create credentials](https://developers.google.com/slides/quickstart/javascript)

./src/index.html

```
var CLIENT_ID = '<CLIENT_ID>';
var API_KEY = '<API_KEY>';
``` 

and if necessary, get presentation id: 

https://docs.google.com/presentation/d/**1wtG0Wvt_p7Qrziu-D1LODmB1irORHiHo4UxGR3q2Dfg**/edit#slide=id.g4ba7108cb8_0_65

id = `1wtG0Wvt_p7Qrziu-D1LODmB1irORHiHo4UxGR3q2Dfg`

in ./src/components/container/main.js change the `presId` in the state object.

```
...
class Main extends Component {
  constructor() {
    super();

    this.state = {
      presId: '<presId>',
      authorized: false,
      modal: false,
      presentation: {},
      slideId: null,
 ...

```

 
### docs

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