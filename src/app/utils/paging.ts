export const getPaging = ({
  itemsCountOnPage,
  pagination,
}: {
  itemsCountOnPage: number
  pagination: {
    page: number
    pageCount: number
    pageSize: number
    total: number
  }
}) => {
  const { page, pageCount, pageSize, total } = pagination
  const start = (page - 1) * pageSize
  const partString =
    (itemsCountOnPage > 0 ? start + 1 : 0) +
    '-' +
    (itemsCountOnPage > 0 ? start + itemsCountOnPage : 0) +
    ' / ' +
    total

  return {
    isNextAllowed: page < pageCount,
    isPreviousAllowed: page > 1,
    page,
    partString,
  } as Paging
}
