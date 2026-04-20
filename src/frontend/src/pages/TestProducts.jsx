import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TestProducts() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(`${API_URL}/products?page=1&limit=20`);

  const fetchDirect = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(url);
      const json = await res.json();
      setData({ status: res.status, ok: res.ok, body: json });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        🔬 TEST PAGE — Raw API Call
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13 }}
        />
        <button
          onClick={fetchDirect}
          disabled={loading}
          style={{ padding: '6px 16px', background: '#6d28d9', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          {loading ? 'Đang tải...' : 'Gọi API'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: 12, marginBottom: 16 }}>
          <strong>❌ Lỗi kết nối:</strong> {error}
          <br />
          <small>→ Backend chưa chạy hoặc sai URL?</small>
        </div>
      )}

      {data && (
        <>
          <div style={{ background: data.ok ? '#d1fae5' : '#fee2e2', border: '1px solid', borderRadius: 6, padding: 12, marginBottom: 16 }}>
            <strong>HTTP Status:</strong> {data.status} {data.ok ? '✅' : '❌'} &nbsp;|&nbsp;
            <strong>success:</strong> {String(data.body?.success)} &nbsp;|&nbsp;
            <strong>Số sản phẩm trả về:</strong> {data.body?.products?.length ?? 'N/A'} &nbsp;|&nbsp;
            <strong>Total:</strong> {data.body?.pagination?.totalItems ?? 'N/A'}
          </div>

          {data.body?.products?.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  {['id', 'name', 'price', 'stock', 'category', 'imageUrl'].map(h => (
                    <th key={h} style={{ border: '1px solid #e5e7eb', padding: '6px 10px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.body.products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ border: '1px solid #e5e7eb', padding: '4px 10px' }}>{p.id}</td>
                    <td style={{ border: '1px solid #e5e7eb', padding: '4px 10px' }}>{p.name}</td>
                    <td style={{ border: '1px solid #e5e7eb', padding: '4px 10px' }}>{p.price?.toLocaleString()}</td>
                    <td style={{ border: '1px solid #e5e7eb', padding: '4px 10px' }}>{p.stock}</td>
                    <td style={{ border: '1px solid #e5e7eb', padding: '4px 10px' }}>{p.category || '-'}</td>
                    <td style={{ border: '1px solid #e5e7eb', padding: '4px 10px' }}>
                      {p.imageUrl ? (
                        <a href={p.imageUrl} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>ảnh</a>
                      ) : 'chưa có'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ background: '#fef9c3', padding: 12, borderRadius: 6 }}>
              ⚠️ API trả về 0 sản phẩm — DB có dữ liệu nhưng API không trả về.
            </div>
          )}

          <details style={{ marginTop: 16 }}>
            <summary style={{ cursor: 'pointer', color: '#6b7280' }}>Raw JSON response</summary>
            <pre style={{ background: '#f9fafb', padding: 12, borderRadius: 4, overflow: 'auto', fontSize: 11, marginTop: 8 }}>
              {JSON.stringify(data.body, null, 2)}
            </pre>
          </details>
        </>
      )}
    </div>
  );
}
