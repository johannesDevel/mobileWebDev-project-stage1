class ImageHelper {

  static getAltText(image) {
    let altText = '';
    if (image.startsWith('1')) {
      altText = 'People sit on a round table in an restaurant with a blue ceilling';
    } else if (image.startsWith('2')) {
      altText = 'Pizza Magherita on a wooden table';
    } else if (image.startsWith('3')) {
      altText = 'Asian Restaurant dining room with a wok in the middle of every table';
    } else if (image.startsWith('4')) {
      altText = 'Small delicatessen store at night';
    } else if (image.startsWith('5')) {
      altText = 'a kitchen behind a counter and people eating';
    } else if (image.startsWith('6')) {
      altText = 'dining room decorated with old wood and painted american flag in the back';
    } else if (image.startsWith('7')) {
      altText = 'black and white picture from a small burger restaurant';
    } else if (image.startsWith('8')) {
      altText = 'shows sign of the restaurant the Dutch';
    } else if (image.startsWith('9')) {
      altText = 'black and white picture, peple eating on a wooden table';
    } else if (image.startsWith('10')) {
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
