import React from "react";

export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total =
      (payload.find((p: any) => p.dataKey === "coloracao")?.value || 0) +
      (payload.find((p: any) => p.dataKey === "tratamento")?.value || 0);

    return (
      <div className="bg-white p-2 rounded shadow text-sm text-gray-800 border border-gray-300">
        <p>
          <strong>Total:</strong> {total}
        </p>
      </div>
    );
  }

  return null;
};
