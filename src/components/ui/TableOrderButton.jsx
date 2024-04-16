import {FaSortDown, FaSortUp} from "react-icons/fa6";

const TableOrderButton = ({label, order, sortBy, field, onClick}) => {
    return (
        <div className="d-flex align-items-center justify-content-between">
            <span>{label}</span>
            <button
                className="btn btn-link d-flex flex-column p-0"
                onClick={onClick}
            >
                <FaSortUp className={`
                    ${sortBy === field && order === 'asc' ? 'text-gray-600' : 'text-gray-400'}
                `} style={{marginBottom: "-7px"}}/>
                <FaSortDown
                    className={`
                        ${sortBy === field && order === 'desc' ? 'text-gray-600' : 'text-gray-400'}
                    `}
                    style={{marginTop: "-7px"}}/>
            </button>
        </div>
    );
};

export default TableOrderButton;