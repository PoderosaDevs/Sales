import React, { useState } from "react";
import { faqData } from "./data";

export function Ajuda() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleQuestions, setVisibleQuestions] = useState(5);

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const loadMore = () => {
    setVisibleQuestions(visibleQuestions + 5);
  };

  return (
    <div className="max-w-[1500px] pt-10 m-auto">
      <div className="bg-white px-10 py-6 rounded-xl flex flex-col mb-5 lg:mb-8">
        <div className="flex justify-between items-start border-0">
          <h3 className="flex flex-col items-start">
            <span className="font-bold text-3xl text-gray-800 mb-1">
              Dúvidas Frequentes
            </span>
          </h3>
        </div>

        {/* Barra de Pesquisa */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Pesquisar perguntas..."
            className="w-full p-2 border border-gray-300 rounded outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="py-3">
          <div className="tab-content">
            <div className="tab-pane fade show active" id="kt_table_widget_5_tab_1">
              <div className="flex flex-col space-y-4">
                {filteredFaqs.slice(0, visibleQuestions).map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4
                      className="font-semibold text-lg cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      {faq.question}
                    </h4>
                    {expandedIndex === index && (
                      <p className="text-gray-700 mt-2">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Botão "Ver Mais" */}
              {visibleQuestions < filteredFaqs.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={loadMore}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Ver mais perguntas
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
