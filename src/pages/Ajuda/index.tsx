import { useState } from "react";
import { IoSearchOutline, IoChevronDown } from "react-icons/io5";
import { FaQuestionCircle } from "react-icons/fa";
import { faqData } from "./data";
import { EmptyState } from "../../components/Loader";

export function Ajuda() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = faqData.filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Dúvidas Frequentes</h1>
      </div>

      <div className="relative">
        <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Pesquisar perguntas..."
          className="w-full pl-11 pr-4 py-4 bg-[#0d0d10] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredFaqs.length === 0 ? (
        <EmptyState title="Nenhuma pergunta encontrada" icon={<FaQuestionCircle size={40} className="text-gray-600" />} />
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = expandedIndex === index;
            return (
              <div
                key={faq.question}
                className={`bg-[#0d0d10] border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "border-emerald-500/30" : "border-white/5"}`}
              >
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-bold text-white text-sm">{faq.question}</span>
                  <IoChevronDown
                    size={18}
                    className={`flex-shrink-0 text-emerald-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="text-gray-400 text-sm px-5 pb-5 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
