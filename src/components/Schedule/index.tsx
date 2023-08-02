import { useEffect, useState } from 'react'

import { Schedule } from '@/schema'

export default function Schedule () {
  const [ schedule, setSchedule ] = useState<Schedule>()

  async function get_schedule () {
    const res  = await fetch('./api/schedule')
    if (res.ok) {
      const data = await res.json()
      setSchedule(data)
    }
  }

  useEffect(() => {
    if (schedule === undefined) {
      get_schedule()
    }
  }, [ schedule ])

  return (
   <div className="container">
      <div className="content">
        {
          schedule 
            && <pre>{JSON.stringify(schedule, null, 2)}</pre>
            || <p>Loading...</p>
        }
      </div>
    </div>
  )
}
