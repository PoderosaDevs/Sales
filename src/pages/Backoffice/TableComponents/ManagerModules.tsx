import { Link } from "react-router-dom";

export function ManagerModules() {
  const items = [
    { label: "Lojas", color: "bg-indigo-500", path: '/lojas' },
    { label: "Marcas", color: "bg-indigo-600", path: '/marcas' },
    { label: "Metas", color: "bg-indigo-700", path: '/metas' },
    { label: "Produtos", color: "bg-indigo-800", path: '/produtos' },
    { label: "Funcionários", color: "bg-indigo-900", path: '/funcionarios' },

  ];

  return (
    <div className="w-full flex">
      {items.map((item, index) => (
        <Link
        to={item.path}
          key={index}
          className={`relative w-1/2 h-[100px] flex-wrap ${item.color} text-white flex items-center justify-center text-lg font-bold`}
         
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
