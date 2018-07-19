class ImageHelper {

  static getAltText(image) {
    let altText = '';
    if (image === '1.jpg') {
      altText = 'People sit on a round table in an restaurant with a blue ceilling';
    } else if (image === '2.jpg') {
      altText = 'Pizza Magherita on a wooden table';
    } else if (image === '3.jpg') {
      altText = 'Asian Restaurant dining room with a wok in the middle of every table';
    } else if (image === '4.jpg') {
      altText = 'Small delicatessen store at night';
    } else if (image === '5.jpg') {
      altText = 'a kitchen behind a counter and people eating';
    } else if (image === '6.jpg') {
      altText = 'dining room decorated with old wood and painted american flag in the back';
    } else if (image === '7.jpg') {
      altText = 'black and white picture from a small burger restaurant';
    } else if (image === '8.jpg') {
      altText = 'shows sign of the restaurant the Dutch';
    } else if (image === '9.jpg') {
      altText = 'black and white picture, peple eating on a wooden table';
    } else if (image === '10.jpg') {
      altText = 'modern looking restaurant with white furniture and a metal counter';
    }
    return altText;
  }

  static getImageName(image) {
    let name = '';
    if (image.length == 6) {
      name = '/img/' + image.substr(0, 2);
    }
    else if (image.length == 5) {
      name = '/img/' + image.substr(0, 1);
    }
    return name;
  }

}