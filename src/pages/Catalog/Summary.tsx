import React, { useState, useEffect } from "react";
import { useShoppingCart } from "../../context/CartContext";
import { FaMinus, FaPlus, FaTrashAlt, FaTh, FaListUl, FaCalendarAlt, FaStore, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import { CartItem } from "../../context/types/CartContext";
import { useAuth } from "../../context/AuthContext";
import { MutationSetVenda } from "../../graphql/Venda/Mutation";
import { QueryGetLojas } from "../../graphql/Loja/Query";
import { TbShoppingBagExclamation } from "react-icons/tb";

export function Summary() {
  const { cartItems, updateItemQuantity, removeProduct, clearCart } = useShoppingCart();
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLoja, setSelectedLoja] = useState<string>("");
  const { usuarioData } = useAuth();

  const { data: dataLojas } = QueryGetLojas({
    variables: { pagination: { pagina: 0, quantidade: 100 } },
  });

  const calculateTotals = () => {
    const points = cartItems.reduce((acc, item) => acc + item.pontos * item.quantidade, 0);
    const quantity = cartItems.reduce((acc, item) => acc + item.quantidade, 0);
    setTotalPoints(points);
    setTotalItems(quantity);
  };

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) updateItemQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    Swal.fire({
      title: "Remover produto?",
      text: "Este item sairá do resumo da venda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#334155",
      background: "#0d0d10",
      color: "#fff",
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Manter",
    }).then((result) => {
      if (result.isConfirmed) removeProduct(id);
    });
  };

  const { FormSetVenda, loading } = MutationSetVenda();

  const handleFinalize = async () => {
    if (!selectedDate || !selectedLoja) {
      return Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "Informe a unidade e a data antes de prosseguir.",
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      });
    }

    const vendaData = {
      funcionarioId: usuarioData?.id,
      data_venda: selectedDate,
      lojaId: parseInt(selectedLoja),
      vendaDetalhes: cartItems.map((item: CartItem) => ({
        produtoId: parseInt(item.id),
        quantidade: item.quantidade,
      })),
    };

    try {
      await FormSetVenda(vendaData);
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Venda registrada no sistema.",
        background: "#0d0d10",
        color: "#fff",
        confirmButtonColor: "#10b981",
      }).then(() => clearCart());
    } catch (error) {
      Swal.fire({ icon: "error", title: "Erro", text: "Falha na comunicação.", background: "#0d0d10", color: "#fff" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* INDICADORES SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d0d10] border border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px]">Volume Total</p>
            <p className="text-3xl font-black text-white">{totalItems} <span className="text-xs text-gray-600 font-medium tracking-normal">itens</span></p>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500 border border-white/5">
            <TbShoppingBagExclamation size={24}/>
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-emerald-500/20 p-6 rounded-3xl flex items-center justify-between shadow-2xl shadow-emerald-900/10">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[2px]">Crédito de Pontos</p>
            <p className="text-3xl font-black text-emerald-500">{totalPoints.toLocaleString()} <span className="text-xs font-medium tracking-normal">pts</span></p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <FaPlus size={18}/>
          </div>
        </div>

        <div className="bg-[#0d0d10] border border-white/5 p-2 rounded-3xl flex items-center gap-2">
            <button 
                onClick={() => setViewMode("grid")}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
            >
                <FaTh size={16}/> <span className="text-[11px] font-bold uppercase tracking-wider">Grade</span>
            </button>
            <button 
                onClick={() => setViewMode("list")}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all duration-300 ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
            >
                <FaListUl size={16}/> <span className="text-[11px] font-bold uppercase tracking-wider">Lista</span>
            </button>
        </div>
      </div>

      {/* LISTA DE ITENS REFORMULADA */}
      <div className="min-h-[400px]">
        {cartItems.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6" 
            : "space-y-3"
          }>
            {cartItems.map((item: CartItem) => (
              <div 
                key={item.id} 
                className={`group bg-[#0d0d10] border border-white/5 rounded-3xl transition-all duration-300 hover:border-white/20 hover:bg-[#121216] ${
                  viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'flex flex-col p-4 space-y-4'
                }`}
              >
                {/* Imagem do Produto */}
                <div className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full aspect-square'} relative flex-shrink-0`}>
                  <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover rounded-2xl border border-white/5" />
                </div>
                
                {/* Infos do Produto */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-base leading-tight truncate">{item.nome}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-emerald-500 font-mono text-sm font-bold">{item.pontos} pts</span>
                    <span className="text-gray-600 text-[10px] uppercase font-bold tracking-tighter">por unidade</span>
                  </div>
                </div>

                {/* Controles de Quantidade e Delete */}
                <div className={`flex items-center gap-6 ${viewMode === 'grid' ? 'justify-between pt-2 border-t border-white/5' : ''}`}>
                  
                  {/* Seletor de Quantidade Pill-style */}
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 group/qty transition-colors hover:border-emerald-500/30">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantidade - 1)} 
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <FaMinus size={10}/>
                    </button>
                    <input 
                      type="text" 
                      value={item.quantidade} 
                      readOnly 
                      className="w-10 text-center bg-transparent text-sm font-black text-white outline-none" 
                    />
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantidade + 1)} 
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <FaPlus size={10}/>
                    </button>
                  </div>

                  <button 
                    onClick={() => handleRemoveItem(item.id)} 
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    title="Remover item"
                  >
                    <FaTrashAlt size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[40px]">
            <div className="p-8 bg-white/5 rounded-full text-gray-700">
              <TbShoppingBagExclamation size={80} />
            </div>
            <div className="text-center space-y-2">
              <p className="uppercase tracking-[4px] font-black text-gray-400 text-sm">Resumo Vazio</p>
              <p className="text-gray-600 text-xs">Adicione produtos no catálogo para processar a venda.</p>
            </div>
          </div>
        )}
      </div>

      {/* CONFIGURAÇÕES DE DESTINO E FINALIZAÇÃO */}
      <div className="bg-[#0d0d10] border border-white/5 rounded-[40px] p-10 mt-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
              <FaStore className="text-emerald-500"/> Selecionar Unidade
            </label>
            <div className="relative">
              <select
                value={selectedLoja}
                onChange={(e) => setSelectedLoja(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 text-white rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500/40 appearance-none cursor-pointer transition-all"
              >
                <option value="">Escolha a loja de destino...</option>
                {dataLojas?.GetLojas.result.map((loja: any) => (
                  <option key={loja.id} value={loja.id}>{loja.nome_fantasia}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                <FaArrowRight className="rotate-90" size={12}/>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
              <FaCalendarAlt className="text-emerald-500"/> Data do Registro
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-white/10 text-white rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-6 relative z-10">
          <div className="hidden lg:block">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Confirmação de Operação</p>
            <p className="text-gray-400 text-xs mt-1">Verifique os itens antes de enviar ao sistema.</p>
          </div>
          <button
            onClick={handleFinalize}
            disabled={loading || cartItems.length === 0}
            className={`flex-1 lg:flex-none lg:min-w-[400px] py-6 rounded-3xl font-black text-xs uppercase tracking-[4px] transition-all flex items-center justify-center gap-4 ${
              loading || cartItems.length === 0
              ? "bg-white/5 text-gray-600 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/40 active:scale-95"
            }`}
          >
            {loading ? "Processando..." : (
              <>
                Processar Venda
                <FaArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}