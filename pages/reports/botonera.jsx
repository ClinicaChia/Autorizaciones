import React from 'react';

const titles = ["Autorizaciones Solicitadas VS Autorizaciones Aprobadas por EPS","Cantidad de Anexos Solictados VS Anexos Aprobados por EPS",
                "Tiempo de Respuesta de Autorizaciones por EPS","Cantidad de Autorizaciones por Autorizador (diario)"]

const Botonera = ({submit}) => {
    
    const handleClick = (e) => {
        submit(e.target.name)
        
    }
    return (
        <div className='w-3/4 flex flex-wrap gap-4 justify-center mt-10'>

            
            {titles.map((title,index) => {
                return(
                    <button name={index+1} key={index} onClick={handleClick} className='p-2 bg-blue-700 text-white rounded-sm flex items-center justify-center h-16 w-1/2'>
                        {title}
                    </button>
                )
            })}
            
        </div>
    );
}

export default Botonera;
