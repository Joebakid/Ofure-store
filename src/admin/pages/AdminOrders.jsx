import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BackButton from "../../components/BackButton";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔢 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8; // Increased slightly as rows are now smaller

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("shop_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    setLoading(true);
    await supabase
      .from("shop_orders")
      .update({ status })
      .eq("id", id);

    await fetchOrders();
  }

  // 🔢 Pagination logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative min-h-screen">
      {/* 🔄 LOADER */}
      {loading && <Loader />}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton to="/admin" label="Back" /> 
          <h1 className="text-xl font-bold text-gray-800 my-7">Order Management</h1>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Total: {orders.length} orders
        </div>
      </div>

      {!loading && orders.length === 0 ? (
        <div className="text-center py-20 bg-milk rounded-3xl">
          <p className="opacity-60">No orders found.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-2">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all gap-4"
              >
                {/* User Info */}
                <div className="flex-1 min-w-[180px]">
                  <p className="font-bold text-gray-900 leading-tight truncate">
                    {order.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{order.email}</p>
                </div>

                {/* Order Details Group */}
                <div className="flex items-center gap-6">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total</p>
                    <p className="font-semibold text-sm">
                      ₦{order.total?.toLocaleString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="w-24 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "canceled"
                          ? "bg-red-100 text-red-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                  {order.status !== "delivered" && (
                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Deliver
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "canceled")}
                      className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 🔢 PAGINATION */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
}