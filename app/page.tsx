'use client'

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import BloodCart from "./components/BloodCard";

export default function Settings() {
    const [bloodsugars, setBloodsugars] = useState<any[]>([])

    const supabase = createClient()
    useEffect(() => {
        const fetchBloodsugars = async () => {
            let { data, error } = await supabase
                .from('blood_sugar')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.log(error)
                setBloodsugars([])
            }
            if (data) {
                setBloodsugars(data)
            }
        }

        fetchBloodsugars()
    }, [])

    return (
        <>
            <div className=" p-4 h-screen">
                {bloodsugars.length > 0 ?
                    //yes
                    <div className='grid grid-cols-3 gap-6 p-4'>
                        {bloodsugars.map(e => (
                            <BloodCart key={e.id} bloodsu={e} />
                        ))}
                    </div> :

                    //no
                    <div className='text-center text-2xl'>no data yet</div>}

            </div>
        </>
    )
}