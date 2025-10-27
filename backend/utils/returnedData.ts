const returnedData = (success: boolean, message: string, data?: any) => {
  return {
    message,
    data
  }
}

export default returnedData
