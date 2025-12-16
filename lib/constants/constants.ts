export class Constants {
  // information
  static readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}`;
  static readonly PRODUCTS = "products";
  static readonly ORDERS = "orders";
  static readonly ORDER_ITEMS = "orderitems";
  static readonly IMAGE_DEFAULT_URL = "/image-notfound.png";
  // Use these constants across the app to keep date formats consistent
  static readonly DATE_FORMAT = "dd/MM/yyyy";
  static readonly DATETIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
  static readonly TIME_FORMAT = "HH:mm:ss";
  static readonly ISO_DATE = "yyyy-MM-dd";
  static readonly ISO_DATETIME = "yyyy-MM-dd'T'HH:mm:ss";

  static readonly IMAGE_EXT_STRING =
    ".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.tif,.avif,.heic";

  static readonly VIDEO_EXT_STRING =
    ".mp4,.mov,.avi,.mkv,.wmv,.flv,.webm,.m4v,.mpeg,.mpg,.3gp";
}
