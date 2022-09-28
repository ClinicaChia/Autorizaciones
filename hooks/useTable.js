import React,{useEffect,useState,useMemo} from 'react'

const useTable = (initalData) => {


    const [filter,setFilter] = useState('')
    const [data1,setData1] = useState([])
    const [data2,setData2] = useState([])
    const [dataTemp,setDataTemp] = useState({})
    const Tabla1 = useMemo(() => {
        if(filter == ''){
            return data1.sort((b,a) =>  Number(a.priorizacion) - Number(b.priorizacion));
        }
        let temp = data1.filter((item) => item.documento == filter )
        return temp.sort((b,a) =>  Number(a.priorizacion) - Number(b.priorizacion));
    },[filter,data1])

    const Tabla2 = useMemo(() => {

        if(filter == ''){
            return data2.sort((b,a) =>  Number(a.TimeStap) - Number(b.TimeStap));
        }
        let temp = data2.filter((item) => item.documento == filter )
        return temp.sort((b,a) =>  Number(a.TimeStap) - Number(b.TimeStap));

    },[filter,data2])

   
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

   



    return [setFilter,data1,setData1,data2,setData2,Tabla1,Tabla2,setDataTemp]
}

export default useTable;