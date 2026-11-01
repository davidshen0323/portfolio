import { useI18n } from '../../../shared/i18n/I18nProvider';
import DataTable from '../../../shared/components/DataTable';
import { money } from '../../../shared/lib/format';
import Panel from './Panel';
export default function InventoryPanel({ stock, setStock, resetStock }) {
  const { t, locale } = useI18n();
  return (
    <Panel title="商品庫存" eyebrow="INVENTORY">
      <DataTable
        rows={stock}
        columns={[
          {
            key: 'name',
            label: '商品編號 / 名稱',
            render: (p) => (
              <>
                <b>{t(p.name)}</b>
                <small>{p.id}</small>
              </>
            ),
          },
          { key: 'category', label: '分類', render: (p) => t(p.category) },
          { key: 'price', label: '售價', render: (p) => money(p.price, locale) },
          {
            key: 'qty',
            label: '庫存',
            render: (p) => (
              <span className={p.qty <= 5 ? 'stock-low' : ''}>
                {p.qty} {p.qty <= 5 && t('低庫存')}
              </span>
            ),
          },
          {
            key: 'actions',
            label: '調整',
            render: (p) => (
              <div className="stock-controls">
                {[-1, 1].map((step) => (
                  <button
                    key={step}
                    aria-label={t(step === 1 ? '增加' : '減少') + t(p.name)}
                    onClick={() =>
                      setStock((items) =>
                        items.map((item) =>
                          item.id === p.id ? { ...item, qty: Math.max(0, item.qty + step) } : item,
                        ),
                      )
                    }
                  >
                    {step === 1 ? '＋' : '−'}
                  </button>
                ))}
              </div>
            ),
          },
        ]}
      />
      <div className="panel-foot">
        {t('商店下單會更新此裝置上的庫存；重設可還原初始數量。')}
        <button onClick={resetStock}>{t('重設庫存')}</button>
      </div>
    </Panel>
  );
}
