"use client";

import PrivateRoute from "../components/PrivateRoute";

export default function StockPage() {
  const stockData = [
    { Nom: "Clavier", Stock: 25 },
    { Nom: "Souris", Stock: 40 },
    { Nom: "Écran", Stock: 12 },
    { Nom: "Casque", Stock: 3 },
    { Nom: "Laptop", Stock: 5 },
  ];

  return (
    <PrivateRoute>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Stock</h1>

        {/* Résumé rapide */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-5 rounded-xl shadow hover:scale-105 transition transform">
            <h2 className="text-lg font-semibold">Total produits</h2>
            <p className="text-2xl font-bold mt-2">{stockData.length}</p>
          </div>
          <div className="bg-green-500 text-white p-5 rounded-xl shadow hover:scale-105 transition transform">
            <h2 className="text-lg font-semibold">Stock suffisant</h2>
            <p className="text-2xl font-bold mt-2">
              {stockData.filter((p) => p.Stock > 5).length}
            </p>
          </div>
          <div className="bg-red-500 text-white p-5 rounded-xl shadow hover:scale-105 transition transform">
            <h2 className="text-lg font-semibold">Stock faible</h2>
            <p className="text-2xl font-bold mt-2">
              {stockData.filter((p) => p.Stock <= 5).length}
            </p>
          </div>
        </div>

        {/* Tableau moderne */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="p-4">Produit</th>
                <th className="p-4">Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-4">{item.Nom}</td>
                  <td className="p-4">
                    {item.Stock <= 5 ? (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                        {item.Stock} (Faible)
                      </span>
                    ) : (
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                        {item.Stock}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PrivateRoute>
  );
}