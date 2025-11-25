import DateTime from "../../../../utils/UserDashboard/services/DateTime";
import { statusColors } from "../../../../utils/UserDashboard/services/statusColors";

export default function TransactionSection({ transactionData, loading }) {

  if (loading) {
    return <p className="text-gray-600">Loading your Transactions...</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm text-gray-600">
            <th className="text-center">Transaction ID</th>
            <th className="pl-8">Date & Time</th>
            <th className="pl-8">Milestone Title</th>
            <th className="pl-2">Amount</th>
            <th className="pl-2">Payment Method</th> 
            <th className="pl-8">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactionData.length ? (
            transactionData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 text-sm hover:bg-gray-100 transition"
              >
                <td className="text-center font-semibold"># {item.id}</td>
                <td className="py-3 px-4">
                  <DateTime timestamp={item.timestamp} />
                </td>
                <td className="py-3 px-4">{item.milestone_title}</td>
                <td className="py-3 px-4 font-semibold">{item.amount}</td>
                <td className="pl-8">{item.provider_name}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-4 py-1 rounded-xl text-xs font-medium ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
                className="text-center py-6 text-gray-500 text-sm"
              >
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
