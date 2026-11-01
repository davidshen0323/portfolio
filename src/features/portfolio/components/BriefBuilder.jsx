import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import Feedback from '../../../shared/components/Feedback';

const types = ['品牌形象網站', '購物平台', '後台管理', '汽車買賣網站', '現有網站調整'];
const goals = [
  '讓訪客了解服務並提出詢問',
  '讓訪客找到商品並完成選購',
  '讓團隊更容易管理日常工作',
  '改善手機版與既有操作問題',
];
const assets = ['文字與圖片尚待整理', '已有品牌與主要圖片', '已有網站與程式碼'];

export default function BriefBuilder() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: '',
    type: types[0],
    goal: goals[0],
    assets: assets[0],
    features: '',
  });
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const summary = [
    t('網站需求摘要'),
    t('專案：') + form.name,
    t('類型：') + t(form.type),
    t('目標：') + t(form.goal),
    t('素材：') + t(form.assets),
    t('頁面與功能：') + (form.features || t('待討論')),
    t('待確認：預算、時程、交付範圍、維護方式。'),
  ].join('\n');
  return (
    <>
      <form
        className="brief-form"
        onSubmit={(event) => {
          event.preventDefault();
          setReady(true);
        }}
      >
        <label>
          {t('專案名稱')}
          <input name="name" value={form.name} onChange={update} maxLength={80} required />
        </label>
        {[
          ['type', '網站類型', types],
          ['goal', '最重要的目標', goals],
          ['assets', '目前素材', assets],
        ].map(([key, label, values]) => (
          <label key={key}>
            {t(label)}
            <select name={key} value={form[key]} onChange={update}>
              {values.map((value) => (
                <option key={value} value={value}>
                  {t(value)}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label className="wide">
          {t('需要的頁面或功能')}
          <textarea
            name="features"
            value={form.features}
            onChange={update}
            rows={4}
            maxLength={1200}
          />
        </label>
        <button type="submit">{t('產生需求摘要 ↗')}</button>
      </form>
      {ready && (
        <div>
          <p className="brief-output">{summary}</p>
          <button
            className="copy-brief"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary);
                setMessage('已複製');
              } catch {
                setMessage('請選取上方摘要手動複製');
              }
            }}
          >
            {t('複製摘要')}
          </button>
          <Feedback message={message} />
        </div>
      )}
    </>
  );
}
