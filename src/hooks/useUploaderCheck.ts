interface CheckCondition {
  format?: string[]; // 格式
  size?: number; // 大小,以M(兆)为单位
}

type ErrorType = 'size' | 'format' | null

/**
 *
 * @description 在上传前,检查文件是否符合规则
 * @param file 文件
 * @param condition 检查的项目:[format]-文件格式,[size]-文件大小
 * @author kevin-wu
 * @date 2020-12-25
 */
function useUploaderCheck (file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

export default useUploaderCheck
