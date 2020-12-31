/**
 * @description Array->object
 * @param arr
 * @author kevin-wu[详见P85讲解]
 */
const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((prev, current) => { // reduce:归并(参数1:一个回调函数,参数2:初始值-空对象)
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}
/**
 * @description object->Array
 * @param obj
 */
const objToArr = <T>(obj: {[key: string]: T}) => {
  return Object.keys(obj).map(key => obj[key])
}

// hash-map;  -Redux
// 规范化状态( Normalizing State Shape )
// https://cloud.tencent.com/developer/section/1374250
// interface TestProps {
//   _id: string;
//   name: string;
// }
// const testData: TestProps[] = [
//   { _id: '1', name: 'a' },
//   { _id: '2', name: 'b' }
// ]
// const result = arrToObj(testData)
// console.log(result)
// const testData2: {[key: string]: TestProps} = {
//   1: { _id: '1', name: 'a' },
//   2: { _id: '2', name: 'b' }
// }
// const result2 = objToArr(testData2)
// console.log(result2)

export { arrToObj, objToArr }
