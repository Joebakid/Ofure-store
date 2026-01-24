import ProductRow from "./ProductRow";

export default function ProductTable({
  products,
  onUpdate,
  onDelete,
}) {
  if (!products.length) {
    return (
      <p className="text-center opacity-60 py-10">
        No products yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
