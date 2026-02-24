import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BackButton from "../../components/BackButton";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id, status) {
    setLoading(true);

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) console.error("Status update failed:", error);

    await fetchOrders();
  }

  // Pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative min-h-screen">
      {loading && <Loader />}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton to="/admin" label="Back" />
          <h1 className="text-xl font-bold text-gray-800 my-7">
            Order Management
          </h1>
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
          <div className="space-y-3">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border rounded-2xl p-4 shadow-sm"
              >
                {/* TOP ROW */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg">{order.name}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ₦{order.amount?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "canceled"
                          ? "bg-red-100 text-red-600"
                          : order.status === "paid"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                {order.status === "paid" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() =>
                        updateStatus(order.id, "delivered")
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold"
                    >
                      Mark Delivered
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(order.id, "canceled")
                      }
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* EXPAND BUTTON */}
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === order.id ? null : order.id
                    )
                  }
                  className="text-sm text-mauve mt-4 underline"
                >
                  {expandedId === order.id
                    ? "Hide Details"
                    : "View Details"}
                </button>

                {/* EXPANDED SECTION */}
                {expandedId === order.id && (
                  <div className="mt-4 border-t pt-4 text-sm space-y-2 bg-gray-50 p-4 rounded-xl">
                    <p>
                      <strong>Phone:</strong> {order.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.address}
                    </p>
                    <p>
                      <strong>Reference:</strong> {order.reference}
                    </p>

                    <div className="border-t pt-2 mt-2">
                      <p>
                        <strong>Subtotal:</strong> ₦
                        {order.subtotal?.toLocaleString()}
                      </p>
                      <p>
                        <strong>Delivery Fee:</strong> ₦
                        {order.delivery_fee?.toLocaleString()}
                      </p>
                      <p className="font-semibold">
                        <strong>Total:</strong> ₦
                        {order.amount?.toLocaleString()}
                      </p>
                    </div>

                    {/* ITEMS */}
                    <div className="border-t pt-2 mt-2">
                      <p className="font-semibold mb-2">
                        Ordered Items:
                      </p>

                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs bg-white p-2 rounded mb-1"
                        >
                          <span>
                            {item.name} × {item.qty}
                          </span>
                          <span>
                            ₦
                            {(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}