import React , {useState} from 'react';

const Fecha = ({msm,name,updateFecha}) => {

    const handleChange = (e) => {
       
        updateFecha(name,e.target.value)
    }
    
    return (
        <div className='flex '>
            <h3 className='p-2 bg-blue-700 text-white  rounded-sm flex items-center justify-center'>{msm}</h3>
            <input onChange={handleChange}  className='p-2 text-center border-2 border-blue-700 border-l-0' type="date" name={name} id="" />
        </div>
    );
}

export default Fecha;
