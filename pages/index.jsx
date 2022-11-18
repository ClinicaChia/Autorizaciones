import Head from 'next/head'
import Image from 'next/image'


import Form from '../components/Form'


export default function Home() {


  return (
    <main className="flex min-h-screen justify-center items-center">
        <div className="bg-blue-800 w-1/2 min-h-screen flex items-center justify-center">
            <Image 
            
            src={'/LOGO.png'}
            width={600}
            height={250}
            
            />
        </div>

        <Form />
        
        

    </main>
  )
}
