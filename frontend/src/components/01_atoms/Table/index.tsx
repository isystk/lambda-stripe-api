import React, { FC } from 'react'
import { ContainerProps } from 'types'
import { connect } from '@/components/hoc'
import DataTable, {
  PaginationComponentProps,
  TableColumn,
} from 'react-data-table-component'
import * as styles from './styles'

/** TableProps Props */
export type TableProps = {
  columns: TableColumn<Record<never, never>>[]
  data: Record<never, never>[]
}
/** Presenter Props */
export type PresenterProps = TableProps

/** Presenter Component */
const TablePresenter: FC<PresenterProps> = ({ columns, data }) => (
  <>
    <DataTable
      className={`${styles.table}`}
      columns={columns}
      data={data}
      striped={true}
      pagination={true} // ページングを有効にする
      paginationDefaultPage={1} // 最初に表示するページを設定する
      paginationPerPage={5} // 1ページに表示する行数を設定する
      // paginationRowsPerPageOptions={[5, 10, 15, 20]} // 1ページに表示する行数の選択肢を設定する
      // paginationTotalRows={data.length} // 全行数を設定する
      // PaginationPageRange={5} // ページボタンを中心に5つだけ表示するようにする
      paginationComponent={({
        onChangePage,
        onChangeRowsPerPage,
        currentPage,
        rowsPerPage,
        rowCount,
      }: PaginationComponentProps) => {
        const numberOfPages = Math.ceil(rowCount / rowsPerPage)
        const handleClick = (page) => onChangePage(page, data.length)
        const pageButtons = []
        let startPage = Math.max(currentPage - 2, 1)
        let endPage = Math.min(currentPage + 2, numberOfPages)
        if (currentPage <= 2) {
          endPage = Math.min(5, numberOfPages)
        } else if (currentPage >= numberOfPages - 1) {
          startPage = Math.max(numberOfPages - 4, 1)
        }
        for (let i = startPage; i <= endPage; i++) {
          pageButtons.push(
            <button
              key={i}
              className={`inline-block font-bold px-4 py-2 ${
                currentPage === i
                  ? 'bg-blue-500 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 '
              }`}
              onClick={() => handleClick(i)}
            >
              {i}
            </button>
          )
        }
        return (
          <div className="flex items-center justify-center mt-6">
            <select
              className="mr-2 p-2 border rounded"
              value={rowsPerPage}
              onChange={(e) => {
                onChangeRowsPerPage(parseInt(e.target.value), currentPage)
              }}
            >
              {[5, 10, 15, 20].map((option) => (
                <option key={option} value={option}>
                  {option} 件表示
                </option>
              ))}
            </select>
            <button
              className={`inline-block bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-l ${
                currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-300'
              }`}
              onClick={() => handleClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              前へ
            </button>
            {pageButtons}
            <button
              className={`inline-block bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-r ${
                currentPage === numberOfPages
                  ? 'opacity-50'
                  : 'hover:bg-gray-300'
              }`}
              onClick={() => handleClick(currentPage + 1)}
              disabled={currentPage === numberOfPages}
            >
              次へ
            </button>
          </div>
        )
      }}
    />
  </>
)

/** Container Component */
const TableContainer: React.FC<ContainerProps<TableProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({
    ...props,
  })
}

export default connect<TableProps, PresenterProps>(
  'Table',
  TablePresenter,
  TableContainer
)
