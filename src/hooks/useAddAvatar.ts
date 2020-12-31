import { ColumnProps, ImageProps, UserProps } from '@/store'

/**
 *
 * @description 图像URL拼接.https://docs.cloudbase.net/storage/extension.html#tu-xiang-url-pin-jie-can-shu
 *              //取半径为100px，进行圆角裁剪:::download_url&imageMogr2/rradius/100
 * @param image 图片
 * @param radius 半径
 * @param format 拼接参数
 */
const generateFitUrl = (image: ImageProps, radius: number, format = 'imageMogr2/rradius') => {
  if (image && image.url) {
    image.fitUrl = image.url + `${format}/{radius}`
  }
}

/**
 *
 * @description 补全头像图像
 * @data 用户
 * @radius 半径
 */
const useAddAvatar = (data: ColumnProps | UserProps, radius: number) => {
  // 云调用扩展https://docs.cloudbase.net/storage/extension.html
  if (data.avatar) {
    generateFitUrl(data.avatar, radius, 'imageMogr2/rradius')
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}

export { useAddAvatar, generateFitUrl }
