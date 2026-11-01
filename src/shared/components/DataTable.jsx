import { useI18n } from '../i18n/I18nProvider';
export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  empty = '找不到符合條件的訂單。',
}) {
  const { t } = useI18n();
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {t(column.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <div className="empty">{t(empty)}</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
