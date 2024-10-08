import React from 'react'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { FiPlusSquare } from "react-icons/fi";
import { Table } from './partials/Table';
import { MetaModal } from './partials/Modal';
export default function Metas() {
  return (
    <div className='max-w-[1500px] pt-10 m-auto'>
      <div className=" bg-white px-10 py-6 rounded-xl flex flex-col mb-5 lg:mb-8">
        <div className="flex justify-between items-start border-0">
          <h3 className="flex flex-col items-start">
            <span className="font-bold text-3xl text-gray-800 mb-1">Metas</span>
            {/* <span className="text-gray-500 mt-1 font-semibold text-sm">More than 400 new products</span> */}
          </h3>

          <MetaModal />

        </div>
        <div className="py-3">
          <div className="tab-content">
            <div className="tab-pane fade show active" id="kt_table_widget_5_tab_1">
              <Table />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
