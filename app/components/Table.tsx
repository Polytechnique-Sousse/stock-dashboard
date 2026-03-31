type TableProps = {
  columns: string[];
  data: any[];
};

export default function Table({ columns, data }: TableProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-700 font-semibold">
            {columns.map((col, i) => (
              <th key={i} className="pb-3">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {data.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              {columns.map((col, j) => (
                <td key={j} className="py-3">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}