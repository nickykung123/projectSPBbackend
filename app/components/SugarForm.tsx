"use client"

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'


interface calSugarInterface { //ลองใช้ interface
    resul:string
    hr:number
}

export default function SugarForm() {
    const [blood,setBlood] = useState('')
    const [result,setResult] = useState('')
    const [errorform,setErrorform] = useState('')
    const [heartrate,setHeartrate] = useState<number | null>(null)
    // const [userage,setUserage] = useState<number | null>(null)
    const router = useRouter()

    const supabase = createClient()

    const calhandler = async (e:any) => {
        e.preventDefault()

        if(!blood){
            setErrorform('จำเป็นต้องใส่ข้อมูลตัวเลข')
            setResult('')
            return
        }

        const numValue = parseFloat(blood);
        if (!numValue || numValue <= 0) {
            setErrorform("ข้อมูลต้องเป็นตัวเลขที่มากกว่า 0");
            setBlood('')
            return;
         }
         
         const res = await fetch("/api/calSugar", {
            method: "POST",
            body: JSON.stringify({ value: numValue }),
            headers: { "Content-Type": "application/json" },
          })
      
        const calculateResult:calSugarInterface = await res.json();
        setResult(calculateResult.resul);
        setErrorform('')
    }

    const savehandler = async (e:any) => {
      e.preventDefault()
      const { data, error } = await supabase
      .from('blood_sugar')
      .insert([
        { blood_value: blood, blood_result: result},
      ])
      .select()
        
      if(error){
        console.log('Some error happend ', error)
      }
      setResult('')
      setBlood('')
      setHeartrate(null)

      router.push('/')
    }

  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-16 w-full">
        <div className="h-[15vh] w-full bg-amber-400 text-center flex items-center justify-center"><p className="text-5xl font-sans font-bold text-white">Blood Sugar Calculator</p></div>
        <div className="w-2/3 border-2 border-amber-200 rounded-lg p-12 flex flex-col gap-12 drop-shadow-xl bg-pink-100 bg-opacity-80">
          <form className="flex flex-col gap-4 ">
            <input onChange={e => setBlood(e.target.value)} type="text" placeholder="blood sugar value" id='b' className="mx-20 p-4 outline-2 outline-offset-2 outline-amber-600 border-2 border-amber-500 rounded-lg"/>
            <div className='flex gap-32 justify-center'>
            <button onClick={calhandler} className="disabled:bg-amber-200 disabled:text-stone-500 hover:scale-105 transition-all uppercase py-4 px-32 bg-amber-400 rounded-lg font-semibold text-stone-600 mali-bold">calculate</button>
            <button onClick={savehandler} disabled={!blood || !result} className="disabled:bg-amber-200 disabled:text-stone-500 hover:scale-105 transition-all uppercase py-4 px-32 bg-amber-400 rounded-lg font-semibold text-stone-600 mali-bold">save</button>
            </div>
          </form>
          {
            errorform && (<div className="bg-red-500 p-2 text-lg text-white w-fit rounded-lg mali-medium-italic">{errorform}</div>)
          }
        </div>
        {
         result && (<p className="text-6xl font-serif text-emerald-500 mali-bold-italic">{result}</p>)
        }
      </div>
    </div>
  )
}