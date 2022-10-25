import React,{useEffect,useState,useMemo} from 'react'

const useTable = (initalData) => {


    const [filter,setFilter] = useState('')
    const [cargo,setCargo] = useState(initalData)
    const [tipo,setTipo] = useState('')
    const [data1,setData1] = useState([])
    const [data2,setData2] = useState([])
    const [dataTemp,setDataTemp] = useState({})
    const Tabla1 = useMemo(() => {
        let temp = data1
        if(cargo !== "Autorizador" && cargo !== "Cirugia"){
            temp = temp.filter( (item) => item.servicio === cargo )
        }
        if(filter == ''){
            return temp.sort((b,a) =>  Number(a.priorizacion) - Number(b.priorizacion));
        }
        temp = temp.filter((item) => item.documento == filter && item.tipo == tipo)
        return temp.sort((b,a) =>  Number(a.priorizacion) - Number(b.priorizacion));
    },[filter,data1,tipo])

    const Tabla2 = useMemo(() => {
        let temp = data2
      
        if(cargo !== "Autorizador" && cargo !== "Cirugia"){
            temp = temp.filter( (item) => item.servicio === cargo )
        }
        if(filter == ''){
            return temp.sort((b,a) =>  Number(a.TimeStap) - Number(b.TimeStap));
        }
        temp = temp.filter((item) => item.documento == filter && item.tipo == tipo)
      
        return temp.sort((b,a) =>  Number(a.TimeStap) - Number(b.TimeStap));

    },[filter,data2,tipo])

   
    useEffect(() => {

        if(initalData.length > 0){
            
            let temp = initalData.filter((item) => item.AuthTime ==0 )
            setData1(temp)
            temp = initalData.filter((item) => item.AuthTime !=0 )
            setData2(temp)

        }
    }, [])

    useEffect(() => {
       
        if(dataTemp.AuthTime){
            setData1(data1.filter((item) => item.TimeStap != dataTemp.TimeStap))
        }
        
    },[dataTemp])

   



    return [setFilter,data1,setData1,data2,setData2,Tabla1,Tabla2,setDataTemp,tipo,setTipo,setCargo]
}

export default useTable;